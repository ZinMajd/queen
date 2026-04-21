<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dress extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'size',
        'type',
        'image',
        'status',
        'is_for_sale',
        'is_for_rent',
        'sale_price',
        'rent_price'
    ];
 
    protected $casts = [
        'is_for_sale' => 'boolean',
        'is_for_rent' => 'boolean',
    ];

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


    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
