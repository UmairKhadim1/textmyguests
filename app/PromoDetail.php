<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PromoDetail extends Model
{
    public $table = 'promo_details';
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function shindig()
    {
        return $this->belongsTo(Shindig::class, 'shindig_id');
    }
    public function promocode()
    {
        return $this->belongsTo(Promocode::class, 'promocode_id');
    }
}
