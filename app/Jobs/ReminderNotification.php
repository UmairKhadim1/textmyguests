<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\User;
use App\UserTokens;
use \App\Message;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use OneSignal;

class ReminderNotification implements ShouldQueue
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
        $right_now = Carbon::now();
        $messages = Message::where([
            ['sent', '=', NULL],
            ['ready_to_send', '=', TRUE],
            ['send_at', '=', $right_now->addMinutes(30)], // look messages that are sending right after 30 minutes
        ])->get();

        foreach ($messages as $message) {
            $users = $message->shindig->owners()->get();
            foreach ($users as $user) {
                try {
                    $users_token = UserTokens::select('user_token')->where('user_id', $user->id)->value('user_token');
                    if ($users_token) {
                        $data = [
                            'url'=>env('APP_URL').'/app/dashboard/messages'
                        ];
                        OneSignal::sendNotificationToUser(
                            "Your scheduled message will be sent right after 30 minutes",
                            $users_token,
                            $url = null,
                            $data,
                            $buttons = null,
                            $schedule = null
                        );
                    }
                } catch (Exception $ex) {
                    Log::error($ex->getMessage());
                }
            }
        }
    }
}
