<?php

namespace App\Observers;

use Illuminate\Support\Facades\Log;
use App\Shindig;
use App\PhoneNumber;
use App\Group;
use App\Guest;
use App\Invoice;
use Twilio\Rest\Client;
use Newsletter;

class ShindigObserver
{
    public function created(Shindig $shindig)
    {
        // 1) if this is an unpaid/unactivated shindig (all new ones should be) - use the master messaging service
        if (!$shindig->payment_status) {
            $shindig->messagingServiceSid = env('TWILIO_MSGSRV_SID', null);
            $shindig->save();
        } else {
            // if it already has invoices immediately on creation, raise a warning to admins because something is weird
        }

        // 2) create the "all" group for this shindig
        $g = new Group;
        $g->shindig_id = $shindig->id;
        $g->group_name = "All Guests";
        $g->is_all = 1;
        $g->save();

        //now create test group for this shindig
        $tg = new Group;
        $tg->shindig_id = $shindig->id;
        $tg->group_name = "Test Group";
        $tg->is_all = 0;
        $tg->is_testGroup = 1;
        $tg->save();

        // //add event owner to test group
        // $owner = $shindig->owner;
        // $guest = $shindig->guests()->where('guest_phone', $owner->mobilePhone)->first();
        // $group = $shindig->getTestGroup();
        // $group->guests()->sync($guest->id);

        //give 15 credits to user when he creates an event
        $invoice = new Invoice();
        $invoice->user_id = auth()->user()->id;
        $invoice->shindig_id = $shindig->id;
        $invoice->total_credits = 15;
        $invoice->save();
    }

    public function updating(Shindig $shindig)
    {
        // If the event date is being modified,
        // disable all messages that don't respect the 30 days
        // delay after the new date.
        if ($shindig->getOriginal('event_date') !== $shindig->event_date) {
            $messages = $shindig->messages()->where('ready_to_send', true)->get();

            foreach ($messages as $message) {
                $event_date = $shindig->event_date;
                if ($message->send_at->diffInDays($event_date, false) < -30) {
                    $message->ready_to_send = 0;
                    $message->save();
                }
            }
        }
    }

    public function deleted(Shindig $shindig)
    {
        // what do we need to do upon deletion?

        // 1) Mark all of the shindig's messages as ready_to_send = 0
        $shindig->messages()->where('shindig_id', $shindig->id)->update(['ready_to_send' => 0]);

        // 2) Delete all groups in the shindig
        $shindig->groups()->delete();

        // 3) Delete all guests of the shindig
        $shindig->guests()->delete();

        // 4) Delete all messages in the shindig
        $shindig->messages()->delete();

        // 5) Delete all media for this shindig (including s3 files)
        $shindig->media()->delete();

        // 6) Delete ShindigOwnerships
        $shindig->owners()->sync([]);

        // 7 & 8) If it's already activated, delete the phone numbers for this shindig
        if ($shindig->is_activated) {
            // $sid = env('TWILIO_LIVE_SID', null);
            // $token = env('TWILIO_LIVE_TOKEN', null);
            // if ($sid == null || $token == null) {
            //     return false; // env not properly configured
            // }

            // $twilio = new Client($sid, $token);
            // $twilio->messaging->v1->services($shindig->messagingServiceSid)->delete();

            // Delete/release all phone numbers for this shindig
            $numbers = PhoneNumber::where('shindig_id', $shindig->id)->get();
            foreach ($numbers as $number) {
                $number->delete();
            }
        }
    }

    // public function pivotAttached(Shindig $shindig, $relation_name)
    // {
    //     Log::error($relation_name);
    //     if ($relationName == 'owners') {
    //         $shindig->owners->each(function($owner) use($shindig) {
    //             $g = new Guest();
    //             $g->shindig_id = $shindig->id;
    //             $g->guest_firstname = $owner->first_name . ' ' . $owner->last_name;
    //             $g->guest_lastname = '';
    //             $g->guest_phone = $owner->mobilePhone;
    //             $g->guest_email = $owner->email;
    //             $g->save();
    //         });
    //     }
    // }
}
