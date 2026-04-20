<?php

// Entry point for Vercel
// Handle CORS preflight for Vercel
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    exit;
}

header('Access-Control-Allow-Origin: *');

require __DIR__ . '/../public/index.php';
