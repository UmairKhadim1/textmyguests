<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ShindigModelServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        \App\Shindig::observe(\App\Observers\ShindigObserver::class);
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
