<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
// use App\User;
use App\Notifications\Notifications;
use App\Message;
use App\UserTokens;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use OneSignal;
use App\Mail\ScheduledMessage;
use Illuminate\Support\Facades\Mail;

class CheckForScheduledMessages implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // hard code max 1 tries before failing to avoid stuck jobs (this job is scheduled to run every minute anyway)
    public $tries = 1;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        // this job doesn't need any Models passed to it
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // check the database for any Messages that are due and ready to be sent
        // if you find any - dispatch the SendMessage() job foreach

        $right_now = Carbon::now(); // make sure to use copy() to avoid modifying $right_now

        // first, any messages older than 3 minutes ago should be automatically disabled for safety
        $messages = Message::where([
            ['sent', '=', NULL],
            ['ready_to_send', '=', TRUE], // this is to make sure we don't snipe a message from ProcessInboundSMS
            ['send_at', '<', $right_now->copy()->subMinutes(3)], // look back 3 minutes
        ])->get();

        // disable anything older than 3 minutes ago
        foreach ($messages as $message) {
            $message->ready_to_send = FALSE;
            $message->save();
        }

        // now look for any messages ready to send, and dispatch a job to send them
        $messages = Message::where([
            ['sent', '=', NULL],
            ['ready_to_send', '=', TRUE], // this is to make sure we don't snipe a message from ProcessInboundSMS
            ['send_at', '>', $right_now->copy()->subMinutes(2)], // look back 2 minutes to be safe (this should run every minute)
            ['send_at', '<', $right_now->copy()->addSeconds(15)] // peek forward 15 seconds
        ])->get();

        foreach ($messages as $message) {
            SendMessage::dispatch($message)->onQueue('outbound');

            //Pushing web notification on message sending
            // $user = auth()->user();
            // $user = User::find(auth()->user()->id);
            $users = $message->shindig->owners()->get();
            $msg = strlen($message->contents) > 50 ? substr($message->contents, 0, 50) . '...' : $message->contents;
            foreach ($users as $user) {
                try {
                    $users_token = UserTokens::select('user_token')->where('user_id', $user->id)->value('user_token');
                    if ($users_token) {
                        $data = [
                            'url' => env('APP_URL') . '/app/dashboard/messages'
                        ];
                        OneSignal::sendNotificationToUser(
                            'Your message "' . $msg . '" has been sent successfully!',
                            $users_token,
                            $url = null,
                            $data,
                            $buttons = null,
                            $schedule = null
                        );
                    }
                    $notification_data = [
                        'message' => 'Your message "' . $msg . '" has been sent successfully!',
                        'data' => $message->fresh(),
                        'notify_type' => "message_sent"
                    ];
                    $user->notify(new Notifications($notification_data));

                    //mail to user
                    Mail::to($user->email)->send(new ScheduledMessage($message, $user));
                } catch (Exception $ex) {
                    Log::error($ex->getMessage());
                }
            }
        }
    }
}
