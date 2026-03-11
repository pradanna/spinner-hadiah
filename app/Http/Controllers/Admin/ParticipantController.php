<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ParticipantsExport;
use App\Http\Controllers\Controller;
use App\Models\Participant;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $participants = Participant::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('whatsapp_number', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Participants', [
            'participants' => $participants,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Handle the export of participant data.
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\Response
     */
    public function export(Request $request)
    {
        $format = $request->query('format');
        $timestamp = now()->format('Y-m-d_His');
        $filename = "participants_{$timestamp}";

        if ($format === 'xlsx') {
            return Excel::download(new ParticipantsExport(), "{$filename}.xlsx");
        }

        if ($format === 'pdf') {
            $participants = Participant::all();
            $pdf = Pdf::loadView('exports.participants', ['participants' => $participants]);
            return $pdf->stream("{$filename}.pdf");
        }

        // Redirect back or show an error if the format is invalid
        return redirect()->back()->with('error', 'Format ekspor tidak valid.');
    }
}
