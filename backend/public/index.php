<?php


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

// EMERGENCY DB INIT
if (isset($_GET['init'])) {
    try {
        echo "<h3>Queen DB Initialization</h3>";
        echo "Running migrations... ";
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        echo "Done!<br>";
        
        echo "Normalizing categories... ";
        \App\Models\Service::where('service_type', 'تجميل ومكياج')->update(['service_type' => 'كوافير']);
        \App\Models\Vendor::where('category', 'تجميل ومكياج')->update(['category' => 'كوافير']);
        echo "Done!<br>";
        
        echo "Clearing cache... ";
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('route:clear');
        echo "Done!<br>";
        
        echo "<strong>SUCCESS! Site is fully updated.</strong> <a href='/'>Click here to go to Home</a>";
        exit;
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage();
        exit;
    }
}

$app->handleRequest(Request::capture());
