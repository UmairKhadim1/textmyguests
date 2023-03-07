<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Activity;
use App\PhoneNumber;
use App\InboundSMS;
use App\Jobs\ProcessInboundSMS;
use App\UserTokens;
use OneSignal;
use App\Notifications\Notifications;

class SMSController extends Controller
{

    public function inbound(Request $request)
    {
        // handle an incoming SMS from Twilio - kickoff a ProcessIncomingSMS job with the InboundSMS

        // EXAMPLE: ApiVersion=2010-04-01&MessagingServiceSid=MG28310c22bea3fb0ada7d01667dbb2476&SmsSid=SMd4e8536f5da85de88aa00b5ac10fe62e&SmsStatus=received&SmsMessageSid=SMd4e8536f5da85de88aa00b5ac10fe62e&NumSegments=1&From=%2B17046612244&ToState=DC&MessageSid=SMd4e8536f5da85de88aa00b5ac10fe62e&AccountSid=ACdf7a6689d9f8bddb058da29c269c0396&ToZip=&FromCountry=US&ToCity=&FromCity=CHARLOTTE&To=%2B12028398478&FromZip=28217&Body=First+ever+text+to+TMG&ToCountry=US&FromState=NC&NumMedia=0

        $this_sms = new InboundSMS;

        if ($request->filled('MessageSid')) {
            $this_sms->messageSid = $request->input('MessageSid');
        }
        if ($request->filled('MessagingServiceSid')) {
            $this_sms->messagingServiceSid = $request->input('MessagingServiceSid');
        }

        if ($request->filled('From')) {
            $this_sms->fromPhone = $request->input('From');
        }
        if ($request->filled('To')) {
            $to_phone = $request->input('To');
            $this_sms->toPhone = $to_phone;
            $this_sms->shindig_id = PhoneNumber::where('number', $to_phone)->first()->shindig_id;
        }
        if ($request->filled('Body')) {
            $this_sms->body = substr(trim($request->input('Body')), 0, 1024);
        }
        if ($request->filled('NumMedia')) {
            $this_sms->numMedia = $request->input('NumMedia');
        }
        if ($request->filled('MediaUrl0')) {
            $this_sms->MediaUrl0 = $request->input('MediaUrl0');
        }
        if ($request->filled('MediaUrl1')) {
            $this_sms->MediaUrl1 = $request->input('MediaUrl1');
        }
        if ($request->filled('MediaUrl2')) {
            $this_sms->MediaUrl2 = $request->input('MediaUrl2');
        }
        if ($request->filled('MediaUrl3')) {
            $this_sms->MediaUrl3 = $request->input('MediaUrl3');
        }
        if ($request->filled('MediaUrl4')) {
            $this_sms->MediaUrl4 = $request->input('MediaUrl4');
        }
        if ($request->filled('MediaUrl5')) {
            $this_sms->MediaUrl5 = $request->input('MediaUrl5');
        }
        if ($request->filled('MediaUrl6')) {
            $this_sms->MediaUrl6 = $request->input('MediaUrl6');
        }
        if ($request->filled('MediaUrl7')) {
            $this_sms->MediaUrl7 = $request->input('MediaUrl7');
        }
        if ($request->filled('MediaUrl8')) {
            $this_sms->MediaUrl8 = $request->input('MediaUrl8');
        }
        if ($request->filled('MediaUrl9')) {
            $this_sms->MediaUrl9 = $request->input('MediaUrl9');
        }

        $this_sms->received_at = now();
        $this_sms->processed_at = null;

        // hide from reply stream by default in case of spam or commands
        $this_sms->hidden = TRUE;

        $this_sms->save();
        $users = $this_sms->shindig->owners()->get();

        foreach ($users as $user) {
            try {

                // $notification_data = [
                //     'message' => "You just received a message",
                //     'data' => $this_sms,
                //     'notify_type' => 'message_received'
                // ];
                // $user->notify(new Notifications($notification_data));

                $users_token = UserTokens::select('user_token')->where('user_id', $user->id)->value('user_token');
                if ($users_token) {
                    $data = [
                        'url' => env('APP_URL') . '/app/dashboard/messages'
                    ];
                    OneSignal::sendNotificationToUser(
                        'You just received a message',
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
        }
        ProcessInboundSMS::dispatch($this_sms)->onQueue('default');
    }

    public function callback(Request $request)
    {
        // process an SMS callback from Twilio

        // EXAMPLE: ApiVersion=2010-04-01&MessagingServiceSid=MG28310c22bea3fb0ada7d01667dbb2476&MessageStatus=delivered&SmsSid=SMe08a0749e0864959bc49d92990c1e671&SmsStatus=delivered&From=%2B12028398478&To=%2B17046612244&MessageSid=SMe08a0749e0864959bc49d92990c1e671&Body=Activity+recorded+right%3F&AccountSid=ACdf7a6689d9f8bddb058da29c269c0396

        if ($request->filled('MessageSid')) {
            $this_activity = Activity::where('messageSid', $request->MessageSid)->first();

            if ($this_activity) {
                $this_activity->twilioStatus = $request->MessageStatus; // should be queued, then delivered
                $this_activity->fromPhone = $request->From; // because we don't always know what phone number Messaging Service used
                $this_activity->save();
            }
        }
    }

    /**
     * Returns a reply for the public stream.
     * The stream needs to be public.
     */

    public function showPublic(InboundSMS $sms)
    {
        $shindig = $sms->shindig;
        if ($shindig->is_stream_public && !$sms->hidden) {
            $data = [
                'status' => 'success',
                'data' => $this->transformForReplyStream($sms)
            ];
            return response()->json($data);
        }

        return response()->json([
            'status' => 'fail',
            'message' => 'Unauthorized'
        ], 401);
    }

    public static function transformForReplyStream(InboundSMS $sms)
    {
        // Get medias urls
        $media = $sms->media->map(function ($m) {
            return [
                'id' => $m->id,
                'url' => $m->getS3URL(),
                'mimeType' => $m->content_type
            ];
        })->all();

        // We find the guest who sent the reply
        $shindig = $sms->shindig;

        if (!$shindig) {
            return null;
        }

        $guest = $shindig->getGuest($sms->fromPhone);
        $sender = $guest
            ? $guest->guest_firstname . ' ' . substr($guest->guest_lastname, 0, 1) . '.'
            : substr($sms->fromPhone, 0, strlen($sms->fromPhone) - 2) . '**';

        // Format data
        return [
            'id' => $sms->id,
            'type' => 'reply',
            'received_at' => $shindig->timezone ?
                $sms->received_at->tz($shindig->timezone)->toDateTimeString()
                : $sms->received_at->toDateTimeString(),
            'medias' => $media,
            'body' => $sms->body,
            'sender' => $sender,
            'hidden' => $sms->hidden,
        ];
    }
}
