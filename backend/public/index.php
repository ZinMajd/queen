<?php

// FINAL EMERGENCY OVERRIDE
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

// Direct Database Seeding
try {
    $cat = \App\Models\Category::firstOrCreate(['name' => 'فساتين زفاف', 'slug' => 'wedding-dresses']);
    \App\Models\Dress::firstOrCreate(['name' => 'فستان الملكة الفاخر'], [
        'description' => 'فستان زفاف مطرز بالكريستال مع طرحة طويلة',
        'price' => 1200,
        'category_id' => $cat->id,
        'image' => 'https://images.unsplash.com/photo-1594553503452-031f1c0a9808',
        'status' => 'available'
    ]);
} catch (\Exception $e) {}

// Hand over to Laravel
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
)->send();
$kernel->terminate($request, $response);
