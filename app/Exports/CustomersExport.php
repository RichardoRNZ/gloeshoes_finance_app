<?php

namespace App\Exports;

use App\Models\Customer;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;


class CustomersExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        //
        return Customer::all();
    }
    public function headings(): array
    {
        return [
            'ID Customer',
            'Nama Customer',
            'Alamat',
            'Email',
            'Nomor HP',
            'Nama Instagram'
        ];
    }
    public function map($customer): array
    {
        return [
            $customer->id,
            $customer->name,
            $customer->address,
            $customer->email,
            "'" . $customer->phone_number,
            $customer->instagram_account,


        ];
    }
    public function styles(Worksheet $sheet)
    {
        $headerStyle = [
            'font' => ['bold' => true],
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
