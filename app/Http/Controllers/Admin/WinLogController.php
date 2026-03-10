<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WinLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

        // Ambil data, urutkan dari yang terbaru, dan paginasi
        $winLogs = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/WinLog', [
            'winLogs' => $winLogs,
            'filters' => $request->only(['search', 'status']), // Kirim filter kembali ke frontend
        ]);
    }

    /**
     * Mark a win log as sent.
     */
    public function markAsSent(WinLog $winlog)
    {
        $winlog->update(['is_sent' => true]);

        // Menggunakan redirect back() standar Inertia akan menyebabkan reload halaman penuh.
        // Cukup kembalikan respons no-content atau respons sukses singkat.
        // Frontend akan mengurus pembaruan UI secara optimis atau melalui refetch.
        return response()->noContent();
    }
}
