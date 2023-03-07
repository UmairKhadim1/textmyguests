<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class PhoneNumberModelServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        \App\PhoneNumber::observe(\App\Observers\PhoneNumberObserver::class);
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
