<?php

namespace App;

trait BelongsToUser {
    /**
     * Create a model by a user.
     *
     * @param User $user
     * @param array $attributes
     *
     * @return static
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
     * Update a model by a user.
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
