<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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


    public function scopeGetCreatedInLastMonth(Builder $builder)
    {
        return $builder->whereBetween('created_at', [Carbon::now()->subMonth(), Carbon::now()]);
    }

    public function scopeDatesBetween(Builder $builder, Carbon $start, Carbon $end)
    {
        return $builder->whereBetween('created_at', [$start->startOfDay(), $end->endOfDay()]);
    }
}
