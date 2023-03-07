<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class MediaModelServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        \App\Media::observe(\App\Observers\MediaObserver::class);
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
