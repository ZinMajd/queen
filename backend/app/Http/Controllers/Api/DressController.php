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

        $query->withCount(['favorites', 'bookings' => function($q) {
            $q->whereIn('status', ['confirmed', 'completed']);
        }]);

        if ($request->has('all')) {
            return response()->json([
                'data' => $query->with('category')->get()
            ]);
        }

        return response()->json($query->with('category')->paginate(12));
    }

    public function show($id)
    {
        $dress = Dress::with('category')->withCount(['favorites', 'bookings' => function($q) {
            $q->whereIn('status', ['confirmed', 'completed']);
        }])->findOrFail($id);
        return response()->json($dress);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'category_id' => 'required',
            'type' => 'nullable|string',
            'size' => 'nullable|string',
            'image' => 'nullable|image|max:10240', // 10MB limit
            'is_for_sale' => 'boolean',
            'is_for_rent' => 'boolean',
            'sale_price' => 'nullable|string',
            'rent_price' => 'nullable|string',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/dresses'), $imageName);
            $imagePath = '/uploads/dresses/' . $imageName;
        }

        $dress = Dress::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'type' => $request->type,
            'size' => $request->size,
            'image' => $imagePath,
            'status' => 'available',
            'is_for_sale' => $request->is_for_sale ?? false,
            'is_for_rent' => $request->is_for_rent ?? true,
            'sale_price' => $request->sale_price,
            'rent_price' => $request->rent_price,
        ]);

        return response()->json([
            'message' => 'تم إضافة الفستان بنجاح',
            'dress' => $dress
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $dress = Dress::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
            'category_id' => 'sometimes|required|exists:categories,id',
            'type' => 'sometimes|required|string',
            'size' => 'sometimes|required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'sometimes|required|string',
        ]);

        if ($request->hasFile('image')) {
            if ($dress->image && file_exists(public_path($dress->image))) {
                @unlink(public_path($dress->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/dresses'), $imageName);
            $dress->image = '/uploads/dresses/' . $imageName;
        }

        $dress->update($request->except('image'));

        return response()->json([
            'message' => 'تم تحديث الفستان بنجاح',
            'dress' => $dress
        ]);
    }

    public function destroy($id)
    {
        $dress = Dress::findOrFail($id);

        if ($dress->image && file_exists(public_path($dress->image))) {
            @unlink(public_path($dress->image));
        }

        $dress->delete();

        return response()->json(['message' => 'تم حذف الفستان بنجاح']);
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
