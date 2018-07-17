<?php

namespace Tests\Feature\Unit;

use App\Announcement;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class AnnouncementTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function it_creates_an_announcement_by_a_user()
    {
        $user = factory(User::class)->create();

        $announcement = Announcement::createByUser($user, [
            'title'     => 'Waluigi to visit United States in a tour!',
            'content'   => 'It\'s amazing because Waluigi was thought to have been busy helping make the super smash bros'
        ]);

        $this->assertDatabaseHas('announcements', $announcement->getAttributes());
    }

    /** @test */
    public function it_updates_an_announcement_by_user()
    {
        $originalUser = factory(User::class)->create();
        $modifyingUser = factory(User::class)->create();

        $announcement = factory(Announcement::class)->create();

        $announcement->modifiedBy()->associate($originalUser)->save();

        $announcement->updateByUser($modifyingUser)->fill(['title' => 'Yo, I\'mma changin the title!']);

        $this->assertEquals('Yo, I\'mma changin the title!', $announcement->title);
    }
}
