<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class GroupMembership extends Pivot
{
    //
    protected $table = 'group_membership';
    public $incrementing = false;
    public $timestamps = false;
    protected $guarded = [];

}
