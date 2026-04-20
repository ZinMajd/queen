<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Queen Wedding API is running',
        'version' => '1.0.0',
        'status' => 'healthy'
    ]);
});

Route::get('/api-test-web', function () {
    return response()->json(['message' => 'API route in web.php works!']);
});

Route::get('/api/test', function() { 
    return response()->json(['status' => 'OK', 'source' => 'web.php']); 
});

// Emergency routes directly in web.php
Route::get('/api/dresses', [\App\Http\Controllers\Api\DressController::class, 'index']);
Route::get('/api/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);

// Seeding route in web.php
Route::get('/api/seed-basic', function() {
    try {
        $cat = \App\Models\Category::firstOrCreate(['name' => 'فساتين زفاف', 'slug' => 'wedding-dresses']);
        
        \App\Models\Dress::create([
            'name' => 'فستان الملكة الفاخر',
            'description' => 'فستان زفاف مطرز بالكريستال مع طرحة طويلة',
            'price' => 1200,
            'category_id' => $cat->id,
            'image' => 'https://images.unsplash.com/photo-1594553503452-031f1c0a9808',
            'status' => 'available'
        ]);

        \App\Models\Dress::create([
            'name' => 'فستان كلاسيكي ناعم',
            'description' => 'تصميم بسيط وأنيق للعروس العصرية',
            'price' => 850,
            'category_id' => $cat->id,
            'image' => 'https://images.unsplash.com/photo-1546193430-c2d207739ed7',
            'status' => 'available'
        ]);

        return "Sample dresses added successfully! Refresh your website now.";
    } catch (\Exception $e) {
        return "Error: " . $e->getMessage();
    }
});
