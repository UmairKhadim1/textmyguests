<?php

namespace App\Listeners;

use App\Events\PlannerMailchimp;
use Exception;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Newsletter;

class SavePlannerToMailchimp
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
     * @param  PlannerMailchimp  $event
     * @return void
     */
    public function handle(PlannerMailchimp $event)
    {
        try {
            $member = Newsletter::isSubscribed($event->email, 'Textmyguests_Planner');
            if (!$member) {
                Newsletter::subscribe($event->email, ['STATUS' => 'InActive'], 'Textmyguests_Planner');
            }
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
        }
    }
}
