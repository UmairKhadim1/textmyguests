<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserTokens extends Model
{
    protected $table='user_tokens';
    protected $fillable=['user_id','user_token'];
   
}
