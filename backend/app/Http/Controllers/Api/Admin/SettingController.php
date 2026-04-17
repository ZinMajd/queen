<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Get all settings grouped.
     */
    public function index()
    {
        $settings = Setting::all()->groupBy('group');
        return response()->json($settings);
    }

    /**
     * Update settings in batch.
     */
    public function update(Request $request)
    {
        $data = $request->all();

        foreach ($data as $key => $value) {
            // Handle file upload for logo
            if ($key === 'site_logo' && $request->hasFile('site_logo')) {
                $oldLogo = Setting::where('key', 'site_logo')->first()?->value;
                if ($oldLogo) {
                    Storage::disk('public')->delete($oldLogo);
                }
                
                $path = $request->file('site_logo')->store('settings', 'public');
                Setting::updateOrCreate(['key' => 'site_logo'], ['value' => $path]);
                continue;
            }

            // Standard text settings
            if (is_string($value) || is_null($value)) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        return response()->json(['message' => 'تم تحديث الإعدادات بنجاح']);
    }

    /**
     * Get public settings (no auth required).
     */
    public function getPublicSettings()
    {
        $keys = ['site_name', 'site_tagline', 'site_logo', 'contact_phone', 'contact_whatsapp', 'site_address', 'facebook_url', 'instagram_url'];
        $settings = Setting::whereIn('key', $keys)->pluck('value', 'key');
        return response()->json($settings);
    }
}
