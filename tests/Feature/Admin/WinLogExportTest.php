<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\WinLog;
use App\Models\Prize;
use App\Models\PrizeItem;
use App\Models\Participant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\WinLogExport;
use Tests\TestCase;

class WinLogExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_win_log_can_be_exported()
    {
        Excel::fake();

        $user = User::factory()->create();
        $this->actingAs($user);

        // Create some win logs
        $participant = Participant::factory()->create();
        $prize = Prize::factory()->create();
        $prizeItem = PrizeItem::factory()->create(['prize_id' => $prize->id]);
        WinLog::factory()->create([
            'participant_id' => $participant->id,
            'prize_item_id' => $prizeItem->id,
        ]);

        $response = $this->get(route('winlog.export'));

        $response->assertStatus(200);

        Excel::assertDownloaded('pemenang.xlsx', function (WinLogExport $export) {
            // Assert that the export contains the win log
            return $export->collection()->count() > 0;
        });
    }
}
