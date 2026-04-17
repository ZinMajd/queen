<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = ['user_id', 'favoritable_id', 'favoritable_type'];

    /**
     * Get the parent favoritable model (Dress or Service).
     */
    public function favoritable()
    {
        return $this->morphTo();
    }

    /**
     * Relationship with the user who favorited.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
