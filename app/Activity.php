<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    //
    public $incrementing = false;
    public $timestamps = false;
    protected $guarded = [];
    protected $dates = ['occurred_at'];

    public function message()
    {
    	return $this->belongsTo('App\Message');
    }
}
