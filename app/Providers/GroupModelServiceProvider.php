<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class GroupModelServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        \App\Group::observe(\App\Observers\GroupObserver::class);
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
