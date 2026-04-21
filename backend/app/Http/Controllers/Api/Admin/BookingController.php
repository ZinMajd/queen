<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Booking;

class BookingController extends Controller
{
    /**
     * Display a listing of all bookings.
     */
    public function index()
    {
        return response()->json(
            Booking::with(['dress', 'service', 'user'])
                ->latest()
                ->get()
        );
    }

    /**
     * Display the specified booking.
     */
    public function show(string $id)
    {
        return response()->json(
            Booking::with(['dress', 'service', 'user'])
                ->findOrFail($id)
        );
    }

    /**
     * Update the status of the specified booking.
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled'
        ]);

        $booking->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'تم تحديث حالة الحجز بنجاح',
            'booking' => $booking->load(['dress', 'service', 'user'])
        ]);
    }

    /**
     * Remove the specified booking.
     */
    public function destroy(string $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

    }

    /**
     * Store manual booking from Admin
     */
    public function storeManual(Request $request)
    {
        $request->validate([
            'dress_id' => 'required|exists:dresses,id',
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'booking_date' => 'required|date',
        ]);

        $booking = Booking::create([
            'dress_id' => $request->dress_id,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'booking_date' => $request->booking_date,
            'status' => 'confirmed'
        ]);

        return response()->json([
            'message' => 'تم تسجيل الحجز اليدوي بنجاح',
            'booking' => $booking->load('dress')
        ], 201);
    }
}
