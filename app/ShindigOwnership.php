<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ShindigOwnership extends Pivot
{
    //
    protected $table = 'shindig_ownership';
    public $incrementing = false;
    public $timestamps = false;
    protected $guarded = [];
    protected $dates = ['accepted_at'];

    public function owner()
    {
        return $this->belongsTo('App\User', 'user_id');
    }

    public function shindig()
    {
        return $this->belongsTo('App\Shindig', 'shindig_id');
    }
}
