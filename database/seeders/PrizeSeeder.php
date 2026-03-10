<?php

namespace Database\Seeders;

use App\Models\Prize;
use Illuminate\Database\Seeder;

class PrizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Menggunakan updateOrCreate untuk menghindari duplikasi jika seeder dijalankan lagi
        // dan memungkinkan untuk update probabilitas dengan mudah.
        $prizes = [
            // Hadiah Utama
            [
                'name' => 'Kulkas 2 Pintu',
                'probability' => 5, // 5%
                'is_zonk' => false,
            ],
            [
                'name' => 'TV LED 32 Inch',
                'probability' => 10, // 10%
                'is_zonk' => false,
            ],
            // Hadiah Hiburan
            [
                'name' => 'Voucher Pulsa 50rb',
                'probability' => 25, // 25%
                'is_zonk' => false,
            ],
            // Zonk (wajib ada, total probabilitas harus 100%)
            [
                'name' => 'ZONK',
                'probability' => 60, // 60%
                'is_zonk' => true,
            ],
        ];

        // Masukkan data ke database
        foreach ($prizes as $prize) {
            Prize::updateOrCreate(['name' => $prize['name']], $prize);
        }
    }
}
