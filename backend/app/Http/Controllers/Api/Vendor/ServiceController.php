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
     * عرض قائمة خدمات المزود
     */
    public function index()
    {
        $vendor = $this->getVendor();
        $services = Service::where('vendor_id', $vendor->id)->latest()->get();
        return response()->json($services);
    }

    /**
     * إضافة خدمة جديدة
     */
    public function store(Request $request)
    {
        $vendor = $this->getVendor();

        $request->validate([
            'name'         => 'required|string|max:255',
            'description'  => 'required|string',
            'service_type' => 'required|string',
            'price'        => 'nullable|numeric|min:0',
            'image_file'   => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $imagePath = '/storage/' . $file->store('services', 'public');
        }

        $service = Service::create([
            'vendor_id'    => $vendor->id,
            'name'         => $request->name,
            'description'  => $request->description,
            'service_type' => $request->service_type,
            'price'        => $request->price ?? 0,
            'image'        => $imagePath,
        ]);

        return response()->json([
            'message' => 'تمت إضافة الخدمة بنجاح.',
            'service' => $service
        ], 201);
    }

    /**
     * تحديث خدمة
     */
    public function update(Request $request, $id)
    {
        $vendor = $this->getVendor();
        $service = Service::where('vendor_id', $vendor->id)->findOrFail($id);

        $request->validate([
            'name'         => 'required|string|max:255',
            'description'  => 'required|string',
            'service_type' => 'required|string',
            'price'        => 'nullable|numeric|min:0',
            'image_file'   => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $data = $request->only(['name', 'description', 'service_type']);
        $data['price'] = $request->price ?? $service->price;

        if ($request->hasFile('image_file')) {
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
     * حذف خدمة
     */
    public function destroy($id)
    {
        $vendor = $this->getVendor();
        $service = Service::where('vendor_id', $vendor->id)->findOrFail($id);

        if ($service->image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $service->image));
        }

        $service->delete();
        return response()->json(['message' => 'تم حذف الخدمة بنجاح.']);
    }
}
