<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class CommonSeeder extends Seeder
{
    public function run()
    {
        $this->call('PermissionSeeder');
        $this->call('RestrictionSeeder');
        $this->call('PermissionGroupSeeder');
        $this->call('RoleSeeder');
        $this->call('UserSeeder');
        $this->call('CurrencySeeder');
        $this->call('CountrySeeder');
    }
}
