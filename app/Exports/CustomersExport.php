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
    private $index = 0;
    public function collection()
    {
        //
        return Customer::all();
    }
    public function headings(): array
    {
        return [
            'No',
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
            ++$this->index,
            $customer->name,
            $customer->address,
            $customer->email,
            "'" . $customer->phone_number,
            $customer->instagram,


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
