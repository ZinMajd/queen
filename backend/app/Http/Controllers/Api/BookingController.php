<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Display a listing of the user's bookings.
     */
    public function index()
    {
        $bookings = Booking::with(['dress', 'service'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    /**
     * Store a newly created booking in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'dress_id' => 'nullable|exists:dresses,id',
            'service_id' => 'nullable|exists:services,id',
            'booking_date' => 'required|date|after_or_equal:today',
        ]);

        $booking = Booking::create([
            'user_id' => Auth::id(),
            'dress_id' => $request->dress_id,
            'service_id' => $request->service_id,
            'booking_date' => $request->booking_date,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'تم استلام طلب الحجز بنجاح. سنتواصل معك للتأكيد.',
            'booking' => $booking->load(['dress', 'service'])
        ], 201);
    }

    /**
     * Display the specified booking.
     */
    public function show($id)
    {
        $booking = Booking::with(['dress', 'service'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json($booking);
    }
}
