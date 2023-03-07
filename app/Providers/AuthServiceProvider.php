<?php

namespace App\Providers;

use App\Shindig;
use App\Policies\ShindigPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Shindig::class => ShindigPolicy::class,
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Implicitly grant "Super Admin" role all permissions
        // This works in the app by using gate-related functions like auth()->user->can() and @can()
        Gate::before(function ($user, $ability) {
            return $user->hasRole('Super Admin') ? true : null;
        });

        // This gate controls if the user can modify the shindig and the associated resources
        Gate::define('modify-shindig', function ($user, $shindig) {
            return $shindig->owners()->where('user_id', $user->id)->get()->count() > 0;
        });
    }
}
