<?php

namespace App\Console;

use \App\Jobs\CheckForScheduledMessages;
use \App\Jobs\EventExpireNotification;
use \App\Jobs\ReminderNotification;
use \App\Jobs\CountSegments;
use App\Jobs\MailChimpSync;
use \App\Jobs\UpdatePhoneNumbers;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        //check scheduled messages and send notification on message send successfully or not 
        $schedule->call(function () {
            EventExpireNotification::dispatch()->onQueue('default');
        })->dailyAt('23.59');

        //every mintue job look message that are sending after 30mintus send reminder notification
        $schedule->call(function () {
            ReminderNotification::dispatch()->onQueue('high');
        })->everyMinute();

        // every minute, run the job to look for Messages that need to be sent out
        $schedule->call(function () {
            CheckForScheduledMessages::dispatch()->onQueue('high');
        })->everyMinute();

        // every hour, update numSegments from Twilio (17th minute to minimize server load)
        $schedule->call(function () {
            CountSegments::dispatch()->onQueue('default');
        })->hourlyAt(17);

        // every night, look to see which phone numbers are inactive, and warn the users or release them
        $schedule->call(function () {
            UpdatePhoneNumbers::dispatch()->onQueue('default');
        })->dailyAt('23:40');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
