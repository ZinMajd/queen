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
            'type' => 'nullable|in:rent,sale',
            'booking_date' => $request->type === 'sale' ? 'nullable|date' : 'required|date|after_or_equal:today',
            'delivery_method' => 'required|string',
            'delivery_address' => 'nullable|string',
            'payment_method' => 'required|string',
        ]);
 
        $type = $request->input('type', 'rent');

        // Double Booking Prevention Check (Only for Rentals)
        if ($request->dress_id && $type === 'rent') {
            $isBooked = Booking::where('dress_id', $request->dress_id)
                ->where('booking_date', $request->booking_date)
                ->where('status', '!=', 'cancelled')
                ->exists();
            
            if ($isBooked) {
                return response()->json([
                    'message' => 'عذراً، هذا الفستان محجوز بالفعل في التاريخ المختار. يرجى اختيار تاريخ آخر أو فستان آخر.'
                ], 422);
            }
        }
 
        $booking = Booking::create([
            'user_id' => Auth::id(),
            'dress_id' => $request->dress_id,
            'service_id' => $request->service_id,
            'type' => $type,
            'booking_date' => $request->booking_date,
            'delivery_method' => $request->delivery_method,
            'delivery_address' => $request->delivery_address,
            'payment_method' => $request->payment_method,
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
