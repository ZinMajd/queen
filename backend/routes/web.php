<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // EMERGENCY DB INIT
    if (request()->has('init')) {
        try {
            \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            \App\Models\Service::where('service_type', 'تجميل ومكياج')->update(['service_type' => 'كوافير']);
            \App\Models\Vendor::where('category', 'تجميل ومكياج')->update(['category' => 'كوافير']);
            \Illuminate\Support\Facades\Artisan::call('config:clear');
            \Illuminate\Support\Facades\Artisan::call('route:clear');
            return "SUCCESS! Database updated to V3. <a href='/'>Go Home</a>";
        } catch (\Exception $e) {
            return "Error: " . $e->getMessage();
        }
    }

    // Serve the frontend index.html
    if (file_exists(public_path('index.html'))) {
        return file_get_contents(public_path('index.html'));
    }

    return response()->json([
        'message' => '!!! QUEEN SYSTEM V4 - TEST !!!',
        'version' => '4.0.0',
        'status' => 'healthy'
    ]);
});

// SPA Routing: Send all other non-API requests to index.html
Route::get('/{any}', function () {
    if (file_exists(public_path('index.html'))) {
        return file_get_contents(public_path('index.html'));
    }
    return response()->json(['message' => 'Frontend not built yet'], 404);
})->where('any', '^(?!api|init-fix|storage).*$');

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
