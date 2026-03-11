<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Prize;
use App\Models\PrizeItem;
use App\Models\WinLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Jobs\SendPrizeWhatsapp;

class SpinnerController extends Controller
{
    /**
     * Display the spinner page.
     */
    public function index()
    {
        // Pastikan user sudah terdaftar dan punya sesi
        if (!session()->has('participant_id')) {
            return redirect()->route('home');
        }

        // Cek apakah partisipan sudah pernah menang/spin
        $hasSpun = WinLog::where('participant_id', session('participant_id'))->exists();
        if ($hasSpun) {
            return Inertia::render('Spinner', [
                'error' => 'Anda sudah pernah melakukan spin sebelumnya.',
            ]);
        }

        // Ambil semua kategori hadiah untuk ditampilkan di roda
        $prizes = Prize::select('id', 'name', 'is_zonk')
            ->withExists(['items' => function ($query) {
                $query->where('is_available', true);
            }])
            ->get();

        return Inertia::render('Spinner', [
            'prizes' => $prizes,
        ]);
    }

    /**
     * Handle the spin logic.
     */
    public function spin(Request $request)
    {
        $participantId = session('participant_id');

        // Validasi #1: Pastikan ada sesi partisipan
        if (!$participantId) {
            return response()->json(['error' => 'Sesi tidak valid. Silakan daftar ulang.'], 403);
        }

        // Validasi #2: Cek apakah partisipan sudah pernah spin sebelumnya
        if (WinLog::where('participant_id', $participantId)->exists()) {
            return response()->json(['error' => 'Anda sudah pernah melakukan spin.'], 403);
        }

        try {
            $result = DB::transaction(function () use ($participantId) {
                // Ambil semua hadiah yang BISA dimenangkan (stok > 0 atau Zonk)
                $prizes = Prize::withExists(['items' => function ($query) {
                        $query->where('is_available', true);
                    }])
                    ->get()
                    ->filter(function ($prize) {
                        return $prize->is_zonk || $prize->items_exists;
                    });

                if ($prizes->isEmpty()) {
                    // Ini terjadi jika semua hadiah (non-zonk) sudah habis dan tidak ada kategori Zonk
                    throw new \Exception("Semua hadiah telah habis.");
                }
                
                $totalProbability = $prizes->sum('probability');
                // Jika total probabilitas 0 (misal semua yg tersisa probabilitasnya 0), maka tidak bisa spin
                 if ($totalProbability <= 0) {
                    // Coba cari Zonk sebagai fallback
                    $wonPrize = Prize::where('is_zonk', true)->first();
                    if (!$wonPrize) {
                        throw new \Exception("Tidak ada hadiah yang bisa dimenangkan saat ini.");
                    }
                } else {
                    $randomNumber = mt_rand(1, $totalProbability);

                    $cumulativeProbability = 0;
                    $wonPrize = null;
                    foreach ($prizes as $prize) {
                        $cumulativeProbability += $prize->probability;
                        if ($randomNumber <= $cumulativeProbability) {
                            $wonPrize = $prize;
                            break;
                        }
                    }
                }
                // -----------------------------

                if (!$wonPrize) {
                    // Fallback jika terjadi kesalahan, seharusnya tidak terjadi
                    throw new \Exception("Gagal menentukan hadiah.");
                }

                $prizeItem = null;
                // Jika hadiahnya BUKAN zonk, cari item hadiah yang tersedia
                if (!$wonPrize->is_zonk) {
                    $prizeItem = PrizeItem::where('prize_id', $wonPrize->id)
                        ->where('is_available', true)
                        ->lockForUpdate() // Kunci baris untuk mencegah race condition
                        ->first();
                }

                // Jika item hadiah spesifik habis, anggap ZONK
                if (!$wonPrize->is_zonk && !$prizeItem) {
                     $wonPrize = $prizes->firstWhere('is_zonk', true) ?? $wonPrize;
                }

                // Buat log kemenangan
                $winLog = WinLog::create([
                    'participant_id' => $participantId,
                    'prize_item_id' => $prizeItem ? $prizeItem->id : null,
                ]);

                // Jika pemenang mendapatkan hadiah (bukan zonk), kirim notifikasi WhatsApp
                if ($prizeItem) {
                    SendPrizeWhatsapp::dispatch($winLog);
                }

                // Update status item hadiah jika ada
                if ($prizeItem) {
                    $prizeItem->update(['is_available' => false]);
                }
                
                // Kembalikan hadiah yang dimenangkan untuk respons JSON
                return [
                    'id' => $wonPrize->id,
                    'name' => $wonPrize->name,
                    'is_zonk' => $wonPrize->is_zonk,
                ];
            });

            return response()->json($result);

        } catch (\Exception $e) {
            // Tangani jika ada kesalahan selama transaksi
            return response()->json(['error' => 'Terjadi kesalahan pada server. Silakan coba lagi. Pesan: ' . $e->getMessage()], 500);
        }
    }
}
