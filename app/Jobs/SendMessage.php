<?php

namespace App\Jobs;

use App\PhoneNumber;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use Carbon\Carbon;

class SendMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // hard code max 1 tries before failing to avoid stuck jobs (this job sends SMS, so only try once)
    public $tries = 1;

    public $msg;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(\App\Message $theMessage)
    {
        $this->msg = $theMessage;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // send the specified message using Twilio

        // Stamp the message as sent when we BEGIN trying to send it
        // This prevents the scenario where send fails halfway through, but the user thinks the message has not sent, and tries again
        // So, log the sent time for the message and set ready_to_send is true (since it is in fact being sent)
        $this->msg->ready_to_send = TRUE;
        $this->msg->sent = Carbon::now();
        $this->msg->save();

        // use the shindig's MessageService if it has any numbers, otherwise use our default
        if (\App\PhoneNumber::where("shindig_id", $this->msg->shindig->id)->count() > 0) {
            $message_service_sid = $this->msg->shindig->messagingServiceSid;
            // $phone_number = '+18456689502';
            $phone_number = PhoneNumber::where('shindig_id', $this->msg->shindig_id)->first()->number;
        } else {
            $message_service_sid = NULL;
            $phone_number = '+18456689502';
        }

        // iterate through all groups, and then all guests in each group - send them the message
        // Some guests might be in different groups and we shouldn't send them the same
        // message twice, so keep track of guests we already iterated over.
        $rememberGuests = [];
        foreach ($this->msg->recipients as $group) {
            foreach ($group->guests as $guest) {
                if (!array_key_exists($guest->id, $rememberGuests) && isset($guest->guest_phone) && $guest->guest_phone != '') {
                    @\App\sendSMS2($guest->guest_phone, $this->msg->contents, $this->msg->media_url, $message_service_sid, $this->msg->id, $phone_number);
                }

                $rememberGuests[$guest->id] = true;
            }
        }

        // update the sent time for the message (since we just finished sending it)
        //$this->msg->sent = Carbon::now();
        //$this->msg->save();
    }
}
