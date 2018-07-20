<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use BelongsToUser;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'events';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'game',
        'content',
        'start',
        'end'
    ];

    /**
     * Date fields in the database that need to be formatted as such.
     *
     * @var array
     */
    protected $dates = [
        'start', 'end'
    ];
}
