<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'image'];

    public function dresses()
    {
        return $this->hasMany(Dress::class);
    }
}
