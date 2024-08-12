<?php

namespace App\Database\Seeds;

use App\Models\Country;
use CodeIgniter\Database\Seeder;
use CodeIgniter\I18n\Time;

class CountrySeeder extends Seeder
{
    public function run()
    {

        $default =  [
            [
                "country_name"  => 'India',
                "status"        => "Active",
                "created_at"    => Time::now(),
            ],
            [
                "country_name"  => 'USA',
                "status"        => "Active",
                "created_at"    => Time::now(),
            ],
            [
                "country_name"  => 'Australia',
                "status"        => "Active",
                "created_at"    => Time::now(),
            ],
            [
                "country_name"  => 'UK',
                "status"        => "Active",
                "created_at"    => Time::now(),
            ]
        ];

        $model = new Country();
        $model->insertBatch($default);
    }
}
