<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use App\PhoneNumber;
use App\Activity;
use App\Message;
use App\Mail\PhoneNumberAboutToRelease;
use App\Shindig;
use Illuminate\Support\Facades\Mail;

use Carbon\Carbon;

class UpdatePhoneNumbers implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // hard code max 1 tries before failing to avoid stuck jobs (this job modifies PhoneNumbers, so only try once)
    public $tries = 1;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        // this job doesn't need any Models passed to it
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {


        // Number policy - delete all numbers at least 90 days old, with no activity in last 60 days, with no future messages scheduled
        // Only release production numbers - don't mess with dev or local
        if (\App::environment() == 'production') {

            //delete all numbers that are provisioned 30 days ago and are not activated
            $shindigs = Shindig::whereDate('created_at', '=', Carbon::now()->subDays(30)->format('Y-m-d'))
                ->where('payment_status', 0)
                ->get();
            foreach ($shindigs as $shindig) {
                $phone_number = PhoneNumber::where('shindig_id', $shindig->id)->get();
                foreach ($phone_number as $phone) {
                    if (isset($phone)) {
                        $phone->release();
                    }
                }
            }

            // Get phone numbers that renew tomorrow
            $phone_numbers = PhoneNumber::where('dont_release', 0)
                ->whereDate('renews_at', Carbon::now()->addDay()->format('Y-m-d'))
                ->get();

            foreach ($phone_numbers as $phone_number) {
                // if ($this->shouldRelease($phone_number, 90, 60)) {
                //     $phone_number->release();
                // } 
                if ($this->shouldRelease($phone_number, 30)) {
                    $phone_number->release();
                } else {
                    $phone_number->renews_at = Carbon::parse($phone_number->renews_at)->addMonthNoOverflow();
                    $phone_number->save();
                }
                //Event date has already passed 30 days prior. There are no messages scheduled to be delivered in the future
                // if ($this->doReleased($phone_number)) {
                //     $phone_number->release();
                // }
            }

            // Repeat the same steps for numbers about to expire in 1 week.
            // We want to inform admins about it.
            $next_phone_numbers = PhoneNumber::where('dont_release', 0)
                ->whereDate('renews_at', Carbon::now()->addDays(7)->format('Y-m-d'))
                ->get();

            foreach ($next_phone_numbers as $phone_number) {
                if ($this->shouldRelease($phone_number, 84, 54)) {
                    Mail::to("help@textmyguests.com")
                        ->queue(
                            new PhoneNumberAboutToRelease(
                                $phone_number,
                                Carbon::now()->addDays(7)->format('Y-m-d')
                            )
                        );
                }
            }
        }
    }

    private function shouldRelease(PhoneNumber $phone_number, $days_provisioned)
    {
        // Was the number provisioned at least 30 days ago?
        if (
            Carbon::parse($phone_number->provisioned_at)
            ->greaterThanOrEqualTo(Carbon::now()->subDays($days_provisioned))
        ) {
            return false; // don't release the number
        }

        //Event date has already passed 30 days prior
        $shindig = Shindig::where('id', $phone_number->shindig_id)
            ->whereDate('event_date', '>=', Carbon::now()->subDays(30))
            ->get();
        if (!$shindig->isEmpty()) {
            return false; //don't release the number
        }



        // Does the shindig has any future message scheduled?
        $messages_to_send = Message::where('shindig_id', $phone_number->shindig->id)
            ->whereDate('send_at', '>=', Carbon::now())
            ->where('ready_to_send', 1)
            ->whereNull('sent')
            ->exists();
        if ($messages_to_send) {
            return false; // don't release the number
        }

        return true; // should release the number
    }

    // private function shouldRelease(PhoneNumber $phone_number, $days_provisioned, $days_without_message)
    // {
    //     // Was the number provisioned at least 90 days ago?
    //     if (
    //         Carbon::parse($phone_number->provisioned_at)
    //         ->greaterThanOrEqualTo(Carbon::now()->subDays($days_provisioned))
    //     ) {
    //         return false; // don't release the number
    //     }

    //     // Was the phone number used in the past 60 days?
    //     $hasActivities = Activity::where('fromPhone', $phone_number->number)
    //         ->whereDate('occurred_at', '>', Carbon::now()->subDays($days_without_message))
    //         ->exists();
    //     if ($hasActivities) {
    //         return false; // don't release the number
    //     }

    //     // Does the shindig has any future message scheduled?
    //     $messages_to_send = Message::where('shindig_id', $phone_number->shindig->id)
    //         ->whereDate('send_at', '>=', Carbon::now())
    //         ->where('ready_to_send', 1)
    //         ->whereNull('sent')
    //         ->exists();
    //     if ($messages_to_send) {
    //         return false; // don't release the number
    //     }

    //     return true; // should release the number
    // }





    // Event date has already passed 30 days prior
    // There are no messages scheduled to be delivered in the future
    // private function doReleased(PhoneNumber $phone_number)
    // {
    //     //Event date has already passed 30 days prior
    //     $shindig = Shindig::where('id', $phone_number->shindig_id)
    //         ->where('event_date', '>=', Carbon::now()->subDays(30))
    //         ->get();
    //     if ($shindig) {
    //         return false; //don't release the number
    //     }
    //     // Does the shindig has any future message scheduled?
    //     $messages_to_send = Message::where('shindig_id', $phone_number->shindig->id)
    //         ->whereDate('send_at', '>=', Carbon::now())
    //         ->where('ready_to_send', 1)
    //         ->whereNull('sent')
    //         ->exists();
    //     if ($messages_to_send) {
    //         return false; //don't release the number
    //     }

    //     return true; //should release the number
    // }
}
