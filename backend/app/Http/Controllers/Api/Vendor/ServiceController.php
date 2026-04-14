<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    /**
     * Display a listing of the vendor's services.
     */
    public function index()
    {
        $services = Service::where('vendor_id', Auth::id())->latest()->get();
        return response()->json($services);
    }

    /**
     * Store a newly created service.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'service_type' => 'required|string',
            'price' => 'required|numeric',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $imagePath = '/storage/' . $request->file('image_file')->store('services', 'public');
        }

        $service = Service::create([
            'vendor_id' => Auth::id(),
            'name' => $request->name,
            'description' => $request->description,
            'service_type' => $request->service_type,
            'price' => $request->price,
            'image' => $imagePath,
        ]);

        return response()->json([
            'message' => 'تمت إضافة الخدمة بنجاح.',
            'service' => $service
        ], 201);
    }

    /**
     * Update the specified service.
     */
    public function update(Request $request, $id)
    {
        $service = Service::where('vendor_id', Auth::id())->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'service_type' => 'required|string',
            'price' => 'required|numeric',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['name', 'description', 'service_type', 'price']);

        if ($request->hasFile('image_file')) {
            // Delete old image if exists
            if ($service->image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $service->image));
            }
            $data['image'] = '/storage/' . $request->file('image_file')->store('services', 'public');
        }

        $service->update($data);

        return response()->json([
            'message' => 'تم تحديث الخدمة بنجاح.',
            'service' => $service
        ]);
    }

    /**
     * Remove the specified service.
     */
    public function destroy($id)
    {
        $service = Service::where('vendor_id', Auth::id())->findOrFail($id);
        
        if ($service->image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $service->image));
        }

        $service->delete();
        return response()->json(['message' => 'تم حذف الخدمة بنجاح.']);
    }
}
