<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data to avoid duplicates and handle foreign key constraints
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Service::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Service::create([
            'name' => 'كوافير (تسريحات شعر / مكياج)',
            'description' => 'باقات متكاملة تشمل أحدث تسريحات الشعر العصرية والمكياج السينمائي والملكي بأيدي خبيرات كوافير محترفات.',
            'service_type' => 'تجميل ومكياج',
            'price' => 200.00,
            'image' => 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]);

        Service::create([
            'name' => 'تصوير فوتوغرافي وفيديو',
            'description' => 'تغطية احترافية شاملة لكامل تفاصيل الحفل بأحدث الكاميرات.',
            'service_type' => 'تصوير احترافي',
            'price' => 300.00,
            'image' => 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]);

        Service::create([
            'name' => 'تنسيق قاعة وكوشة',
            'description' => 'تصميم وتجهيز القاعات بأحدث الديكورات العصرية للتناسب مع فخامة الحفل.',
            'service_type' => 'منسق حفلات',
            'price' => 500.00,
            'image' => 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]);
    }
}
