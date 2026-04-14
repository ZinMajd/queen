<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $data = $request->only(['name']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/categories', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $category = Category::create($data);
        return response()->json($category, 201);
    }

    public function show($id)
    {
        return response()->json(Category::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $data = $request->only(['name']);

        if ($request->hasFile('image')) {
            if ($category->image && str_contains($category->image, '/storage/uploads/categories/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $category->image));
            }
            $path = $request->file('image')->store('uploads/categories', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $category->update($data);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        if ($category->image && str_contains($category->image, '/storage/uploads/categories/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $category->image));
        }
        $category->delete();
        return response()->json(['message' => 'تم حذف القسم بنجاح']);
    }
}
