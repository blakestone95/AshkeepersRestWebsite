<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use BelongsToUser;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'content'
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'announcements';
}
