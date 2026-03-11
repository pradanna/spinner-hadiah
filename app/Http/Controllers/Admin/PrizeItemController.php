<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PrizeItem;
use Illuminate\Http\Request;

class PrizeItemController extends Controller
{
    public function update(Request $request, PrizeItem $prizeItem)
    {
        $validated = $request->validate([
            'unique_code' => 'required|string|max:255|unique:prize_items,unique_code,' . $prizeItem->id,
        ]);

        $prizeItem->update($validated);

        return redirect()->back()->with('success', 'Kode unik berhasil diperbarui.');
    }

    public function destroy(PrizeItem $prizeItem)
    {
        $prizeItem->delete();

        return redirect()->back()->with('success', 'Kode unik berhasil dihapus.');
    }
}
