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
