<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\BookingStatusChanged;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings for the vendor's services.
     */
    public function index()
    {
        $bookings = Booking::with(['user', 'service'])
            ->whereHas('service', function ($query) {
                $query->where('vendor_id', Auth::id());
            })
            ->latest()
            ->get();

        // Privacy Logic: Mask phone if not confirmed
        $bookings->map(function ($booking) {
            if ($booking->status === 'pending') {
                $booking->user->phone = substr($booking->user->phone, 0, 2) . 'XXXXXXX';
            }
            return $booking;
        });

        return response()->json($bookings);
    }

    /**
     * Update booking status (Confirm/Cancel).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:confirmed,cancelled,completed',
        ]);

        $booking = Booking::whereHas('service', function ($query) {
            $query->where('vendor_id', Auth::id());
        })->findOrFail($id);

        $booking->status = $request->status;
        $booking->save();

        // Trigger Notification to the Customer
        if ($booking->user) {
            $booking->user->notify(new BookingStatusChanged($booking, $request->status));
        }

        // Refresh to get full user data if confirmed
        $booking->load(['user', 'service']);

        return response()->json([
            'message' => 'تم تحديث حالة الحجز بنجاح.',
            'booking' => $booking
        ]);
    }
}
