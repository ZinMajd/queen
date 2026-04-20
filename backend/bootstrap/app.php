<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: '',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'vendor' => \App\Http\Middleware\VendorMiddleware::class,
        ]);

        $middleware->statefulApi();

        $middleware->validateCsrfTokens(except: [
            'api/*',
            'login',
            'register'
        ]);

        // Ensure always return JSON
        $middleware->appendToGroup('api', [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->shouldRenderJsonWhen(function ($request, $e) {
            return true;
        });
    })->create()
    ->useStoragePath(is_dir('/tmp') ? '/tmp' : null);

// Ensure directories exist on Vercel
if (is_dir('/tmp')) {
    foreach (['/tmp/storage/framework/views', '/tmp/storage/framework/cache', '/tmp/storage/framework/sessions', '/tmp/bootstrap/cache'] as $path) {
        if (!is_dir($path)) {
            @mkdir($path, 0755, true);
        }
    }
}
