<?php

namespace App\Database\Seeds;

use App\Models\Currency;
use CodeIgniter\Database\Seeder;
use CodeIgniter\I18n\Time;

class CurrencySeeder extends Seeder
{
    public function run()
    {
        
        $default =  [
            [
                "currency_name"     => 'Indian Rupees',
                "currency_symbol"   => '₹',
                "short_code"        => 'INR',
                "status"            => "Active",
                "created_at"        => Time::now(),
            ],
            [
                "currency_name"     => 'Dollar',
                "currency_symbol"   => '$',
                "short_code"        => 'USD',
                "status"            => "Active",
                "created_at"        => Time::now(),
            ]
            
        ];

        $model = new Currency();
        $model->insertBatch($default);
    }
}
