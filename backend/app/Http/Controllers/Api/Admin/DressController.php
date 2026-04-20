<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Dress;
use Illuminate\Support\Facades\Storage;

class DressController extends Controller
{
    public function index()
    {
        return response()->json(Dress::with('category')->latest()->get());
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'description' => 'required|string',
                'size' => 'nullable|string',
                'type' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            ]);

            $data = $request->only(['name', 'category_id', 'description', 'size', 'type', 'status']);

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                
                $uploadPath = public_path('uploads/dresses');
                if (!file_exists($uploadPath)) {
                    @mkdir($uploadPath, 0777, true);
                }

                $image->move($uploadPath, $imageName);
                $data['image'] = '/uploads/dresses/' . $imageName;
            }

            $dress = Dress::create($data);
            return response()->json($dress->load('category'), 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'فشل الحفظ: ' . $e->getMessage(),
                'error' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function show($id)
    {
        return response()->json(Dress::with('category')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $dress = Dress::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'description' => 'sometimes|required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $data = $request->only(['name', 'category_id', 'description', 'size', 'type', 'status']);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($dress->image && file_exists(public_path($dress->image))) {
                @unlink(public_path($dress->image));
            }
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/dresses'), $imageName);
            $data['image'] = '/uploads/dresses/' . $imageName;
        }

        $dress->update($data);
        return response()->json($dress->load('category'));
    }

    public function destroy($id)
    {
        $dress = Dress::findOrFail($id);
        if ($dress->image && str_contains($dress->image, '/storage/uploads/dresses/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $dress->image));
        }
        $dress->delete();
        return response()->json(['message' => 'تم حذف الفستان بنجاح']);
    }
}
