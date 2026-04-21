<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Notifications\VendorStatusChanged;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index()
    {
        $users = User::latest()->paginate(20);
        return response()->json($users);
    }

    /**
     * Get only vendors for approval management.
     */
    public function getVendors(Request $request)
    {
        $query = User::where('role', 'مزود خدمة');
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->with('vendor')->latest()->get());
    }

    /**
     * Update user status (Approve/Reject Vendors).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,pending,blocked,rejected',
        ]);

        $user = User::findOrFail($id);
        $user->status = $request->status;
        $user->save();

        // Sync with Vendor record if it exists
        if ($user->role === 'مزود خدمة' && $user->vendor) {
            $vendorStatus = $request->status;
            // Map user status to vendor status if different (e.g., active -> approved)
            if ($request->status === 'active') $vendorStatus = 'approved';
            
            $user->vendor->update(['status' => $vendorStatus]);
            
            // Trigger Notification to the Vendor
            try {
                $user->notify(new VendorStatusChanged($request->status));
            } catch (\Exception $e) {
                // Ignore notification failures
            }
        }

        return response()->json([
            'message' => 'تم تحديث حالة المستخدم بنجاح.',
            'user' => $user->load('vendor')
        ]);
    }

    /**
     * Delete a user.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role === 'إدارة') {
            return response()->json(['message' => 'لا يمكن حذف حساب المسؤول.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'تم حذف المستخدم بنجاح.']);
    }
}
