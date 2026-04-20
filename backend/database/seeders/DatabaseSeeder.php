<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategoryDressSeeder::class,
            ServiceSeeder::class,
            SettingSeeder::class,
        ]);

        if (!User::where('email', 'admin@queen.com')->exists()) {
            User::create([
                'name' => 'Admin User',
                'email' => 'admin@queen.com',
                'password' => bcrypt('password'),
                'role' => 'إدارة',
            ]);
        }
    }
}
