<?php
require __DIR__ . '/../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../bootstrap/app.php';

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Response;

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

// Manually call artisan
try {
    echo "Running migrations...<br>";
    Artisan::call('migrate', ['--force' => true]);
    echo "Migrations done!<br>";
    echo Artisan::output();
    
    echo "<br>Clearing cache...<br>";
    Artisan::call('config:clear');
    Artisan::call('route:clear');
    echo "Cache cleared!<br>";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
