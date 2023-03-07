<?php

use App\Shindig;

use Faker\Generator as Faker;
use Carbon\Carbon;

$factory->define(Shindig::class, function (Faker $faker) {
    return [
        'name' => 'Our Wedding',
        'start_date' => Carbon::now()->addDays(30), // 30 days away
        'end_date' => Carbon::now()->addDays(40), // 40 days away
        'location' => 'Charlotte, NC',
        'timezone' => 'America/New_York',
    ];
});
