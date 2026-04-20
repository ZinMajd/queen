<?php

// Emergency Seeding Trigger
if (isset($_GET['seed'])) {
    require __DIR__.'/../vendor/autoload.php';
    $app = require_once __DIR__.'/../bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    
    try {
        $cat = \App\Models\Category::firstOrCreate(['name' => 'فساتين زفاف', 'slug' => 'wedding-dresses']);
        \App\Models\Dress::firstOrCreate(['name' => 'فستان الملكة الفاخر'], [
            'description' => 'فستان زفاف مطرز بالكريستال مع طرحة طويلة',
            'price' => 1200,
            'category_id' => $cat->id,
            'image' => 'https://images.unsplash.com/photo-1594553503452-031f1c0a9808',
            'status' => 'available'
        ]);
        die("Success: Database seeded directly from index.php! Refresh your site now.");
    } catch (\Exception $e) {
        die("Direct Seed Error: " . $e->getMessage());
    }
}

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
