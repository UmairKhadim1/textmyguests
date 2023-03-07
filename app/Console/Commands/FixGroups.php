<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use \App\Shindig;
use \App\Guest;
use \App\Group;
use \App\GroupMembership;

class FixGroups extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:fixgroups {shindig? : Confine job to a single shindig id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add all of a Shindig\'s Guests to the All Guests group';

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
        // pull all of a Shindig's Guests, and add them to the All Guests group for that Shindig
        if ($this->argument('shindig'))
        {
            $s = Shindig::where('id', $this->argument('shindig'))->get();
        }
        else // do ALL shindigs
        {
            $s = Shindig::all();
            echo "Repairing all Shindigs...\n";
        }

        foreach ($s as $shindig)
        {
            echo "Shindig ".$shindig->name." (id=".$shindig->id.") with all guest group id=".$shindig->getAllGuestGroup()->id."\n";

            foreach ($shindig->guests()->get() as $guest)
            {
                if ($guest->groups->contains($shindig->getAllGuestGroup()))
                {
                    // do nothing, they are already in it
                    echo $guest->id." in it\n";
                }
                else
                {
                    // add them
                    echo $guest->id." NOT in it";
                    $guest->addToGroup($shindig->getAllGuestGroup()->id);
                    echo " ... ADDED\n";
                }
            }
        }
    }
}
