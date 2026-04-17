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

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('description', 'like', $searchTerm)
                  ->orWhere('type', 'like', $searchTerm);
            });
        }

        if ($request->has('type') && !empty($request->type)) {
            $query->where('type', $request->type);
        }

        if ($request->has('size') && !empty($request->size)) {
            $query->where('size', $request->size);
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if ($request->has('min_rating')) {
            $query->whereHas('ratings', function($q) use ($request) {
                $q->selectRaw('avg(rating)')->havingRaw('avg(rating) >= ?', [$request->min_rating]);
            });
        }

        $query->withCount('favorites');

        return response()->json($query->with('category')->paginate(12));
    }

    public function show($id)
    {
        return response()->json(Dress::with('category')->withCount('favorites')->findOrFail($id));
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
