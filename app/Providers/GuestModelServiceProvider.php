<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class GuestModelServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        \App\Guest::observe(\App\Observers\GuestObserver::class);
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
