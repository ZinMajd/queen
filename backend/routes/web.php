<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Silent Seeding on root hit
    try {
        $cat = \App\Models\Category::firstOrCreate(['name' => 'فساتين زفاف', 'slug' => 'wedding-dresses']);
        \App\Models\Dress::firstOrCreate(['name' => 'فستان الملكة الفاخر'], [
            'description' => 'فستان زفاف مطرز بالكريستال مع طرحة طويلة',
            'price' => 1200,
            'category_id' => $cat->id,
            'image' => 'https://images.unsplash.com/photo-1594553503452-031f1c0a9808',
            'status' => 'available'
        ]);
        \App\Models\Dress::firstOrCreate(['name' => 'فستان كلاسيكي ناعم'], [
            'description' => 'تصميم بسيط وأنيق للعروس العصرية',
            'price' => 850,
            'category_id' => $cat->id,
            'image' => 'https://images.unsplash.com/photo-1546193430-c2d207739ed7',
            'status' => 'available'
        ]);
    } catch (\Exception $e) {
        // Silently fail if already exists or DB issue
    }

    return response()->json([
        'message' => 'Queen Wedding API is running - VERSION 3.0.0',
        'version' => '3.0.0',
        'status' => 'healthy'
    ]);
});

Route::get('/api-test-web', function () {
    return response()->json(['message' => 'API route in web.php works!']);
});

// Version 1: With /api prefix
Route::get('/api/test', function() { return response()->json(['status' => 'OK', 'v' => 1]); });
Route::get('/api/dresses', [\App\Http\Controllers\Api\DressController::class, 'index']);
Route::get('/api/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);

// Version 2: Direct (No /api prefix)
Route::get('/test', function() { return response()->json(['status' => 'OK', 'v' => 2]); });
Route::get('/dresses', [\App\Http\Controllers\Api\DressController::class, 'index']);
Route::get('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);

// Seeding logic (Accessible from both)
$seedLogic = function() {
    try {
        $cat = \App\Models\Category::firstOrCreate(['name' => 'فساتين زفاف', 'slug' => 'wedding-dresses']);
        \App\Models\Dress::firstOrCreate(['name' => 'فستان الملكة الفاخر'], [
            'description' => 'فستان زفاف مطرز بالكريستال مع طرحة طويلة',
            'price' => 1200,
            'category_id' => $cat->id,
            'image' => 'https://images.unsplash.com/photo-1594553503452-031f1c0a9808',
            'status' => 'available'
        ]);
        return "Sample dresses added successfully!";
    } catch (\Exception $e) {
        return "Error: " . $e->getMessage();
    }
};

Route::get('/api/seed-basic', $seedLogic);
Route::get('/seed-basic', $seedLogic);
