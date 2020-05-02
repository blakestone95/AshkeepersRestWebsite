<?php

use Illuminate\Database\Seeder;
use App\User;

class AnnouncementsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create 10 users, each with 1 announcement
        // Effectively same as factory(User::class, 10)->create();
        // But doing it this way as a future example for somebody.
        factory(User::class, 10)->create()->each(function (User $user) {
            factory(App\Announcement::class, 1)->create([
                'user_id'           => $user->id,
                'last_modified_by'  => $user->id,
            ]);
        });
    }
}
