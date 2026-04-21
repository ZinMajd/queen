<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'dress_id',
        'service_id',
        'booking_date',
        'delivery_method',
        'delivery_address',
        'payment_method',
        'total_amount',
        'status',
        'customer_name',
        'customer_phone'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function dress()
    {
        return $this->belongsTo(Dress::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
