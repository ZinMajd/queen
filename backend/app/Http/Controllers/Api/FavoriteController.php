<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Favorite;
use App\Models\Dress;
use App\Models\Service;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the user's favorites.
     */
    public function index()
    {
        $favorites = Favorite::with('favoritable')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($favorites);
    }

    /**
     * Toggle favorite status for a dress or service.
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'type' => 'required|string|in:dress,service',
        ]);

        $favoritableType = $request->type === 'dress' ? Dress::class : Service::class;
        $favoritableId = $request->id;

        $favorite = Favorite::where('user_id', Auth::id())
            ->where('favoritable_id', $favoritableId)
            ->where('favoritable_type', $favoritableType)
            ->first();

        if ($favorite) {
            $favorite->delete();
            $status = 'removed';
        } else {
            Favorite::create([
                'user_id' => Auth::id(),
                'favoritable_id' => $favoritableId,
                'favoritable_type' => $favoritableType,
            ]);
            $status = 'added';
        }

        // Get updated global count
        $count = Favorite::where('favoritable_id', $favoritableId)
            ->where('favoritable_type', $favoritableType)
            ->count();

        return response()->json([
            'status' => $status,
            'favorite_count' => $count,
            'message' => $status === 'added' ? 'تمت الإضافة للمفضلة' : 'تم الحذف من المفضلة'
        ]);
    }
}
