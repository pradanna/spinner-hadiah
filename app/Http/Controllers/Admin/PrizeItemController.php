<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PrizeItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PrizeItemController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'prize_id' => 'required|exists:prizes,id',
            'unique_code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('prize_items'),
            ],
        ], [
            'unique_code.unique' => 'Kode unik ini sudah terdaftar di sistem.'
        ]);

        PrizeItem::create([
            'prize_id' => $request->prize_id,
            'unique_code' => $request->unique_code,
            'is_available' => true,
        ]);

        return redirect()->back()->with('success', 'Kode unik berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PrizeItem $prize_item)
    {
        $request->validate([
            'unique_code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('prize_items')->ignore($prize_item->id),
            ],
        ], [
            'unique_code.unique' => 'Kode unik ini sudah terdaftar di sistem.'
        ]);

        // Hanya izinkan edit jika item belum terpakai
        if (!$prize_item->is_available) {
            return redirect()->back()->with('error', 'Tidak dapat mengubah kode yang sudah terpakai.');
        }

        $prize_item->update($request->only('unique_code'));

        return redirect()->back()->with('success', 'Kode unik berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PrizeItem $prize_item)
    {
        // Hanya izinkan hapus jika item belum terpakai
        if (!$prize_item->is_available) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus kode yang sudah terpakai.');
        }

        $prize_item->delete();

        return redirect()->back()->with('success', 'Kode unik berhasil dihapus.');
    }
}
