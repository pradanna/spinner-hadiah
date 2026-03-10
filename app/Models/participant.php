<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Participant extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'whatsapp_number',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the win log associated with the participant.
     * Berdasarkan aturan validasi, satu partisipan hanya bisa bermain sekali,
     * jadi kita menggunakan relasi hasOne.
     */
    public function winLog(): HasOne
    {
        return $this->hasOne(WinLog::class);
    }
}
