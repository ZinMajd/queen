<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Dress;
use App\Models\Category;
use App\Models\Booking;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'stats' => [
                'total_dresses' => Dress::count(),
                'total_categories' => Category::count(),
                'total_bookings' => Booking::count(),
                'total_users' => User::count(),
                'pending_bookings' => Booking::where('status', 'pending')->count(),
            ],
            'recent_bookings' => Booking::with(['dress', 'user'])->latest()->take(5)->get()
        ]);
    }
}
