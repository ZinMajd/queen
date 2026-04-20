<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class FixAdminSeeder extends Seeder
{
    public function run()
    {
        $user = User::where('email', 'admin@queen.com')->first();
        if ($user) {
            $user->password = Hash::make('password');
            $user->save();
        }
    }
}
