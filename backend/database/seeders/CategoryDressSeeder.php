<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Dress;
use Illuminate\Support\Facades\DB;

class CategoryDressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data to avoid duplicates
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Dress::truncate();
        Category::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. الأقسام
        $catWedding = Category::create([
            'name' => 'فساتين زفاف',
            'image' => '/uploads/dresses/فساتين يوم الابيض.mp4'
        ]);

        $catSanaani = Category::create([
            'name' => 'فساتين صنعاني',
            'image' => '/uploads/dresses/صنعاني.jpg'
        ]);

        $catHenna = Category::create([
            'name' => 'فساتين حناء',
            'image' => '/uploads/dresses/فساتين يوم الحنى.mp4'
        ]);

        $catEngagement = Category::create([
            'name' => 'فساتين خطوبة',
            'image' => '/uploads/dresses/الزي الصبري.jpg' // Using as placeholder
        ]);

        // 2. فساتين الزفاف (White dresses)
        $whiteDresses = [
            'فساتين يوم الابيض.mp4',
            'فساتين يوم الابيض (2).mp4',
            'فساتين يوم الابيض (3).mp4',
            'فساتين يوم الابيض (4).mp4',
            'فساتين يوم الابيض (5).mp4',
        ];

        foreach ($whiteDresses as $index => $file) {
            Dress::create([
                'category_id' => $catWedding->id,
                'name' => 'فستان زفاف ملكي ' . ($index + 1),
                'description' => 'إطلالة بيضاء ساحرة مع أرقى الأقمشة والتصاميم العصرية لليلة العمر.',
                'size' => 'M, L',
                'type' => 'Premium',
                'image' => '/uploads/dresses/' . $file,
                'status' => 'متوفر',
            ]);
        }

        // 3. فساتين صنعاني (Sana'ani dresses)
        $sanaaniDresses = [
            'صنعاني.jpg',
            'تراث صنعاني.jpg',
            'القميص الصنعاني.jpg',
            'صنعاني (3).jpg',
            'صنعاني (4).jpg',
            'الزي الصبري.jpg',
        ];

        foreach ($sanaaniDresses as $index => $file) {
            Dress::create([
                'category_id' => $catSanaani->id,
                'name' => 'تراث صنعاني أصيل ' . ($index + 1),
                'description' => 'أجمل الأزياء التراثية الصنعانية المشغولة يدوياً بدقة عالية.',
                'size' => 'S, M, L',
                'type' => 'Traditional',
                'image' => '/uploads/dresses/' . $file,
                'status' => 'متوفر',
            ]);
        }

        // 4. فساتين حناء
        Dress::create([
            'category_id' => $catHenna->id,
            'name' => 'فستان ليلة الحناء',
            'description' => 'تصميم تراثي بلمسة عصرية يناسب فرحة ليلة الحناء.',
            'size' => 'M, L',
            'type' => 'Henna Night',
            'image' => '/uploads/dresses/فساتين يوم الحنى.mp4',
            'status' => 'متوفر',
        ]);
    }
}
