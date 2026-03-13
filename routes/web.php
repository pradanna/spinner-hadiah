<?php

use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SpinnerController;
use App\Models\Participant;
use App\Models\PrizeItem;
use App\Models\WinLog;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Jadikan halaman "Segera Hadir" sebagai halaman utama
Route::get('/', function () {
    return Inertia::render('SpinnerNotReady');
})->name('home');

// Buat rute baru untuk mengakses halaman form pendaftaran asli untuk testing
Route::get('/welcome-test', [ParticipantController::class, 'index'])->name('welcome.test');

Route::post('/join', [ParticipantController::class, 'store'])->name('join')->middleware('throttle:joins');

// Spinner Page
Route::get('/spinner', [SpinnerController::class, 'index'])->name('spinner.index');
Route::post('/spin', [SpinnerController::class, 'spin'])->name('spinner.spin');

Route::get('/coming-soon', function () {
    return Inertia::render('SpinnerNotReady');
})->name('coming.soon');


Route::middleware(['auth', 'verified'])->group(function () {
    // Prize Management
    Route::get('/prizes', [App\Http\Controllers\Admin\PrizeController::class, 'index'])->name('prizes.index');
    Route::post('/prizes', [App\Http\Controllers\Admin\PrizeController::class, 'store'])->name('prizes.store');
    Route::patch('/prizes/{prize}', [App\Http\Controllers\Admin\PrizeController::class, 'update'])->name('prizes.update');
    Route::delete('/prizes/{prize}', [App\Http\Controllers\Admin\PrizeController::class, 'destroy'])->name('prizes.destroy');
    Route::post('/prizes/{prize}/import', [App\Http\Controllers\Admin\PrizeController::class, 'import'])->name('prizes.import');

    // Prize Item Management
    Route::post('/prize-items', [App\Http\Controllers\Admin\PrizeItemController::class, 'store'])->name('prize-items.store');
    Route::patch('/prize-items/{prize_item}', [App\Http\Controllers\Admin\PrizeItemController::class, 'update'])->name('prize-items.update');
    Route::delete('/prize-items/{prize_item}', [App\Http\Controllers\Admin\PrizeItemController::class, 'destroy'])->name('prize-items.destroy');
    Route::post('/prizes/{prize}/items', [App\Http\Controllers\Admin\PrizeController::class, 'storeItem'])->name('prizes.items.store');



    // Participant Management
    Route::get('/participants', [App\Http\Controllers\Admin\ParticipantController::class, 'index'])->name('participants.index');
    Route::get('/participants/export', [App\Http\Controllers\Admin\ParticipantController::class, 'export'])->name('participants.export');

    // Win Log
    Route::get('/winlog', [App\Http\Controllers\Admin\WinLogController::class, 'index'])->name('winlog.index');
    Route::post('/winlog/{winlog}/send-whatsapp', [App\Http\Controllers\Admin\WinLogController::class, 'sendWhatsapp'])->name('winlog.sendWhatsapp');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_participants' => Participant::count(),
                'total_wins' => WinLog::count(),
                'remaining_items' => PrizeItem::where('is_available', true)->count(),
            ],
            'recent_wins' => WinLog::with(['participant', 'prizeItem.prize'])
                ->latest()
                ->take(5)
                ->get()
        ]);
    })->middleware(['auth', 'verified'])->name('dashboard');
});


require __DIR__ . '/auth.php';
