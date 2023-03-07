<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use \App\InboundSMS;
use \App\Activity;
use \App\Media;
use \App\Jobs\ProcessInboundSMS;

class FixUnprocessedInboundSMS extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:fixinboundsms {InboundSMS? : Confine job to a single InboundSMS id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Looks for any unprocessed InboundSMS, cleans any artifacts of partial processing, and reprocesses';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // this job deletes artifacts of partially processed InboundSMS, then kicks of a new job to reprocess

        if ($this->argument('InboundSMS'))
        {
            $smses = InboundSMS::where('id', $this->argument('InboundSMS'))->get();
        }
        else // process ALL InboundSMS where the ProcessInboundSMS job did not complete
        {
            $smses = InboundSMS::where('processed_at', NULL)->get();
            echo "Repairing all InboundSMS...\n";
        }

        foreach ($smses as $sms)
        {
            echo "InboundSMS ".$sms->messageSid." (id=".$sms->id.") \n";
            echo "Received at: ".$sms->received_at."\n";

            // remove all Activities
            $activities = Activity::where('messageSid', $sms->messageSid)->delete();

            // remove all Media - note we do not delete the duplicate files from S3, that would need to be done manually
            $media = Media::where('parent_sid', $sms->messageSid)->delete();

            // hide the InboundSMS from the reply stream until it is reprocessed
            $sms->hidden = FALSE;
            $sms->save();

            echo "Activities deleted: ".$activities."\n";
            echo "Media deleted: ".$media."\n";

            // note we do not attempt to cleanup inbound "join" requests - but the ProcessInboundSMS job should catch it, since the user would already be a shindig member

            // Now kickoff a job to re-process this InboundSMS
            ProcessInboundSMS::dispatch($sms)->onQueue('default');
        }
    }
}
