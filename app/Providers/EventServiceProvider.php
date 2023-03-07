<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'App\Events\Event' => [
            'App\Listeners\EventListener',
        ],
        'App\Events\UserSavedEvent' => [
            'App\Listeners\SendUserMailChimp'
        ],
        'App\Events\ChangeActivationStatus' => [
            'App\Listeners\ActivationStatusListener'
        ],

        'App\Events\PlannerMailchimpStatus' => [
            'App\Listeners\SavePlannerStatusMailchimp'
        ],
        'App\Events\PlannerMailchimp' => [
            'App\Listeners\SavePlannerToMailchimp'
        ],
        'App\Events\IsPlannerOrUserEvent' => [
            'App\Listeners\IsPlannerOrUSerListener'
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
