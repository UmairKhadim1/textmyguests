<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use App\InboundSMS;
use App\Activity;

use Twilio\Rest\Client;

class CountSegments implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // hard code max 1 tries before failing to avoid stuck jobs (this job is scheduled frequently anyway)
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
        // use Twilio API to get billed Segments
        // this variable is not populated in real-time by Twilio, so we need a scheduled job
        // only do the most recent 500 records at a time to limit job runtime

        $sid = env('TWILIO_LIVE_SID', null);
        $token = env('TWILIO_LIVE_TOKEN', null);
        $twilio = new Client($sid, $token);

        // update all Activities where we don't have numSegments
        $activities = Activity::whereNull('numSegments')->latest('occurred_at')->limit(500)->get();
        foreach ($activities as $activity)
        {
            $activity->numSegments = $twilio->Messages($activity->messageSid)->fetch()->numSegments;
            $activity->save();
        }

        // update all InboundSMS where we don't have numSegments
        $smses = InboundSMS::whereNull('numSegments')->latest('received_at')->limit(500)->get();
        foreach ($smses as $sms)
        {
            $sms->numSegments = $twilio->Messages($sms->messageSid)->fetch()->numSegments;
            $sms->save();
        }
 
    }
}
