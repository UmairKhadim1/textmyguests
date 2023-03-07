<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class LookForMessages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:lookformessages';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Looks for any SMS messages that need to be sent and queues jobs to send them.';

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
        //
    }
}
