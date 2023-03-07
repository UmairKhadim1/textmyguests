<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InboundSMS extends Model
{
    //
    protected $table = 'inbound_sms';
    public $timestamps = false;
    protected $guarded = ['id'];
    protected $dates = ['received_at', 'processed_at'];

    public function shindig()
    {
        // return $this->belongsTo(Shindig::class, 'messagingServiceSid', 'messagingServiceSid');
        return $this->belongsTo(Shindig::class, 'shindig_id');
    }

    public function media()
    {
        return $this->hasMany(Media::class, 'parent_sid', 'messageSid');
    }
}
