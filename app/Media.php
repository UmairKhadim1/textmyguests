<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $guarded = [];
    protected $dates = ['date_created'];

    public function shindig()
    {
        return $this->hasOne(Shindig::class, 'shindig_id');
    }

    public function inboundSMS()
    {
        return $this->belongsTo('App\InboundSMS', 'parent_sid', 'messageSid');
    }

    public function getS3URL()
    {
        if (isset($this->s3_filename))
            return "https://s3.amazonaws.com/" . env("AWS_BUCKET") . "/" . $this->s3_filename;
        else if (isset($this->twilio_url))
            return $this->twilio_url;
        else
            return false;
    }

    public function getTwilioURL()
    {
        return $this->twilio_url;
    }
}
