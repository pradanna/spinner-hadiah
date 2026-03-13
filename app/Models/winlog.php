<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WinLog extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'win_logs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'participant_id',
        'prize_item_id',
        'is_sent',
    ];


    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_sent' => 'boolean',
    ];

    /**
     * Setiap log kemenangan dimiliki oleh satu partisipan.
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    /**
     * Setiap log kemenangan (jika bukan zonk) terhubung ke satu item hadiah.
     */
    public function prizeItem(): BelongsTo
    {
        return $this->belongsTo(PrizeItem::class);
    }

    /**
     * Setiap log kemenangan terhubung ke satu jenis hadiah.a
     */
    public function prize(): BelongsTo
    {
        return $this->belongsTo(Prize::class);
    }
}
