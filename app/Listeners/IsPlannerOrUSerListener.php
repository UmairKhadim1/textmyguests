<?php

namespace App\Listeners;

use App\Events\IsPlannerOrUserEvent;
use App\Events\UserSavedEvent;
use Exception;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Newsletter;

class IsPlannerOrUSerListener
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
     * @param  IsPlannerOrUserEvent  $event
     * @return void
     */
    public function handle(IsPlannerOrUserEvent $event)
    {
        try {
            //check if user is in planner list
            $planner = Newsletter::isSubscribed($event->user->email, 'Textmyguests_Planner');
            if ($planner || $event->user->isProfessional) { //if user is in planner list then update his record
                Newsletter::subscribeOrUpdate($event->user->email, ['FNAME' => $event->user->first_name, 'LNAME' => $event->user->last_name, 'PHONE' => $event->user->mobilePhone], 'Textmyguests_Planner');
            } else { //if not then save user to textmyguests main list
                event(new UserSavedEvent($event->user));
            }
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
        }
    }
}
