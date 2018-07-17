<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
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

    /**
     * Create an Announcement by a specific user.
     *
     * @param User $user
     * @param array $attributes
     *
     * @return Announcement
     */
    public static function createByUser(User $user, array $attributes)
    {
        $model = new static;

        $model->user()->associate($user);
        $model->modifiedBy()->associate($user);
        $model->fill($attributes);
        $model->save();

        return $model;
    }

    /**
     * Update an announcement by a user.
     *
     * @param User $user
     *
     * @return $this
     */
    public function updateByUser(User $user)
    {
        $this->modifiedBy()->associate($user);

        return $this;
    }



    /**
     * belongsTo user
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Define relationship for modified by user
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function modifiedBy()
    {
        return $this->belongsTo(User::class, 'last_modified_by');
    }
}
