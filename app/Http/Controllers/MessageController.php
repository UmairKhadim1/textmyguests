<?php

namespace App\Http\Controllers;

use Validator;
use Carbon\Carbon;
use App\Message;
use App\Shindig;
use App\Http\Requests\SaveMessageRequest;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Image;
use Storage;
// use App\Notifications\PushNotification;
use App\Notifications\Notifications;
use OneSignal;
use App\UserTokens;
use App\Guest;
use App\Chat;
use App\PhoneNumber;
use App\InboundSMS;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, Shindig $shindig)
    {
        $shindig->load('messages.recipients');
        // Make sure the event belongs to the user
        $messages = $shindig->messages->map(function ($message) {
            return $this->transform($message, $message->shindig->timezone);
        });
        $data = [
            'status' => 'success',
            'data' => [
                'messages' => $messages
            ]
        ];
        return response()->json($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Message  $message
     * @return \Illuminate\Http\Response
     */
    public function show(Shindig $shindig, Message $message)
    {
        $message = $this->transform($message, $shindig->timezone);
        $data = [
            'status' => 'success',
            'data' => [
                'message' => $message
            ]
        ];
        return response()->json($data);
    }

    /**
     * Returns a message for the public stream.
     * The stream needs to be public.
     */

    public function showPublic(Message $message)
    {
        $shindig = $message->shindig;
        if ($shindig->is_stream_public && !$message->hidden) {
            $data = [
                'status' => 'success',
                'data' => $this->transformForReplyStream($message)
            ];
            return response()->json($data);
        }

        return response()->json([
            'status' => 'fail',
            'message' => 'Unauthorized'
        ], 401);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SaveMessageRequest $request, Shindig $shindig)
    {
        return $this->save($request, $shindig, new Message());
    }

    public function save(SaveMessageRequest $request, Shindig $shindig, Message $message)
    {
        $params = $request->validated();
        if (!$message->id) {  // set the event only if if new
            $message->shindig_id = $shindig->id;
        }

        // Make sure either the contents or the image is set
        if (!isset($params['contents']) && !isset($params['image'])) {
            $data = [
                'status' => 'failure',
                'data' => [
                    'message' => "You cannot send an empty message."
                ]
            ];
            return response()->json($data, 422);
        }

        // If there is an image, make sure the thumbnail is also provided (and vice versa)
        if ((isset($params['image']) && !isset($params['thumbnail'])) ||
            (!isset($params['image']) && isset($params['thumbnail']))
        ) {
            $data = [
                'status' => 'failure',
                'data' => [
                    'message' => "Sorry, we had a problem processing your image. Please try to upload your image again."
                ]
            ];
            return response()->json($data, 422);
        }

        // Make sure the message is not a promotional message (non-editable)
        if ($message->promotion) {
            $data = [
                'status' => 'failure',
                'data' => [
                    'message' => "You are not allowed to edit this message."
                ]
            ];
            return response()->json($data, 401);
        }

        // Make sure the message is scheduled before 30 days after the event
        $event_date = $shindig->event_date;
        $send_at = Carbon::createFromFormat(
            'm-d-Y h:i a',
            $params['date'] . ' ' . $params['time'],
            $shindig->timezone
        );
        if ($event_date) {
            if ($send_at->diffInDays($event_date, false) < -30) {
                $data = [
                    'status' => 'failure',
                    'data' => [
                        'message' => "You are not allowed to schedule a message more than 30 days after your event."
                    ]
                ];
                return response()->json($data, 422);
            }
        }

        // Make sure the message is not set to a past date
        if ($send_at->lessThan(Carbon::now())) {
            $data = [
                'status' => 'failure',
                'data' => [
                    'message' => "You cannot set a message in the past."
                ]
            ];
            return response()->json($data, 422);
        }

        // Make sure message is allowed to be enabled
        if (!$params['testMessage']) {
            if (
                $params['ready'] && (!$shindig->payment_status ||
                    $shindig->guests()->count() >= $shindig->paidGuestLimit())
            ) {
                $data = [
                    'status' => 'failure',
                    'data' => [
                        'message' => "You cannot enable this message because you have over 500 guests. Please contact us."
                    ]
                ];
                return response()->json($data, 422);
            }
        }

        $message->contents = $params['contents'];
        $message->is_testMessage = $params['testMessage'] ? 1 : 0;
        $message->media_url = $params['image'] ?? null;
        $message->thumbnail_url = $params['thumbnail'] ?? null;

        // Set the send parameters
        if ($params['immediately']) {
            $message->ready_to_send = 1;
            $message->send_at = Carbon::now();
        } else {
            $message->ready_to_send = $params['ready'] ? 1 : 0;
            $send_at = Carbon::createFromFormat('m-d-Y h:i a', $params['date'] . ' ' . $params['time'], $shindig->timezone);
            $send_at->timezone = 'UTC';
            $message->send_at = $send_at;
        }
        $message->save();
        try {
            //Pushing web notification on message sending
            $user = User::find(auth()->user()->id);
            $msg = strlen($message->contents) > 50 ? substr($message->contents, 0, 50) . '...' : $message->contents;
            $notification_data = [
                'message' => 'Your new message " ' . $msg . ' " has been scheduled',
                'data' => $this->transform($message->fresh(), $shindig->timezone),
                'notify_type' => "message_scheduled"
            ];
            $user->notify(new Notifications($notification_data));
            $users_token = UserTokens::select('user_token')->where('user_id', $user->id)->value('user_token');
            if ($users_token) {
                $data = [
                    'url' => env('APP_URL') . '/app/dashboard/messages'
                ];
                OneSignal::sendNotificationToUser(
                    'Your Message "' . $message->contents . '" has been scheduled',
                    $users_token,
                    $url = null,
                    $data,
                    $buttons = null,
                    $schedule = null
                );
            }
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
        }

        // Get the recipients
        $recipient_ids = array_map(function ($recipient) {
            return $recipient['id'];
        }, $params['recipients']);
        // sync the relation ships
        $message->recipients()->sync($recipient_ids);
        $data = [
            'status' => 'success',
            'data' => [
                'message' => $this->transform($message, $shindig->timezone),
            ]
        ];
        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(SaveMessageRequest $request, Shindig $shindig, Message $message)
    {
        return $this->save($request, $shindig, $message);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Message  $message
     * @return \Illuminate\Http\Response
     */
    public function destroy(Shindig $shindig, Message $message)
    {
        // Make sure the message is not a promotional message (non-editable)
        if ($message->promotion) {
            $data = [
                'status' => 'failure',
                'data' => [
                    'message' => "You are not allowed to edit this message."
                ]
            ];
            return response()->json($data, 422);
        }

        $message->recipients()->sync([]);
        $message->delete();
        return response()->json([
            'status' => 'success',
            'data' => [
                'messages' => $shindig->messages->map(function ($message) {
                    return $this->transform($message, $message->shindig->timezone);
                })
            ]
        ]);
    }

    public function toggleReady(Request $request)
    {
        $user = auth()->user();
        $validator = Validator::make($request->all(), [
            'message_id' => 'required|integer|exists:messages,id',
            'enable' => 'required|boolean'
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors();
            $data = [];
            if ($errors->has('message_id')) {
                $data['message_id'] = $errors->first('message_id');
            }
            if ($errors->has('enable')) {
                $data['enable'] = $errors->first('enable');
            }
            return response()->json([
                'status' => 'fail',
                'data' => $data,
            ], 422);
        }
        $message = Message::find($request->input('message_id'));
        // Make sure we can really edit it
        $shindig = $message->shindig;
        if ($shindig->owners()->where('id', $user->id)->get() == null) {
            return response()->json([
                'status' => 'fail',
                'data' => [
                    'auth' => 'You are not authorized to edit this message',
                ],
            ]);
        }
        $message->ready_to_send = $request->input('enable');
        $message->save();
        return response()->json(['status' => 'success', 'data' => null]);
    }

    public static function transform(Message $message, $timezone)
    {
        $recipients = $message->recipients->map(function ($recipient) {
            return [
                'id' => $recipient->id,
                'name' => $recipient->group_name,
                'is_all' => $recipient->is_all ? true : false,
            ];
        });
        $send_at = $message->send_at;
        if ($send_at) {
            $send_at->timezone = $timezone;
            $send_at = $send_at->toDateTimeString();
        }
        return [
            'id' => $message->id,
            'event_id' => $message->shindig_id,
            'name' => $message->name,
            'content' => $message->contents,
            'testMessage' => $message->is_testMessage,
            'image' => $message->media_url,
            'image_thumbnail' => $message->thumbnail_url,
            'ready_to_send' => $message->ready_to_send ? true : false,
            'send_at' => $send_at,
            'sent' => $message->sent != null ? $message->sent->toDateTimeString() : null,
            'recipients' => $recipients,
            'promotion' => $message->promotion
        ];
    }

    public static function transformForReplyStream(Message $message)
    {
        $shindig = $message->shindig;
        $owners = $shindig->owners;

        $first_owner = $owners[0];
        $sender = $first_owner
            ? $first_owner->first_name . ' ' . $first_owner->last_name
            : 'Your host';

        $media = $message->media_url ? [
            [
                'id' => "", // No id needed for images attached to a message
                'url' => $message->media_url,
                'mimeType' => "image" // frontend only wants to know if it's a video or not
            ]
        ] : [];

        return [
            'id' => $message->id,
            'type' => 'message',
            'received_at' => $shindig->timezone ?
                $message->sent->tz($shindig->timezone)->toDateTimeString()
                : $message->sent->toDateTimeString(),
            'body' => $message->contents,
            'sender' => $sender,
            'medias' => $media,
            'hidden' => $message->hidden
        ];
    }

    public function toggleHiddenFromReplyStream(Request $request, Shindig $shindig)
    {
        // Make sure request comes from an owner
        if (!auth()->user()->shindigs()->find($shindig->id)) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Unauthorized'
            ], 401);
        }

        // Validate the data from request
        $validator = Validator::make($request->all(), [
            'message_id' => 'integer|exists:messages,id',
            'reply_id' => 'integer|exists:inbound_sms,id',
            'hidden' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $data = [];
            if ($errors->has('message_id')) {
                $data['message_id'] = $errors->first('message_id');
            }
            if ($errors->has('reply_id')) {
                $data['reply_id'] = $errors->first('reply_id');
            }
            if ($errors->has('hidden')) {
                $data['hidden'] = $errors->first('hidden');
            }
            return response()->json([
                'status' => 'fail',
                'data' => $data,
            ], 422);
        }

        if ($request->message_id) {
            $shindig->messages()
                ->where('id', $request->message_id)
                ->update(['hidden' => $request->hidden]);
        } else if ($request->reply_id) {
            $shindig->inboundSMS()
                ->where('id', $request->reply_id)
                ->update(['hidden' => $request->hidden]);
        } else {
            return response()->json([
                'status' => 'fail'
            ], 422);
        }

        return response()->json(['status' => 'success']);
    }

    public function uploadImage(Request $request, Shindig $shindig)
    {
        request()->validate([
            'image' => 'required|mimes:jpeg,png,jpg,gif,svg|max:10240', // 10 MB max size
        ]);

        // We get the image from the request
        $image = Image::make($request->file('image'));
        $thumbnail = Image::make($request->file('image'));

        // Resize the image to a max filesize of 600 KB
        $image = $this->resizeImage($image, 600);
        $image->stream();

        // Resize for thumbnail
        $thumbnail = $this->resizeImageForThumbnail($thumbnail, 150);
        $thumbnail->stream();

        // Create a unique name to store the image
        $ext = $request->file('image')->extension();
        $now = Carbon::now()->toDateTimeString();
        $hash = md5($image->__toString() . $now);
        $filename = $shindig->id . '/' . $hash . '.' . $ext;
        $thumbnail_filename = $shindig->id . '/' . $hash . '_thumbnail' . '.' . $ext;

        // Store the image and its thumbnail on s3 disk
        Storage::put($filename, $image->__toString(), 'public');
        Storage::put($thumbnail_filename, $thumbnail->__toString(), 'public');

        return response()->json([
            'status' => 'success',
            'data' => [
                'thumbnail' => Storage::url($thumbnail_filename),
                'image' => Storage::url($filename)
            ]
        ]);
    }

    /**
     * Resize an image to a given max width or height
     *
     * @param  Image  $img
     * @param  integer $maxFileSize  Max file size in Kb
     * @return Image
     */
    public function resizeImage($img, $max_file_size)
    {
        $width = $img->width();
        $height = $img->height();
        $filesize = $img->filesize();

        // 1 KB = 1024 bytes (binary)
        if ($filesize > $max_file_size * 1024) {

            // If the file size is too big, we resize the image
            // to a max dimension of 1600 or 80% of its size if already
            // smaller than 2000 (80% of 2000 is 1600).
            if ($width >= $height) {
                $max_width = $width > 2000 ? 1600 : round($width * 0.8);
                $img->widen($max_width, function ($constraint) {
                    $constraint->upsize();
                });
            } else if ($height >= $width) {
                $max_height = $height > 2000 ? 1600 : round($height * 0.8);
                $img->heighten($max_height, function ($constraint) {
                    $constraint->upsize();
                });
            }
        }

        return $img;
    }

    /**
     * Resize an image to create a thumbnail
     *
     * @param  Image  $img
     * @param  integer $maxSize  Max file size in Kb
     * @return Image
     */
    public function resizeImageForThumbnail($img, $size)
    {
        $width = $img->width();
        $height = $img->height();

        if ($width >= $height) {
            $img->widen($size, function ($constraint) {
                $constraint->upsize();
            });
        } else if ($height >= $width) {
            $img->heighten($size, function ($constraint) {
                $constraint->upsize();
            });
        }

        return $img;
    }

    public function sendChatMessage(Request $request, Shindig $shindig, Chat $message)
    {
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|integer|exists:guests,id',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors();
            $data = [];
            if ($errors->has('receiver_id')) {
                $data['receiver_id'] = $errors->first('receiver_id');
            }
            return response()->json([
                'status' => 'fail',
                'data' => $data,
            ], 422);
        }

        $guest = Guest::find($request->receiver_id);

        $message->shindig_id = $shindig->id;
        $message->sender_id = auth()->user()->id;
        $message->receiver_id = $request->receiver_id;
        $message->contents = $request->contents;
        $message->media_url = $request->image ?? null;
        $message->thumbnail_url = $request->thumbnail ?? null;
        $saveMessage = $message->save();


        if (\App\PhoneNumber::where("shindig_id", $shindig->id)->count() > 0) {
            $message_service_sid = $shindig->messagingServiceSid;
            $phone_number = PhoneNumber::where('shindig_id', $shindig->id)->first()->number;
        } else {
            $message_service_sid = NULL;
            $phone_number = '+18456689502';
        }
        if ($guest && $saveMessage) {
            // $message->directRecipients()->sync($guest->id);
            if (isset($guest->guest_phone) && $guest->guest_phone != '' && !$guest->guest_opting) {
                @\App\sendSMS2($guest->guest_phone,    $message->contents, $message->media_url, $message_service_sid, NULL, $phone_number);
            }
            $message->send_at = Carbon::now();
            $saveMessage = $message->save();
            $data = [
                'status' => 'success',
                'data' => [
                    'message' => $message
                ]
            ];
            return response()->json($data, 200);
        } else {
            return response()->json(
                ['status' => 'failed'],
                400
            );
        }
    }
    public function getChatMessages(Request $request, Shindig $shindig)
    {
        $chats = Chat::where('receiver_id', $request->get('receiver_id'))->where('shindig_id', $shindig->id)->get();
        $data = [
            'status' => 'success',
            'data' => [
                'message' =>  $chats
            ]
        ];
        return response()->json($data, 200);
    }
    public function getAllRecipientsWithLastMessage(Request $request, Shindig $shindig)
    {

        $chats = $shindig->chats()->distinct()->get('receiver_id')->toArray();

        $chat_messages = [];
        foreach ($chats as $chat) {
            $data = $shindig->chats()->where('receiver_id', $chat['receiver_id'])->latest()->first();
            $guest = Guest::find($data->receiver_id);
            if ($guest) {
                $sender = $guest
                    ? $guest->guest_firstname . ' ' . $guest->guest_lastname
                    : $guest->guest_phone;

                $chatMessages = array(
                    'id' => $data->receiver_id,
                    'sender' => $sender,
                    'phone_number' => $guest->guest_phone,
                    'sender_type' => 'onwer',
                    'media' => $data->media_url,
                    'contents' => $data->contents,
                    'send_at' => $data->send_at

                );
                array_push($chat_messages, $chatMessages);
            }
        }

        $inboundMsgs = $shindig->InboundSMS()->distinct()->get('fromPhone')->toArray();
        foreach ($inboundMsgs as $inboundMsg) {
            $data = $shindig->InboundSMS()->where('fromPhone', $inboundMsg['fromPhone'])->latest('received_at')->first();

            $guest = $shindig->getGuest($data->fromPhone);
            $sender = $guest
                ?  $guest->guest_firstname . ' ' . $guest->guest_lastname
                : $data->fromPhone;

            $inboundMessages = array(
                'id' => $guest && $guest->id,
                'sender' => $sender,
                'phone_number' => $guest && $guest->guest_phone,
                'sender_type' => 'guest',
                'media' => $data->MediaUrl0,
                'contents' => $data->body,
                'send_at' => $data->received_at

            );
            array_push($chat_messages, $inboundMessages);
        }
        $chat_messages = collect($chat_messages);

        $sorted_chat_messages = $chat_messages->sortBy('send_at')->groupBy('id');

        $sorted_messages = array();
        foreach ($sorted_chat_messages as $sorted_chat_message) {

            array_push($sorted_messages, $sorted_chat_message[count($sorted_chat_message) - 1]);
        }

        $data = [
            'status' => 'success',
            'data' => [

                'message' =>  'your record fetched successfully',
                'data' => array_reverse($sorted_messages),
            ]
        ];
        return response()->json($data, 200);
    }



    //get all users

    public function getUserAllMessages(Request $request, Shindig $shindig)
    {
        $chat_messages = [];
        //$chats= Chat::where('sender_id', $request->get('guest_id'))->toarr();
        $chats = Chat::where('receiver_id', $request->get('guest_id'))->get();
        $guest = Guest::find($request->get('guest_id'));
        $sender = $guest
            ?  $guest->guest_firstname . ' ' . $guest->guest_lastname
            : "user";
        foreach ($chats as $chat) {
            $chatMessages = array(
                'id' => $chat->sender_id,
                'sender' => $sender,
                'phone_number' => $guest && $guest->guest_phone,
                'message_type' => 'send',
                'media' => $chat->media_url,
                'contents' => $chat->contents,
                'send_at' => $chat->send_at

            );
            array_push($chat_messages, $chatMessages);
        }

        $inboundMsgs = $shindig->InboundSMS()->where('shindig_id', $shindig->id)->where('fromPhone', $guest && $guest->guest_phone)->get();

        foreach ($inboundMsgs as $inboundMsg) {
            // $guest = $shindig->getGuest($inboundMsg->fromPhone);
            $guests = Guest::where('guest_phone', $inboundMsg->fromPhone)->get();
            foreach ($guests as $guest) {
                $sender = $guest
                    ?  $guest->guest_firstname . ' ' . $guest->guest_lastname
                    : $inboundMsg->fromPhone;

                $inboundMessages = array(
                    'id' => $guest && $guest->id,
                    'sender' => $sender,
                    'phone_number' => $guest->guest_phone,
                    'message_type' => 'receive',
                    'media' => $inboundMsg->MediaUrl0,
                    'contents' => $inboundMsg->body,
                    'send_at' => $inboundMsg->received_at
                );
            }
            array_push($chat_messages, $inboundMessages);
        }
        $chat_messages = collect($chat_messages);
        $sorted_chat_messages = $chat_messages->sortBy('send_at');
        $sorted_messages = array();
        foreach ($sorted_chat_messages as $sorted_chat_message) {
            array_push($sorted_messages, $sorted_chat_message);
        }

        $data = [
            'status' => 'success',
            'data' => [

                'message' =>  'your record fetched successfully',
                'data' => $sorted_messages,
            ]
        ];
        return response()->json($data, 200);
    }
}
