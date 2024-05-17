<?php

namespace App\Exports;

use App\Models\Transaction;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class OrderReportExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    private $startDate;
    private $endDate;


    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
    // private $reportData;

    public function collection()
    {
        $transaction = Transaction::whereBetween('date', [$this->startDate, $this->endDate])->get();
        return $transaction;

    }
    public function headings(): array
    {
        return [
            'Order ID',
            'Tanggal Order',
            'Status Order',
            'Nama Customer',
            'Detail Produk',
            'Alamat Pengiriman',
            'Ongkos Kirim',
            'Status Pembayaran',
            'Total Harga',
        ];
    }
    public function map($transaction): array
    {
        $detailProduk = $transaction->detailTransaction->map(function ($item) {
            return $item->product->name . ' - ' .
                   $item->quantity . ' pcs, ' .
                   'Harga: ' . $item->product->price . ', ' .
                   'Ukuran: ' . $item->size . ', ' .
                   'Warna: ' . $item->color . ', ' .
                   'Catatan: ' . $item->notes . ', ' .
                   'Sub Total: ' . ($item->product->price * $item->quantity);
        })->implode(' | ');
        return [

           $transaction->order_number,
           Carbon::parse($transaction->date)->translatedFormat('d F Y'),
           $transaction->status,
           $transaction->headerTransaction->customer->name,
            $detailProduk,
           $transaction->shipment->shipping_address??null,
           $transaction->shipment->price??null,
           $transaction->headerTransaction->headerPayment->payment_status,
           $transaction->headerTransaction->total_price,



        ];
    }
    public function styles(Worksheet $sheet)
    {
        $headerStyle = [
            'font' => ['bold' => true],
            'alignment' => [
                'horizontal' => 'center',
                'vertical' => 'center',
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
        ];

        // Style untuk sel data
        $dataStyle = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
        ];

        // Terapkan gaya ke seluruh area
        $sheet->mergeCells('A1:I1');
        $sheet->setCellValue('A1', 'Data Transaksi Periode '. Carbon::parse($this->startDate)->translatedFormat('F Y').' - '.  Carbon::parse($this->endDate)->translatedFormat('F Y'));
        $sheet->fromArray($this->headings(), null, 'A2');

        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 13,
            ],
            'alignment' => [
                'horizontal' => 'center',
                'vertical' => 'center',
            ],
        ]);
        $sheet->getStyle('A2:I2')->applyFromArray($headerStyle); // Header
        $sheet->getStyle('A2:I' . ($sheet->getHighestRow()))->applyFromArray($dataStyle); // Data

        return [];
    }
}
