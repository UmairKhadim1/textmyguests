<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{

    protected $fillable = [
        'shindig_id',
        'email',
        'hash',
        'user_id',
        'isPlanner'
    ];

    public function shindig()
    {
        return $this->belongsTo(Shindig::class, 'shindig_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
