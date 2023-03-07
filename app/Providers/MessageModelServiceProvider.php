<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class MessageModelServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        \App\Message::observe(\App\Observers\MessageObserver::class);
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
