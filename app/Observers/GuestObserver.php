<?php

namespace App\Observers;

use App\Guest;
use App\Shindig;
use App\GroupMembership;

class GuestObserver
{
    public function creating(Guest $guest)
    {
        // make sure creating this doesn't take your event over its Guest cap
        $shindig = $guest->shindig;

        $guest_count = $shindig->guests()->count();

        if (!$shindig->is_activated) {
            /*
            // We'll do nothing since we are letting people add all their guests and then activate
            // this is where you could set a hard guest limit on unpaid events

            if ($guest_count >= 3)
                return false;
            */
            return true;
        }
        // For activated events, if the guest limit is exceeded, we disable all messages
        else {
            if ($guest_count >= $shindig->paidGuestLimit()) {
                $shindig->messages()
                    ->whereNull('sent')
                    ->update(['ready_to_send' => false]);
            }
        }
    }

    public function created(Guest $guest)
    {
        // add the guest to the 'all' group of the shindig
        \App\GroupMembership::create(['guest_id' => $guest->id, 'group_id' => $guest->shindig->getAllGuestGroup()->id]);
    }

    public function saving(Guest $guest)
    {
        // clean $this->guest_phone before saving - no invalid phone numbers in my database
        $guest->guest_phone = \App\validatePhone($guest->guest_phone);
    }

    public function deleted(Guest $guest)
    {
        // remove all the guest's group memberships upon deletion
        \App\GroupMembership::where('guest_id', $guest->id)->delete();
    }
}
