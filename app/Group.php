<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    //
    public $timestamps = false;
    protected $guarded = [];

    public function shindig()
    {
        return $this->belongsTo(Shindig::class);
    }

    public function guests()
    {
        return $this->belongsToMany(Guest::class, 'group_membership');
    }

    public function messages()
    {
        return $this->belongsToMany(Message::class, 'message_recipients');
    }
}
