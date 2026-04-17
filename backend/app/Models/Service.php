<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['vendor_id', 'name', 'description', 'service_type', 'price', 'image'];

    public function favorites()
    {
        return $this->morphMany(Favorite::class, 'favoritable');
    }

    public function ratings()
    {
        return $this->morphMany(Rating::class, 'ratable');
    }

    public function getAverageRatingAttribute()
    {
        return $this->ratings()->avg('rating') ?: 0;
    }
}
