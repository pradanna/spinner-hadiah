<?php

namespace App\Jobs;

use App\Models\WinLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendPrizeWhatsapp implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The winlog instance.
     *
     * @var \App\Models\WinLog
     */
    public $winlog;

    /**
     * Create a new job instance.
     */
    public function __construct(WinLog $winlog)
    {
        $this->winlog = $winlog;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Pengecekan ulang, jaga-jaga jika job dijalankan lebih dari sekali
        if ($this->winlog->is_sent) {
            return;
        }

        $this->winlog->load('participant', 'prize', 'prizeItem');

        $token = config('services.fonnte.token');
        if (!$token) {
            Log::error('Fonnte token is not set in services config.');
            // Fail the job so it can be retried if configured
            $this->fail('Fonnte token tidak diatur.');
            return;
        }

        $target = $this->formatWhatsAppNumber($this->winlog->participant->whatsapp_number);
        $prizeName = $this->winlog->prize->name;

        if ($prizeName === 'Zonk') {
            $message = "Halo {$this->winlog->participant->name}, sayang sekali kamu belum beruntung kali ini. Coba lagi ya!";
        } else if (str_contains(strtolower($prizeName), 'voucher')) {
            $message = "Halo {$this->winlog->participant->name}, selamat! Kamu memenangkan hadiah: {$prizeName}\n\n"
                . "Ini adalah kode unik kamu: *{$this->winlog->prizeItem?->unique_code}*\n\n"
                . "Cara penggunaaan :\n"
                . "•⁠  ⁠Masuk ke aplikasi MTIX\n"
                . "•⁠  ⁠⁠Pilih Film Tiba Tiba Setan\n"
                . "•⁠  ⁠⁠Pilih Tgl 16 April 2026\n"
                . "•⁠  ⁠⁠Pilih Kursi\n"
                . "•⁠  ⁠⁠Masukkan kode voucher saat melakukan pembayaran\n"
                . "•⁠  ⁠⁠Selamat Menonton\n\n"
                . "•⁠  ⁠Vocher hanya bisa digunakan untuk tanggal 16 April 2026 \n\n"

                . "Cheers";
        } else {
            $message = "Halo {$this->winlog->participant->name}, selamat! Kamu mendapatkan saldo gopay 50K di nomor yang terdaftar ini ({$this->winlog->participant->whatsapp_number})\n\n"
                . "Jangan lupa saksikan film TIBA TIBA SETAN Mulai 16 April 2026 di Bioskop Kesayanganmu!!!";
        }

        $response = Http::withHeaders([
            'Authorization' => $token,
        ])->post('https://api.fonnte.com/send', [
            'target' => $target,
            'message' => $message,
            'countryCode' => '62',
        ]);

        if ($response->successful()) {
            $this->winlog->update(['is_sent' => true]);
        } else {
            Log::error('Fonnte API Error:', [
                'status' => $response->status(),
                'body' => $response->body(),
                'winlog_id' => $this->winlog->id,
            ]);
            // Throw an exception to fail the job, so it can be retried by the queue worker.
            $this->fail("Gagal mengirim pesan via Fonnte. Status: {$response->status()}");
        }
    }

    /**
     * Format a WhatsApp number to international format.
     */
    private function formatWhatsAppNumber($number)
    {
        $cleaned = preg_replace('/\D/', '', $number);
        if (substr($cleaned, 0, 1) === '0') {
            return '62' . substr($cleaned, 1);
        }
        if (substr($cleaned, 0, 2) !== '62') {
            return '62' . $cleaned;
        }
        return $cleaned;
    }
}
