<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Buat user admin default agar bisa login ke dashboard
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password123'), // Ganti ini saat naik ke server!
        ]);

        $this->call([
            PrizeSeeder::class,
            PrizeItemSeeder::class,
        ]);
    }
}
