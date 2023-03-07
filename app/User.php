<?php

namespace App;

use App\Events\IsPlannerOrUserEvent;
use App\Events\UserSavedEvent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Rickycezar\Impersonate\Models\Impersonate;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements JWTSubject
{

    use Notifiable, Impersonate, HasRoles;

    protected $guard_name = 'api';

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'mobilePhone', 'userSource', 'password', 'apiKey', 'isVerified'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'apiKey',
    ];

    public function shindigs()
    {
        return $this->belongsToMany(Shindig::class, 'shindig_ownership')->using(ShindigOwnership::class);
    }

    public function invoices()
    {
        return $this->hasMany('App\Invoice');
    }

    public function promocodes()
    {
        return $this->hasMany(Promocode::class);
    }

    public function promoDetails()
    {
        return $this->hasMany(PromoDetail::class);
    }
    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Send the password reset notification.
     * 
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new \App\Notifications\MailResetPasswordNotification($token));
    }

    protected $dispatchesEvents = [
        'saved' => IsPlannerOrUserEvent::class,
    ];
}
