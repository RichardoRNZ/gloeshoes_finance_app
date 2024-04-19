<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('customers')->insert([
            'name' => 'Hello',
            'address' => 'Jln Barat 3 No 126, Jakarta Barat, Indonesia',
            'phone_number' => '08345232882329',
            'email' => 'richardo@gmail.com',
            'instagram' => '@richardo',
            'created_by' => 'system',

        ]);
        for ($i = 0; $i < 10; $i++) {
            DB::table('customers')->insert([
                'name' => 'Richardo',
                'address' => 'Jln Barat 3 No 126, Jakarta Barat, Indonesia',
                'phone_number' => '08345232882329',
                'email' => 'richardo@gmail.com',
                'instagram' => '@richardo',
                'created_by' => 'system',

            ]);
        }

    }
}
