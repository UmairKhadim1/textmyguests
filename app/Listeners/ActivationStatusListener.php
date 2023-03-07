<?php

namespace App\Listeners;

use App\Events\ChangeActivationStatus;
use App\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Newsletter;

class ActivationStatusListener
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
     * @param  ChangeActivationStatus  $event
     * @return void
     */
    public function handle(ChangeActivationStatus $event)
    {


        try {
            $users = $event->shindig->owners()->get();
            $event_date = Carbon::parse($event->shindig->send_event_timestamp)->format('Y-m-d');
            // $user = User::find($event->shindig->primary_owner);
            if (count($users) > 0) {
                foreach ($users as $user) {
                    if (Newsletter::isSubscribed($user->email)) {
                        $subscriber = Newsletter::getMember($user->email);
                        if ($subscriber['merge_fields']['EVENTDATE1'] && $subscriber['merge_fields']['EVENTDATE1'] == $event_date) {
                            Newsletter::subscribeorUpdate($user->email, ['EV_ACTIVE1' => 'Active']);
                        } else if ($subscriber['merge_fields']['EVENTDATE2'] && $subscriber['merge_fields']['EVENTDATE2'] == $event_date) {
                            Newsletter::subscribeorUpdate($user->email, ['EV_ACTIVE2' => 'Active']);
                        } else if ($subscriber['merge_fields']['EVENTDATE3'] && $subscriber['merge_fields']['EVENTDATE3'] == $event_date) {
                            Newsletter::subscribeorUpdate($user->email, ['EV_ACTIVE3' => 'Active']);
                        }
                    }
                    else
                    {
                        $subscriber = Newsletter::getMember($user->email,'Textmyguests_Planner');
                        if ($subscriber['merge_fields']['EVENTDATE1'] && $subscriber['merge_fields']['EVENTDATE1'] == $event_date) {
                            Newsletter::subscribeorUpdate($user->email, ['EV_ACTIVE1' => 'Active'],'Textmyguests_Planner');
                        } else if ($subscriber['merge_fields']['EVENTDATE2'] && $subscriber['merge_fields']['EVENTDATE2'] == $event_date) {
                            Newsletter::subscribeorUpdate($user->email, ['EV_ACTIVE2' => 'Active'],'Textmyguests_Planner');
                        } else if ($subscriber['merge_fields']['EVENTDATE3'] && $subscriber['merge_fields']['EVENTDATE3'] == $event_date) {
                            Newsletter::subscribeorUpdate($user->email, ['EV_ACTIVE3' => 'Active'],'Textmyguests_Planner');
                        }
                    }


                }
            }
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
        }
    }
}
