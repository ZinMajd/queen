<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\BookingStatusChanged;

class BookingController extends Controller
{
    /**
     * الحصول على سجل المزود للمستخدم المسجّل
     */
    private function getVendor()
    {
        $vendor = Auth::user()->vendor;
        if (!$vendor) {
            abort(404, 'لم يتم العثور على حساب المزود.');
        }
        return $vendor;
    }

    /**
     * عرض حجوزات خدمات المزود
     */
    public function index()
    {
        $vendor = $this->getVendor();

        $bookings = Booking::with(['user', 'service'])
            ->whereHas('service', function ($query) use ($vendor) {
                $query->where('vendor_id', $vendor->id);
            })
            ->latest()
            ->get();

        // إخفاء رقم الهاتف للحجوزات المعلقة (حماية الخصوصية)
        $bookings->map(function ($booking) {
            if ($booking->status === 'pending' && $booking->user) {
                $phone = $booking->user->phone ?? '';
                $booking->user->phone = substr($phone, 0, 2) . 'XXXXXXX';
            }
            return $booking;
        });

        return response()->json($bookings);
    }

    /**
     * تحديث حالة الحجز (قبول / رفض / إكمال)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:confirmed,cancelled,completed',
        ]);

        $vendor = $this->getVendor();

        $booking = Booking::whereHas('service', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->findOrFail($id);

        $booking->status = $request->status;
        $booking->save();

        // إرسال إشعار للعميل
        if ($booking->user) {
            try {
                $booking->user->notify(new BookingStatusChanged($booking, $request->status));
            } catch (\Exception $e) {
                // لا نوقف العملية إذا فشل الإشعار
            }
        }

        $booking->load(['user', 'service']);

        return response()->json([
            'message' => 'تم تحديث حالة الحجز بنجاح.',
            'booking' => $booking
        ]);
    }

    /**
     * Get vendor dashboard statistics.
     */
    public function getStats()
    {
        $vendor = $this->getVendor();
        
        $totalServices = \App\Models\Service::where('vendor_id', $vendor->id)->count();
        
        $bookingsQuery = Booking::whereHas('service', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        });

        $totalBookings = (clone $bookingsQuery)->count();
        $pendingBookings = (clone $bookingsQuery)->where('status', 'pending')->count();
        $completedBookings = (clone $bookingsQuery)->where('status', 'completed')->count();

        return response()->json([
            'totalServices' => $totalServices,
            'totalBookings' => $totalBookings,
            'pendingBookings' => $pendingBookings,
            'completedBookings' => $completedBookings,
        ]);
    }
}

