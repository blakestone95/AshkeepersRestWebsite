<?php

use Faker\Generator as Faker;

$factory->define(App\Announcement::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence,
        'content' => $faker->paragraph,
        'last_modified_by' => factory(App\User::class)->create()->id,
        'user_id' => factory(App\User::class)->create()->id,
    ];
});
