<?php

use Faker\Generator as Faker;

$factory->define(App\Event::class, function (Faker $faker) {
    $startDate = $faker->dateTimeBetween('now', '+30 days');
    return [
        'title'             => $faker->sentence,
        'game'              => $faker->word,
        'content'           => $faker->paragraph,
        'start'             => $startDate,
        'end'               => $faker->dateTimeBetween($startDate, $startDate->format('Y-m-d H:i:s').'+5 hours'),
        'last_modified_by'  => factory(App\User::class)->create()->id,
        'user_id'           => factory(App\User::class)->create()->id,
    ];
});
