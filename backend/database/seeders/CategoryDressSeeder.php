<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Dress;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CategoryDressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data to avoid duplicates
        Schema::disableForeignKeyConstraints();
        Dress::truncate();
        Category::truncate();
        Schema::enableForeignKeyConstraints();

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
        $whiteWeddingData = [
            ['file' => 'فساتين يوم الابيض.mp4', 'name' => 'عروس الملكة', 'type' => 'ملكي', 'size' => 'M', 'status' => 'متاح'],
            ['file' => 'فساتين يوم الابيض (2).mp4', 'name' => 'نقاء الكريستال', 'type' => 'ناعم', 'size' => 'S', 'status' => 'متاح'],
            ['file' => 'فساتين يوم الابيض (3).mp4', 'name' => 'سحر منفوش', 'type' => 'منفوش', 'size' => 'L', 'status' => 'محجوز'],
            ['file' => 'فساتين يوم الابيض (4).mp4', 'name' => 'أمواج البحر', 'type' => 'حورية البحر', 'size' => 'M', 'status' => 'متاح'],
            ['file' => 'فساتين يوم الابيض (5).mp4', 'name' => 'أصالة الزمن', 'type' => 'كلاسيكي', 'size' => 'مفصل', 'status' => 'متاح'],
        ];

        foreach ($whiteWeddingData as $data) {
            Dress::create([
                'category_id' => $catWedding->id,
                'name' => $data['name'],
                'description' => 'إطلالة بيضاء ساحرة مع أرقى الأقمشة والتصاميم العصرية لليلة العمر.',
                'size' => $data['size'],
                'type' => $data['type'],
                'image' => '/uploads/dresses/' . $data['file'],
                'status' => $data['status'],
            ]);
        }

        // 3. فساتين صنعاني (Sana'ani dresses)
        $sanaaniDresses = [
            ['file' => 'صنعاني.jpg', 'name' => 'صنعاني أصيل', 'size' => 'M', 'status' => 'متاح'],
            ['file' => 'تراث صنعاني.jpg', 'name' => 'تراث العروس', 'size' => 'S', 'status' => 'متاح'],
            ['file' => 'القميص الصنعاني.jpg', 'name' => 'القميص المطرز', 'size' => 'L', 'status' => 'محجوز'],
            ['file' => 'صنعاني (3).jpg', 'name' => 'هدايا الجدة', 'size' => 'M', 'status' => 'متاح'],
            ['file' => 'صنعاني (4).jpg', 'name' => 'ليلة العمر الصنعانية', 'size' => 'مفصل', 'status' => 'متاح'],
            ['file' => 'الزي الصبري.jpg', 'name' => 'الزي الصبري', 'size' => 'M', 'status' => 'متاح'],
        ];

        foreach ($sanaaniDresses as $data) {
            Dress::create([
                'category_id' => $catSanaani->id,
                'name' => $data['name'],
                'description' => 'أجمل الأزياء التراثية المشغولة يدوياً بدقة عالية تعكس جمال الماضي.',
                'size' => $data['size'],
                'type' => 'تراثي',
                'image' => '/uploads/dresses/' . $data['file'],
                'status' => $data['status'],
            ]);
        }

        // 4. فساتين حناء
        Dress::create([
            'category_id' => $catHenna->id,
            'name' => 'بهجة الحناء',
            'description' => 'تصميم تراثي بلمسة عصرية يناسب فرحة ليلة الحناء.',
            'size' => 'L',
            'type' => 'تراثي',
            'image' => '/uploads/dresses/فساتين يوم الحنى.mp4',
            'status' => 'متاح',
        ]);
    }
}
