<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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

    public function scopeDatesBetween(Builder $builder, Carbon $start, Carbon $end)
    {
        return $builder->whereBetween('start', [$start->startOfDay(), $end->endOfDay()]);
    }
}
