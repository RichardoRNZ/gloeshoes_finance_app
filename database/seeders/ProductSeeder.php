<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('products')->insert([
            'name' => 'White Shoes',
            'sku' => 'sho/us-/lea/whi',
            'price' => 100000,
            'cost' => 80000,
            'stock' => 3,
            'image' => 'data:image/jpeg;base64,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',
            'created_by' => 'system'
        ]);
    }
}
