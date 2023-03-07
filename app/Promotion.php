<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Promotion extends Model
{
    public $table = 'promotions';

    protected $fillable = [
        'code', 'description', 'type', 'price', 'global_limit', 'user_limit', 'start_date', 'end_date', 'user_id'
    ];

    protected $casts = [
        'start_date' => 'date', 'end_date' => 'date'
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function promoDetails()
    {
        return $this->hasMany(PromoDetail::class);
    }

    // Used this to nova resource field when logged in user id is required
    // public static function boot()
    // {
    //     parent::boot();

    //     static::creating(function ($promotion) {
    //         $promotion->user_id = Auth::id();
    //     });
    // }
}
