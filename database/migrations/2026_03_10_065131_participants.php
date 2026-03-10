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
        Schema::create('participants', function (Blueprint $table) {
            $table->id();

            // Nomor WA sebagai identitas utama (wajib unique agar tidak bisa main 2x)
            $table->string('whatsapp_number')->unique();

            // --- Fitur Anti-Fraud Sederhana ---
            // Karena tidak pakai OTP, kita catat IP dan Device-nya
            // untuk mencegah 1 orang ngakali pakai banyak nomor palsu
            $table->string('name')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable(); // Mencatat tipe HP/Browser

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
