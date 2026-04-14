<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Booking Routes
    Route::get('/bookings', [\App\Http\Controllers\Api\BookingController::class, 'index']);
    Route::post('/bookings', [\App\Http\Controllers\Api\BookingController::class, 'store']);
    Route::get('/bookings/{id}', [\App\Http\Controllers\Api\BookingController::class, 'show']);
});

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DressController;
use App\Http\Controllers\Api\ServiceController;

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/dresses', [DressController::class, 'index']);
Route::get('/dresses/{id}', [DressController::class, 'show']);
Route::get('/dresses/{id}/booked-dates', [DressController::class, 'getBookedDates']);

// Service Routes
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

// Admin Routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);
    Route::apiResource('/dresses', \App\Http\Controllers\Api\Admin\DressController::class);
    Route::apiResource('/categories', \App\Http\Controllers\Api\Admin\CategoryController::class);
    Route::apiResource('/bookings', \App\Http\Controllers\Api\Admin\BookingController::class);
    
    // User Management
    Route::get('/users', [\App\Http\Controllers\Api\Admin\UserController::class, 'index']);
    Route::put('/users/{id}/status', [\App\Http\Controllers\Api\Admin\UserController::class, 'updateStatus']);
    Route::delete('/users/{id}', [\App\Http\Controllers\Api\Admin\UserController::class, 'destroy']);
});

// Vendor Routes
Route::middleware(['auth:sanctum', 'vendor'])->prefix('vendor')->group(function () {
    Route::get('/dashboard', function() {
        return response()->json(['message' => 'Vendor Dashboard Data Placeholder']);
    });

    // Service Management for Vendors
    Route::get('/services', [\App\Http\Controllers\Api\Vendor\ServiceController::class, 'index']);
    Route::post('/services', [\App\Http\Controllers\Api\Vendor\ServiceController::class, 'store']);
    Route::put('/services/{id}', [\App\Http\Controllers\Api\Vendor\ServiceController::class, 'update']);
    Route::delete('/services/{id}', [\App\Http\Controllers\Api\Vendor\ServiceController::class, 'destroy']);

    // Booking Management for Vendors
    Route::get('/bookings', [\App\Http\Controllers\Api\Vendor\BookingController::class, 'index']);
    Route::put('/bookings/{id}/status', [\App\Http\Controllers\Api\Vendor\BookingController::class, 'updateStatus']);
});
