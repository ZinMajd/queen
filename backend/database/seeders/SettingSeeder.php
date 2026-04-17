<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'الملكة فاشن', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'لحظة ملكية تبدأ بفستان', 'group' => 'general'],
            ['key' => 'site_logo', 'value' => null, 'group' => 'general'],
            ['key' => 'contact_phone', 'value' => '+967 777 000 000', 'group' => 'contact'],
            ['key' => 'contact_whatsapp', 'value' => '967777000000', 'group' => 'contact'],
            ['key' => 'site_address', 'value' => 'اليمن - صنعاء - شارع الستين', 'group' => 'contact'],
            ['key' => 'facebook_url', 'value' => 'https://facebook.com/queen', 'group' => 'social'],
            ['key' => 'instagram_url', 'value' => 'https://instagram.com/queen', 'group' => 'social'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
