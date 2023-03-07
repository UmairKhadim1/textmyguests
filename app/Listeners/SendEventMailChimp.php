<?php

namespace App\Listeners;

use App\Events\EventCreateMailChimp;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendEventMailChimp
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  EventCreateMailChimp  $event
     * @return void
     */
    public function handle(EventCreateMailChimp $event)
    {
        //
    }
}
