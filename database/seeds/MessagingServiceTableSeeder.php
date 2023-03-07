<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MessagingServiceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('messaging_services')->insert([
            'messagingServiceSid' => 'MGfb4528ffc6d6bf6351f8c4d4b291a6f3',
            'totalLimit' => 1000
        ]);
    }
}
