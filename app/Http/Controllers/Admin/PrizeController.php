<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Prize;
use App\Models\PrizeItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PrizeController extends Controller
{
    public function index()
    {
        // Ambil data hadiah beserta relasi item-itemnya
        $prizes = Prize::with(['items' => function ($query) {
            $query->latest();
        }])->withCount(['items as available_stock' => function ($query) {
            $query->where('is_available', true);
        }])->get();

        return Inertia::render('Admin/Prizes', [
            'prizes' => $prizes
        ]);
    }

    public function store(Request $request)
    {
        $currentTotalProbability = Prize::sum('probability');

        $request->validate([
            'name' => 'required|string|max:255|unique:prizes,name',
            'probability' => [
                'required',
                'integer',
                'min:1',
                // Validasi kustom untuk memastikan total probabilitas tidak lebih dari 100%
                function ($attribute, $value, $fail) use ($currentTotalProbability) {
                    if (($currentTotalProbability + (int)$value) > 100) {
                        $available = 100 - $currentTotalProbability;
                        $fail("Total probabilitas akan melebihi 100%. Sisa probabilitas yang tersedia adalah {$available}%.");
                    }
                },
            ],
            'is_zonk' => 'required|boolean',
        ], [
            // Pesan error kustom
            'name.unique' => 'Nama kategori hadiah ini sudah ada.',
        ]);

        Prize::create($request->only('name', 'probability', 'is_zonk'));

        return redirect()->route('prizes.index')->with('success', 'Kategori hadiah berhasil ditambahkan.');
    }

    public function update(Request $request, Prize $prize)
    {
        // Hitung total probabilitas kategori LAIN (selain yang sedang diedit)
        $otherTotalProbability = Prize::where('id', '!=', $prize->id)->sum('probability');

        $request->validate([
            'name' => 'required|string|max:255|unique:prizes,name,' . $prize->id,
            'probability' => [
                'required',
                'integer',
                'min:1',
                function ($attribute, $value, $fail) use ($otherTotalProbability) {
                    if (($otherTotalProbability + (int)$value) > 100) {
                        $available = 100 - $otherTotalProbability;
                        $fail("Total probabilitas akan melebihi 100%. Sisa probabilitas yang tersedia adalah {$available}%.");
                    }
                },
            ],
            'is_zonk' => 'required|boolean',
        ], [
            'name.unique' => 'Nama kategori hadiah ini sudah ada.',
        ]);

        DB::transaction(function () use ($request, $prize) {
            $prize->update($request->only('name', 'probability', 'is_zonk'));

            // Jika kategori diubah menjadi Zonk, hapus semua item kode unik yang ada
            if ($prize->is_zonk) {
                $prize->items()->delete();
            }
        });

        return redirect()->back()->with('success', 'Kategori hadiah berhasil diperbarui.');
    }

    public function destroy(Prize $prize)
    {
        $prize->delete();

        return redirect()->route('prizes.index')->with('success', 'Kategori hadiah berhasil dihapus.');
    }

    public function storeItem(Request $request, Prize $prize)
    {
        // Pastikan kategori bukan Zonk sebelum menambah item
        if ($prize->is_zonk) {
            return back()->withErrors(['unique_code' => 'Kategori Zonk tidak bisa memiliki kode unik.']);
        }

        $validated = $request->validate([
            'unique_code' => 'required|string|max:255|unique:prize_items,unique_code',
        ], [
            'unique_code.required' => 'Kode unik tidak boleh kosong.',
            'unique_code.unique' => 'Kode unik ini sudah ada di sistem.',
        ]);

        $prize->items()->create([
            'unique_code' => $validated['unique_code'],
            'is_available' => true,
        ]);

        return redirect()->back()->with('success', 'Kode unik berhasil ditambahkan.');
    }

    public function import(Request $request, Prize $prize)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt'
        ]);

        // Pastikan kategori bukan Zonk sebelum import
        if ($prize->is_zonk) {
            return redirect()->back()->with('error', 'Kategori Zonk tidak memerlukan kode unik.');
        }

        try {
            $file = $request->file('csv_file');
            $handle = fopen($file->path(), 'r');
            $importedCount = 0;
            $headerSkipped = false;

            DB::beginTransaction();

            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                if (!$headerSkipped) {
                    $headerSkipped = true;
                    continue;
                }

                $uniqueCode = isset($row[0]) ? trim($row[0]) : null;

                if (!empty($uniqueCode)) {
                    // Gunakan firstOrCreate untuk menghindari duplikasi kode unik di seluruh sistem
                    PrizeItem::firstOrCreate([
                        'unique_code' => $uniqueCode
                    ], [
                        'prize_id' => $prize->id,
                        'is_available' => true
                    ]);
                    $importedCount++;
                }
            }

            fclose($handle);
            DB::commit();

            return redirect()->back()->with('success', "$importedCount kode unik berhasil diimport!");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat import: ' . $e->getMessage());
        }
    }
}
