<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the user's notifications.
     */
    public function index()
    {
        $user = Auth::user();
        
        $notifications = $user->notifications()
            ->latest()
            ->limit(20)
            ->get();

        $unreadCount = $user->unreadNotifications()->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead($id)
    {
        $notification = Auth::user()
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json([
            'message' => 'تم تمييز الإشعار كمقروء.'
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();

        return response()->json([
            'message' => 'تم تمييز جميع الإشعارات كمقروءة.'
        ]);
    }

    /**
     * Delete all notifications for the user.
     */
    public function destroyAll()
    {
        Auth::user()->notifications()->delete();

        return response()->json([
            'message' => 'تم مسح جميع الإشعارات بنجاح.'
        ]);
    }
}
