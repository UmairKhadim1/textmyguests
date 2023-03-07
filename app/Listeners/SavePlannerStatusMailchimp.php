<?php

namespace App\Listeners;

use App\Events\PlannerMailchimpStatus;
use Exception;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Newsletter;

class SavePlannerStatusMailchimp
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
     * @param  PlannerMailchimpStatus  $event
     * @return void
     */
    public function handle(PlannerMailchimpStatus $event)
    {
        try {
            if ($event->user) {
                if (Newsletter::isSubscribed($event->user->email, 'Textmyguests_Planner')) {
                    Newsletter::SubscribeOrUpdate($event->user->email, ['STATUS' => 'Active'], 'Textmyguests_Planner');
                }
            }
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
        }
    }
}
