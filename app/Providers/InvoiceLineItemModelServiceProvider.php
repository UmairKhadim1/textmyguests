<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class InvoiceLineItemModelServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        \App\InvoiceLineItem::observe(\App\Observers\InvoiceLineItemObserver::class);
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
