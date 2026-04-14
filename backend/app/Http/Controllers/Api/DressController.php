<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dress;
use Illuminate\Http\Request;

class DressController extends Controller
{
    public function index(Request $request)
    {
        $query = Dress::query();

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return response()->json($query->with('category')->get());
    }

    public function show($id)
    {
        return response()->json(Dress::with('category')->findOrFail($id));
    }

    /**
     * Get all booked dates for a specific dress.
     */
    public function getBookedDates($id)
    {
        $bookedDates = \App\Models\Booking::where('dress_id', $id)
            ->where('status', '!=', 'cancelled')
            ->pluck('booking_date')
            ->toArray();

        return response()->json($bookedDates);
    }
}
