<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Dress;
use App\Models\Category;
use App\Models\Booking;
use App\Models\User;
use App\Models\Service;

class DashboardController extends Controller
{
    /**
     * Display a comprehensive dashboard of statistics and activity.
     */
    public function index()
    {
        // Basic Stats
        $stats = [
            'total_dresses' => Dress::count(),
            'total_categories' => Category::count(),
            'total_bookings' => Booking::count(),
            'total_users' => User::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'new_users_30d' => User::where('created_at', '>=', now()->subDays(30))->count(),
        ];

        // Top Services (Most Booked)
        $topServices = Booking::whereNotNull('service_id')
            ->select('service_id', DB::raw('count(*) as count'))
            ->groupBy('service_id')
            ->orderBy('count', 'desc')
            ->take(5)
            ->with('service')
            ->get();

        // Top Dresses (Most Booked)
        $topDresses = Booking::whereNotNull('dress_id')
            ->select('dress_id', DB::raw('count(*) as count'))
            ->groupBy('dress_id')
            ->orderBy('count', 'desc')
            ->take(5)
            ->with('dress')
            ->get();

        // Booking Status Distribution
        $statusDistribution = Booking::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        return response()->json([
            'stats' => $stats,
            'top_services' => $topServices,
            'top_dresses' => $topDresses,
            'status_distribution' => $statusDistribution,
            'recent_bookings' => Booking::with(['dress', 'service', 'user'])->latest()->take(10)->get()
        ]);
    }
}
