<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Queen Wedding API is running',
        'version' => '1.0.0',
        'status' => 'healthy'
    ]);
});

// Emergency routes in web.php to bypass API prefix issues
Route::any('/api/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
Route::get('/api/test', function() {
    return response()->json(['message' => 'Web.php API test is working!']);
});
