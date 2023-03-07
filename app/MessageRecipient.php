<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class MessageRecipient extends Pivot
{
    //
    protected $table = 'message_recipients';
    public $incrementing = false;
    public $timestamps = false;
    protected $guarded = [];

}
