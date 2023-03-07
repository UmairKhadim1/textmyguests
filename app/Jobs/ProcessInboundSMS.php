<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use App\InboundSMS;
use App\Shindig;
use App\Message;
use App\Guest;
use App\MessageRecipient;
use App\Activity;
use App\Media;
use App\GroupMembership;
use App\PhoneNumber;
use Carbon\Carbon;

use Twilio\Rest\Client;

class ProcessInboundSMS implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // hard code max 1 tries before failing to avoid stuck jobs (try only once because this job modifies the DB)
    public $tries = 1;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(InboundSMS $theSMS)
    {
        $this->sms = $theSMS;
    }

    private $sms;

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // figure out what to do with this SMS we just got
        // Option A: it's from the shindig owner
        // Option B: it's from a shindig guest - just log it for later review

        // *** first, save it to the activity table
        $activity = Activity::create([
            'messagingServiceSid' => $this->sms->messagingServiceSid,
            'messageSid' => $this->sms->messageSid,
            'fromPhone' => $this->sms->fromPhone,
            'toPhone' => $this->sms->toPhone,
            'occurred_at' => $this->sms->received_at,
            'body' => $this->sms->body,
            'numMedia' => (int) $this->sms->numMedia,
            'twilioStatus' => 'received' // this is what twilio calls it, I just didn't save it in the InboundSMS object
        ]);

        // *** second, process any media into Media objects
        if ((int) $this->sms->numMedia > 0) {
            $sid = env('TWILIO_LIVE_SID', null);
            $token = env('TWILIO_LIVE_TOKEN', null);
            if ($sid != null && $token != null) {
                // use twilio API to get all images on the message and save them to the database
                $twilio = new Client($sid, $token);
                $media_list = $twilio->Messages($this->sms->messageSid)->media->read();

                foreach ($media_list as $media) {
                    $m = new Media;

                    if ($this->sms->shindig_id) {
                        $m->shindig_id = $this->sms->shindig_id;
                    } else {
                        $m->shindig_id = 0;
                    }

                    $m->parent_sid = $media->parentSid;
                    $m->media_sid = $media->sid;
                    //$m->date_created = Carbon::parse($media->dateCreated->date.$media->dateCreated->timezone);
                    $m->date_created = Carbon::now()->toDateTimeString();

                    $filename = $media->uri;
                    $m->twilio_url = 'https://api.twilio.com' . pathinfo($filename, PATHINFO_DIRNAME) . '/' . pathinfo($filename, PATHINFO_FILENAME);
                    $m->content_type = $media->contentType;

                    $m->save();

                    // copy file from the URL to S3 using Storage - in a separate job so not to slow this one down
                    CopyToS3::dispatch($m)->onQueue('default');
                }
            }
        }

        /* use the toNumber and fromNumber to identify the shindig and whether this is from the owner */
        $result = \DB::table('shindigs')
            ->join('phone_numbers', 'phone_numbers.shindig_id', '=', 'shindigs.id')
            ->join('shindig_ownership', 'shindig_ownership.shindig_id', '=', 'shindigs.id')
            ->join('users', 'shindig_ownership.user_id', '=', 'users.id')
            ->select(
                'shindigs.id as shindig_id',
                'shindigs.messagingServiceSid',
                'shindigs.timezone as shindig_timezone',
                'phone_numbers.id as phone_number_id',
                'phone_numbers.number as phone_number',
                'users.id as user_id',
                'users.mobilePhone as user_mobilePhone'
            )
            ->where('phone_numbers.number', $this->sms->toPhone)
            ->where('users.mobilePhone', $this->sms->fromPhone)
            ->get();


        // this message is from the event owner
        if ($result->count() > 0) {

            // show the message on the reply stream
            $this->sms->hidden = FALSE;
            $this->sms->save();
        }

        // no registered TMG user has this phone number, the SMS must be from a guest OR SPAM (we will just sort this out at display-time using Shindig->isGuest())
        else {

            $guest = Guest::where('guest_phone', $this->sms->fromPhone)->where('shindig_id', $this->sms->shindig_id)->first();

            if (isset($guest)) {
              
                
                // this is a guest we know, allow it to show in the reply stream
                $this->sms->hidden = FALSE;
                $this->sms->save();
            } else { // never heard of ya

                // see if they are trying to (and allowed to) opt-in to messages from the shindig
                // if yes, add them as a guest and to the 'All Guests' group of the shindig
                if (strtolower($this->sms->body) == 'join' && $this->sms->shindig->text_to_join) {
                    $g = new Guest([
                        'shindig_id' => $this->sms->shindig_id,
                        'guest_phone' => $this->sms->fromPhone,
                    ]);
                    $g->save();

                    $mem = new GroupMembership([
                        'group_id' => $this->sms->shindig->getAllGuestGroup()->id,
                        'guest_id' => $g->id,
                    ]);
                    $mem->save();
                    $phone_number = PhoneNumber::where('shindig_id', $this->sms->shindig_id)->latest('id')->first();
                    // send a confirmation
                    $body = 'Thank you for joining ' . $this->sms->shindig->name . '! You will now receive text messages associated with this event. You can reply to share pictures and messages with the hosts. Reply STOP anytime to cancel.';
                    \App\sendSMS2($this->sms->fromPhone, $body, NULL, $this->sms->shindig->messagingServiceSid, NULL, $phone_number);
                }
            }
        }

        // hide "STOP" and iOS reactions from the reply stream

        if (strtolower($this->sms->body) == "stop") {
            $guest = Guest::where('guest_phone', $this->sms->fromPhone)->where('shindig_id', $this->sms->shindig_id)->first();
    if($guest )
    {
        $guest->guest_opting=1;
        $guest->save();
    }
         
            $this->sms->hidden = TRUE;
            $this->sms->save();
        }
        if (strtolower($this->sms->body) == "start") {
            $guest = Guest::where('guest_phone', $this->sms->fromPhone)->where('shindig_id', $this->sms->shindig_id)->first();
    if($guest )
    {
        $guest->guest_opting=0;
        $guest->save();
    }
         
            $this->sms->hidden = FALSE;
            $this->sms->save();
        }

        if ($this->sms->body == "Liked an image") {
            $this->sms->hidden = TRUE;
            $this->sms->save();
        }

        if (str_starts_with($this->sms->body, 'Liked “') || str_starts_with($this->sms->body, 'Disliked “') || str_starts_with($this->sms->body, 'Loved “') || str_starts_with($this->sms->body, 'Emphasized “') || str_starts_with($this->sms->body, 'Laughed at “')) {
            $this->sms->hidden = TRUE;
            $this->sms->save();
        }

        // mark the $sms as processed and finish the job
        $this->sms->processed_at = Carbon::now()->toDateTimeString();
        $this->sms->save();
    }
}
