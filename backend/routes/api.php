<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NotificationController;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\Admin\SettingController;

Route::post('api/register', [AuthController::class, 'register']);
Route::any('auth/login', [AuthController::class, 'login']);

Route::get('api/settings', [SettingController::class, 'getPublicSettings']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('api/user', [AuthController::class, 'user']);
    Route::post('api/logout', [AuthController::class, 'logout']);
    
    // Booking Routes
    Route::get('api/bookings', [\App\Http\Controllers\Api\BookingController::class, 'index']);
    Route::post('api/bookings', [\App\Http\Controllers\Api\BookingController::class, 'store']);
    Route::get('api/bookings/{id}', [\App\Http\Controllers\Api\BookingController::class, 'show']);
    
    // Notification Routes
    Route::get('api/notifications', [NotificationController::class, 'index']);
    Route::put('api/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('api/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('api/notifications', [NotificationController::class, 'destroyAll']);

    // Favorite Routes
    Route::get('api/favorites', [FavoriteController::class, 'index']);
    Route::post('api/favorites/toggle', [FavoriteController::class, 'toggle']);

    // Admin Settings Route
    Route::middleware('can:manage-system')->group(function() {
         Route::get('api/admin/settings', [SettingController::class, 'index']);
         Route::post('api/admin/settings', [SettingController::class, 'update']);
    });

    // Rating Route
    Route::post('api/ratings', [RatingController::class, 'store']);

    // Profile Routes
    Route::post('api/profile/update', [\App\Http\Controllers\Api\ProfileController::class, 'update']);
});

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DressController;
use App\Http\Controllers\Api\ServiceController;

Route::get('api/categories', [CategoryController::class, 'index']);
Route::get('api/categories/{id}', [CategoryController::class, 'show']);
Route::get('api/dresses', [DressController::class, 'index']);
Route::get('api/dresses/{id}', [DressController::class, 'show']);
Route::get('api/dresses/{id}/booked-dates', [DressController::class, 'getBookedDates']);

// Service Routes
Route::get('api/services', [ServiceController::class, 'index']);
Route::get('api/services/{id}', [ServiceController::class, 'show']);

// Vendor Routes
Route::get('api/vendors', [App\Http\Controllers\Api\VendorController::class, 'index']);
Route::get('api/vendors/{id}', [App\Http\Controllers\Api\VendorController::class, 'show']);

// Admin Routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('api/admin')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);
    Route::apiResource('/dresses', \App\Http\Controllers\Api\Admin\DressController::class);
    Route::apiResource('/categories', \App\Http\Controllers\Api\Admin\CategoryController::class);
    Route::apiResource('/bookings', \App\Http\Controllers\Api\Admin\BookingController::class);
    
    // User Management
    Route::get('/users', [\App\Http\Controllers\Api\Admin\UserController::class, 'index']);
    Route::get('/vendors', [\App\Http\Controllers\Api\Admin\UserController::class, 'getVendors']);
    Route::put('/users/{id}/status', [\App\Http\Controllers\Api\Admin\UserController::class, 'updateStatus']);
    Route::delete('/users/{id}', [\App\Http\Controllers\Api\Admin\UserController::class, 'destroy']);
});

// Vendor Routes
Route::middleware(['auth:sanctum', 'vendor'])->prefix('api/vendor')->group(function () {
    Route::get('/dashboard', function() {
        return response()->json(['message' => 'Vendor Dashboard Data Placeholder']);
    });

    // Service Management for Vendors
    Route::get('api/services', [\App\Http\Controllers\Api\Vendor\ServiceController::class, 'index']);
    Route::post('api/services', [\App\Http\Controllers\Api\Vendor\ServiceController::class, 'store']);
    Route::put('api/services/{id}', [\App\Http\Controllers\Api\Vendor\ServiceController::class, 'update']);
    Route::delete('api/services/{id}', [\App\Http\Controllers\Api\Vendor\ServiceController::class, 'destroy']);

    // Booking Management for Vendors
    Route::get('api/bookings', [\App\Http\Controllers\Api\Vendor\BookingController::class, 'index']);
    Route::put('api/bookings/{id}/status', [\App\Http\Controllers\Api\Vendor\BookingController::class, 'updateStatus']);
});

// Temporary route to initialize DB on Vercel
Route::get('api/init-db', function() {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        return "Database migrated successfully! Use /api/seed-basic to add data.";
    } catch (\Exception $e) {
        return "Error: " . $e->getMessage();
    }
});

// Basic seeding without Faker
Route::get('api/seed-basic', function() {
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
