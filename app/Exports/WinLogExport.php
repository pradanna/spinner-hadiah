<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class WinLogExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $winLogs;

    public function __construct($winLogs)
    {
        $this->winLogs = $winLogs;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->winLogs;
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Nama Partisipan',
            'Nomor WhatsApp',
            'Hadiah',
            'Kode Unik',
            'Status Kirim',
            'Waktu Menang',
        ];
    }

    /**
     * @param mixed $log
     * @return array
     */
    public function map($log): array
    {
        return [
            $log->id,
            $log->participant->name,
            "'" . $log->participant->whatsapp_number, // Prefix with ' to treat as text
            $log->prizeItem->prize->name,
            $log->prizeItem->unique_code,
            $log->is_sent ? 'Terkirim' : 'Belum Terkirim',
            $log->created_at->format('d-m-Y H:i'),
        ];
    }
}
