<?php

use Illuminate\Database\Seeder;
use App\User;

class EventsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create 1 user with 10 events
        factory(User::class, 1)->create()->each(function (User $user) {
            factory(App\Event::class, 10)->create([
                'user_id'           => $user->id,
                'last_modified_by'  => $user->id,
            ]);
        });
    }
}
