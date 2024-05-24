<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ProductExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    /**
    * @return \Illuminate\Support\Collection
    */
    private $index = 0;
    public function collection()
    {
        //
        return Product::all();
    }
    public function headings(): array
    {
        return [
            'No',
            'SKU Produk',
            'Nama Produk',
            'HPP',
            'Harga Jual',
            'Stok',

        ];
    }
    public function map($product): array
    {
        return [

            ++$this->index,
            $product->sku,
            $product->name,
            $product->cost,
            $product->price,
            $product->stock,
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
        $sheet->getStyle('A1:F1')->applyFromArray($headerStyle); // Header
        $sheet->getStyle('A2:F' . ($sheet->getHighestRow()))->applyFromArray($dataStyle); // Data

        return [];
    }

}
