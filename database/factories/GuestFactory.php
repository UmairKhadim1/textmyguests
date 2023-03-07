<?php

use Faker\Generator as Faker;

$factory->define(\App\Guest::class, function (Faker $faker) {
    return [
        'guest_firstname' => $faker->firstName,
        'guest_lastname' => $faker->lastName,
        // $faker->phoneNumber generates number formats that don't pass validation and end up being null
        'guest_phone' => $faker->numerify('+17045######'), 
        'guest_email' => $faker->email,
    ];
});
