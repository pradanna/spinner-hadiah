<?php

namespace Database\Seeders;

use App\Models\Prize;
use App\Models\PrizeItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class PrizeItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Matikan pengecekan relasi sementara
        Schema::disableForeignKeyConstraints();

        // 2. Sekarang aman untuk di-truncate
        PrizeItem::truncate();

        // 3. Nyalakan kembali pengecekannya
        Schema::enableForeignKeyConstraints();

        // Tentukan jumlah stok untuk setiap hadiah
        // Key harus cocok dengan 'name' di PrizeSeeder
        $stock = [
            'Kulkas 2 Pintu' => 2,
            'TV LED 32 Inch' => 5,
            'Voucher Pulsa 50rb' => 20,
        ];

        // Ambil semua hadiah yang bukan ZONK
        $prizes = Prize::where('is_zonk', false)->get();

        foreach ($prizes as $prize) {
            if (isset($stock[$prize->name])) {
                $quantity = $stock[$prize->name];
                $prefix = strtoupper(Str::slug($prize->name, ''));

                for ($i = 1; $i <= $quantity; $i++) {
                    PrizeItem::create([
                        'prize_id' => $prize->id,
                        'unique_code' => $prefix . '-' . Str::upper(Str::random(6)),
                        'is_available' => true,
                    ]);
                }
            }
        }
    }
}
