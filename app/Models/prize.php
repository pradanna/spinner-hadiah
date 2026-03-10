<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prize extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'probability',
        'is_zonk',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_zonk' => 'boolean',
    ];

    /**
     * Sebuah tipe hadiah (misal: Kulkas) bisa memiliki banyak item hadiah
     * (misal: Kulkas-01, Kulkas-02).
     */
    public function items(): HasMany
    {
        return $this->hasMany(PrizeItem::class);
    }
}
