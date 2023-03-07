<?php

namespace App\Observers;

use App\Group;
use App\GroupMembership;
use App\MessageRecipient;

class GroupObserver
{
    public function deleted(Group $group)
    {
        // remove all the groups members upon deletion
        GroupMembership::where('group_id', $group->id)->delete();

        // remove the group from any messages it is a recipient of
        MessageRecipient::where('group_id', $group->id)->delete();
    }
}
