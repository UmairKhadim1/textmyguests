<?php

namespace App\Listeners;

use App\Events\UserSavedEvent;
use Exception;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Newsletter;

class SendUserMailChimp
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
     * @param  UserSavedEvent  $event
     * @return void
     */
    public function handle(UserSavedEvent $event)
    {
        try {
            if (Newsletter::isSubscribed($event->user->email)) {
                Newsletter::subscribeOrUpdate($event->user->email, ['FNAME' => $event->user->first_name, 'LNAME' => $event->user->last_name, 'PHONE' => $event->user->mobilePhone, 'EV_ACTIVE1' => 'Inactive', 'EV_ACTIVE2' => 'Inactive', 'EV_ACTIVE3' => 'Inactive']);
            } else {
                Newsletter::subscribe($event->user->email, ['FNAME' => $event->user->first_name, 'LNAME' => $event->user->last_name, 'PHONE' => $event->user->mobilePhone, 'EV_ACTIVE1' => 'Inactive', 'EV_ACTIVE2' => 'Inactive', 'EV_ACTIVE3' => 'Inactive']);
            }
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
        }
        return true;
    }
    // public function addToFile($email, $response)
    // {
    //     // $columns = array('email', 'response');

    //     $file = fopen(public_path('mailchimp_result'), 'a');
    //     // fputcsv($file, $columns);
    //     $data = array(
    //         $email, $response
    //     );
    //     fputcsv($file, $data);
    //     fclose($file);
    // }
}
