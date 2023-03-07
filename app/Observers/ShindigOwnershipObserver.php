<?php

namespace App\Observers;

use App\Group;
use App\ShindigOwnership;
use App\Guest;
use App\Shindig;

class ShindigOwnershipObserver
{
    public function created(ShindigOwnership $ownership)
    {
        $owner = $ownership->owner;
        $g = new Guest();
        $g->shindig_id = $ownership->shindig_id;
        $g->guest_firstname = $owner->first_name;
        $g->guest_lastname = $owner->last_name;
        $g->guest_phone = $owner->mobilePhone;
        $g->guest_email = $owner->email;
        $g->save();

        //add shindig owner to test group
        $shindig = Shindig::find($g->shindig_id);
        $g->groups()->attach($shindig->getTestGroup());
    }
}
