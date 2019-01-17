<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Tables to clear before seeding.
     *
     * @var array
     */
    protected $toTruncate = ['users', 'announcements', 'events'];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        foreach($this->toTruncate as $table)
            DB::table($table)->truncate();

         $this->call([
             UsersTableSeeder::class,
             AnnouncementsTableSeeder::class,
             EventsTableSeeder::class
         ]);

         Model::reguard();
    }
}
