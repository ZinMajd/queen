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

// Service Routes
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

// Admin Routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);
    Route::apiResource('/dresses', \App\Http\Controllers\Api\Admin\DressController::class);
    Route::apiResource('/categories', \App\Http\Controllers\Api\Admin\CategoryController::class);
    Route::apiResource('/bookings', \App\Http\Controllers\Api\Admin\BookingController::class);
});
