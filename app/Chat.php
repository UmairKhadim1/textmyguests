<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    protected $guarded = ['id'];

    public function shindig()
    {
        return $this->belongsTo(Shindig::class);
    }
}
