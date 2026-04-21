<?php
// EMERGENCY DB INIT - Failsafe before Laravel
$uri = $_SERVER['REQUEST_URI'] ?? '';
if (isset($_GET['init']) || str_contains($uri, 'init-db')) {
    require __DIR__ . '/../backend/vendor/autoload.php';
    $app = require_once __DIR__ . '/../backend/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(Illuminate\Http\Request::capture());
    
    echo "<h3>Queen Emergency Init (Failsafe)</h3>";
    try {
        echo "Running migrations... ";
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        echo "Done!<br>";
        
        echo "Updating categories... ";
        \App\Models\Service::where('service_type', 'تجميل ومكياج')->update(['service_type' => 'كوافير']);
        \App\Models\Vendor::where('category', 'تجميل ومكياج')->update(['category' => 'كوافير']);
        echo "Done!<br>";
        
        echo "Clearing cache... ";
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('route:clear');
        echo "Done!<br>";
        
        echo "<strong>SUCCESS! System updated.</strong> <a href='/'>Go to Site</a>";
        exit;
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage();
        exit;
    }
}

require __DIR__ . '/../backend/public/index.php';
