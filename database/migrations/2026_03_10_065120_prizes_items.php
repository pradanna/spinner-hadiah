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
        Schema::create('prize_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prize_id')->constrained()->onDelete('cascade');
            $table->string('unique_code'); // Contoh: 'TIKET-AX192', 'KULKAS-01'
            $table->boolean('is_available')->default(true); // Kalau menang, ini berubah jadi false
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prize_items');
    }
};
