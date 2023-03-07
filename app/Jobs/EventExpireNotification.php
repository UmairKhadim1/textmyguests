<?php

namespace App\Jobs;

use App\Mail\EventExpireToday;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\UserTokens;
use Carbon\Carbon;
use App\Shindig;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use OneSignal;
use App\Mail\EventSummary;
use App\Mail\EventExpireAfterThreeDays;
use App\Message;

class EventExpireNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

        $today_date = Carbon::now()->toDateString();
        $after_three_days_event_date = Carbon::now()->addDays(3)->toDateString();

        $today_expiring_events = Shindig::where([
            ['payment_status', '=', TRUE],
            ['event_date', '=', $today_date],
        ])->get();



        foreach ($today_expiring_events as $event) {
            $event_users = $event->owners()->get();

            foreach ($event_users as $user) {
                try {
                    $users_token = UserTokens::select('user_token')->where('user_id', $user->id)->value('user_token');
                    if ($users_token) {
                        $data = [
                            'url' => env('APP_URL') . '/app/dashboard/invoices'
                        ];
                        OneSignal::sendNotificationToUser(
                            'Your event "' . $event->name . '" is going to expire today , to prevent any hazard please reactivate it or create a new one',
                            $users_token,
                            $url = null,
                            $data,
                            $buttons = null,
                            $schedule = null
                        );
                    }
                    //mail to user
                    Mail::to($user->email)->send(new EventExpireToday($event, $user));
                } catch (Exception $ex) {
                    Log::error($ex->getMessage());
                }
            }
        }

        $after_three_days_expiring_events = Shindig::Where([
            ['payment_status', '=', TRUE],
            ['event_date', '=', $after_three_days_event_date],
        ])->get();

        foreach ($after_three_days_expiring_events as $event) {
            $event_users = $event->owners()->get();

            foreach ($event_users as $user) {
                try {
                    $users_token = UserTokens::select('user_token')->where('user_id', $user->id)->value('user_token');
                    if ($users_token) {
                        $data = [
                            'url' => env('APP_URL') . '/app/dashboard/invoices'
                        ];
                        OneSignal::sendNotificationToUser(
                            'Your event "' . $event->name . '" will be expired on ' . $after_three_days_event_date . ' , to prevent any hazard please reactivate it or create new one',
                            $users_token,
                            $url = null,
                            $data,
                            $buttons = null,
                            $schedule = null
                        );
                        Mail::to($user->email)->send(new EventExpireAfterThreeDays($event, $user));
                    }
                } catch (Exception $ex) {
                    Log::error($ex->getMessage());
                }
            }
        }

        //send mail to those users who's event is expired 
        $yesterday_date = Carbon::now()->subDays(1)->toDateString();

        $today_expiring_events = Shindig::where([
            ['payment_status', '=', TRUE],
            ['event_date', '=', $yesterday_date],
        ])->get();
        // dd($today_expiring_events);


        foreach ($today_expiring_events as $event) {
            $event_users = $event->owners()->get();

            foreach ($event_users as $user) {
                try {
                    $users_token = UserTokens::select('user_token')->where('user_id', $user->id)->value('user_token');
                    if ($users_token) {
                        $data = [
                            'url' => env('APP_URL') . '/app/dashboard/invoices'
                        ];
                        OneSignal::sendNotificationToUser(
                            "This event will be expired on " . $after_three_days_event_date . " , to prevent any hazard please reactivate it",
                            $users_token,
                            $url = null,
                            $data,
                            $buttons = null,
                            $schedule = null
                        );
                    }
                    $event_messages = Message::where('shindig_id', $event->id)->get();
                    //dd($event_messages);

                    Mail::to($user->email)->send(new EventSummary($event, $event_messages, $user));
                    // }
                } catch (Exception $ex) {
                    Log::error($ex->getMessage());
                }
            }
        }
    }
}
