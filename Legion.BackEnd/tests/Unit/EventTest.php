<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use App\User;
use App\Event;
use Carbon\Carbon;

class EventTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function it_creates_an_announcement_by_a_user()
    {
        $user = factory(User::class)->create();

        $announcement = Event::createByUser($user, [
            'title'     => 'Waluigi to visit United States in a tour!',
            'content'   => 'It\'s amazing because Waluigi was thought to have been busy helping make the super smash bros',
            'game'      => 'Super Smash Bros',
            'start'     => Carbon::now(),
            'end'       => Carbon::now()->addHours(3),
        ]);

        $this->assertDatabaseHas('events', $announcement->getAttributes());
    }

    /** @test */
    public function it_updates_an_announcement_by_user()
    {
        $originalUser = factory(User::class)->create();
        $modifyingUser = factory(User::class)->create();

        $announcement = factory(Event::class)->create();

        $announcement->modifiedBy()->associate($originalUser)->save();

        $announcement->updateByUser($modifyingUser)->fill(['title' => 'Yo, I\'mma changin the title!']);

        $this->assertEquals('Yo, I\'mma changin the title!', $announcement->title);
    }
}
