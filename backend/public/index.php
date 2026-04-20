<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
$app = require_once __DIR__.'/../bootstrap/app.php';

// EMERGENCY SEEDING - Move it AFTER bootstrap
if (isset($_GET['seed'])) {
    try {
        $app->make('db')->connection(); // Ensure DB is ready
        $cat = \App\Models\Category::firstOrCreate(['name' => 'فساتين زفاف', 'slug' => 'wedding-dresses']);
        \App\Models\Dress::firstOrCreate(['name' => 'فستان الملكة الفاخر'], [
            'description' => 'فستان زفاف مطرز بالكريستال مع طرحة طويلة',
            'price' => 1200,
            'category_id' => $cat->id,
            'image' => 'https://images.unsplash.com/photo-1594553503452-031f1c0a9808',
            'status' => 'available'
        ]);
        echo "Success: Database seeded! <a href='/'>Go Home</a>";
        exit;
    } catch (\Exception $e) {
        // Fallback if DB not ready
    }
}

$app->handleRequest(Request::capture());
