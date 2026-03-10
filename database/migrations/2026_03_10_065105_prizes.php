<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('prizes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Contoh: 'Kulkas', 'Tiket Nonton', 'Zonk'
            $table->integer('probability'); // Bobot persentase
            $table->boolean('is_zonk')->default(false); // Centang true kalau ini Zonk (biar gak perlu cek stok barang)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prizes');
    }
};
