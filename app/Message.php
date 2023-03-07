<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    //added timestamps for message resource on nova
    public $timestamps = false;
    protected $guarded = ['id'];
    protected $dates = ['send_at', 'sent'];

    public function shindig()
    {
        return $this->belongsTo('App\Shindig');
    }

    public function recipients()
    {
        return $this->belongsToMany('App\Group', 'message_recipients');
    }
 
    public function activities()
    {
        return $this->hasMany("App\Activity");
    }

    // ensure we are only providing valid mediaUrls to prevent Twilio fails
    // return a NULL if we don't have a valid http or https URL stored on the object
    public function getMediaUrlAttribute($value)
    {
        $value = filter_var($value, FILTER_SANITIZE_URL);

        if (filter_var($value, FILTER_VALIDATE_URL) && strtolower(substr($value, 0, 4)) === "http")
            return $value;
        else
            return NULL;
    }

    public function setMediaUrlAttribute($value)
    {
        $value = filter_var($value, FILTER_SANITIZE_URL);

        if (filter_var($value, FILTER_VALIDATE_URL) && strtolower(substr($value, 0, 4)) === "http")
            $this->attributes['media_url'] = $value;
        else
            $this->attributes['media_url'] = NULL;
    }
}
