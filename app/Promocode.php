<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;


class Promocode extends Model
{
    public $table = 'promocodes';
    protected $fillable = [
        'code', 'description', 'type', 'price', 'global_limit', 'user_limit', 'start_date', 'end_date', 'user_id'
    ];

    public function getPriceFixedAttribute()
    {
        if ($this->type == 'fixed') {
            return $this->price;
        }
        return;
    }
    public function setPriceFixedAttribute($value)
    {
        $this->attributes['price'] = $value;
    }
    public function getPricePercentageAttribute()
    {
        if ($this->type == 'percentage') {
            return $this->price;
        }
        return;
    }
    public function setPricePercentageAttribute($value)
    {
        $this->attributes['price'] = $value;
    }
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
    public static function boot()
    {
        parent::boot();

        static::creating(function ($promocode) {
            $promocode->user_id = Auth::id();
        });
    }
}
