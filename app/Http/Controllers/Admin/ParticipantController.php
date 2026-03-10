<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil semua data partisipan, urutkan dari yang terbaru
        $participants = Participant::latest()->paginate(20);

        return Inertia::render('Admin/Participants', [
            'participants' => $participants,
        ]);
    }
}
