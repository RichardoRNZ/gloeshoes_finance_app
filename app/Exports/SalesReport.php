<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;

class SalesReport implements WithMultipleSheets
{

    private $grossProfit;
    private $sales;
    private $startDate;
    private $endDate;

    public function __construct($grossProfit, $sales, $startDate, $endDate)
    {
        $this->grossProfit = $grossProfit;
        $this->sales = is_array($sales) ? Collection::make($sales) : $sales;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
    public function sheets(): array
    {
        $sheets = [];

        $sheets[] = new GenericSheet($this->grossProfit, ['Waktu', 'Jumlah Sepatu Terjual','Harga /pcs', 'Total Pendapatan','Total Biaya', 'Laba Kotor'], $this->startDate, $this->endDate, 'Laporan Laba/Rugi','F');
        $sheets[] = new GenericSheet($this->sales, ['Nama Produk', 'Jumlah Sepatu Terjual', 'Harga','Total Pendapatan'], $this->startDate, $this->endDate, 'Laporan Penjualan','D');


        return $sheets;
    }
}
class GenericSheet implements FromCollection, WithHeadings, ShouldAutoSize, WithStyles, WithTitle
{

    private $colections;
    private $headings;
    private $startDate;
    private $endDate;
    private $title;
    private $cell;
    public function __construct($colections, $headings, $startDate, $endDate, $title, $cell){
        $this->colections = $colections;
        $this->headings = $headings;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->title = $title;
        $this->cell = $cell;


    }
    public function collection()
    {
        return $this->colections;
    }
    public function headings(): array
    {
        return $this->headings;
    }
    public function title(): string
    {
        return $this->title;
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
        $sheet->mergeCells('A1:'.$this->cell.'1');
        $sheet->setCellValue('A1', $this->title.' Periode '. Carbon::parse($this->startDate)->translatedFormat('F Y').' - '.  Carbon::parse($this->endDate)->translatedFormat('F Y'));
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
        $sheet->getStyle('A2:'.$this->cell.'2')->applyFromArray($headerStyle); // Header
        $sheet->getStyle('A2:'.$this->cell .  ($sheet->getHighestRow()))->applyFromArray($dataStyle); // Data

        return [];
    }

}

