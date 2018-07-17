<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnnouncementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            // Will be able to store up to 64KiB a field with play TEXT field. Should be good enough.
            // Can go up to 4 GiB if needed with LONGTEXT...
            $table->text('content');
            $table->unsignedInteger('user_id')->index();
            $table->unsignedInteger('last_modified_by')->index();
            $table->timestamps();
            // Enable announcement soft deleting for records.
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('announcements');
    }
}
