<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Rating;
use App\Models\Dress;
use App\Models\Service;

class RatingController extends Controller
{
    /**
     * Store or update a rating.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'type' => 'required|string|in:dress,service',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $ratableType = $request->type === 'dress' ? Dress::class : Service::class;
        $ratableId = $request->id;

        $rating = Rating::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'ratable_id' => $ratableId,
                'ratable_type' => $ratableType,
            ],
            [
                'rating' => $request->rating,
            ]
        );

        return response()->json([
            'message' => 'شكراً لتقييمك!',
            'rating' => $rating
        ]);
    }
}
