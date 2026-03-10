<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    public function index()
    {
        // Menampilkan halaman form input
        return Inertia::render('Welcome');
    }

    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'name' => 'nullable|string|max:255',
            'whatsapp_number' => [
                'required',
                'regex:/^(08|628)[0-9]{8,12}$/', // Harus awalan 08 atau 628, panjang 10-14 digit
                'unique:participants,whatsapp_number' // Cek otomatis ke tabel participants
            ]
        ], [
            // Pesan error custom dalam bahasa Indonesia
            'whatsapp_number.required' => 'Nomor WhatsApp wajib diisi.',
            'whatsapp_number.regex' => 'Format tidak valid. Gunakan awalan 08 atau 628.',
            'whatsapp_number.unique' => 'Nomor ini sudah pernah memutar tiket. Coba nomor lain!'
        ]);

        // 2. Simpan ke Database
        $participant = Participant::create([
            'name' => $request->name,
            'whatsapp_number' => $request->whatsapp_number,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // 3. Simpan sesi agar dia bisa akses halaman spinner
        session(['participant_id' => $participant->id]);

        // 4. Arahkan ke halaman Spinner
        return redirect()->route('spinner.index');
    }
}
