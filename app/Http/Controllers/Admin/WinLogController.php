<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WinLog;
use App\Models\Prize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Exports\WinLogExport;
use Maatwebsite\Excel\Facades\Excel;

class WinLogController extends Controller
{
    public function index(Request $request)
    {
        $query = WinLog::with(['participant', 'prizeItem.prize'])
            ->whereNotNull('prize_item_id'); // Hanya tampilkan yang benar-benar dapat hadiah (bukan zonk)

        // Handle pencarian
        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->whereHas('participant', function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('whatsapp_number', 'like', "%{$searchTerm}%");
            });
        }

        // Handle filter status
        if ($request->filled('status')) {
            $status = $request->input('status') === 'sent' ? true : false;
            $query->where('is_sent', $status);
        }

        // Handle filter prize
        if ($request->filled('prize_id')) {
            $query->whereHas('prizeItem', function ($q) use ($request) {
                $q->where('prize_id', $request->input('prize_id'));
            });
        }

        // Ambil data, urutkan dari yang terbaru, dan paginasi
        $winLogs = $query->latest()->paginate(20)->withQueryString();

        // Ambil semua data hadiah untuk opsi filter dropdown
        $prizes = Prize::select('id', 'name')->get();

        return Inertia::render('Admin/WinLog', [
            'winLogs' => $winLogs,
            'filters' => $request->only(['search', 'status', 'prize_id']), // Kirim filter kembali ke frontend
            'prizes' => $prizes,
        ]);
    }

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


    public function sendWhatsapp(WinLog $winlog)
    {
        if ($winlog->is_sent) {
            return redirect()->back()->with('error', 'Pesan untuk pemenang ini sudah pernah dikirim.');
        }

        $token = config('services.fonnte.token');
        if (!$token) {
            Log::error('Fonnte token is not set in services config.');
            return redirect()->back()->with('error', 'Fonnte token tidak diatur.');
        }

        $target = $this->formatWhatsAppNumber($winlog->participant->whatsapp_number);
        $message = "Halo {$winlog->participant->name}, selamat! Kamu memenangkan hadiah: {$winlog->prizeItem->prize->name}. \n\nIni adalah kode unik kamu: *{$winlog->prizeItem->unique_code}*";

        $response = Http::withHeaders([
            'Authorization' => $token,
        ])->post('https://api.fonnte.com/send', [
            'target' => $target,
            'message' => $message,
            'countryCode' => '62',
        ]);

        if ($response->successful()) {
            $winlog->update(['is_sent' => true]);
            return redirect()->back()->with('success', 'Pesan berhasil dikirim.');
        } else {
            Log::error('Fonnte API Error:', [
                'status' => $response->status(),
                'body' => $response->body(),
                'winlog_id' => $winlog->id,
            ]);
            return redirect()->back()->with('error', 'Gagal mengirim pesan via Fonnte.');
        }
    }

    public function export(Request $request)
    {
        $query = WinLog::with(['participant', 'prizeItem.prize'])
            ->whereNotNull('prize_item_id');

        // Apply filters same as index
        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->whereHas('participant', function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('whatsapp_number', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->filled('status')) {
            $status = $request->input('status') === 'sent' ? true : false;
            $query->where('is_sent', $status);
        }

        if ($request->filled('prize_id')) {
            $query->whereHas('prizeItem', function ($q) use ($request) {
                $q->where('prize_id', $request->input('prize_id'));
            });
        }

        $winLogs = $query->latest()->get();

        return Excel::download(new WinLogExport($winLogs), 'pemenang.xlsx');
    }
}
