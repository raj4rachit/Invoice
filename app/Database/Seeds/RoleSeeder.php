<?php

namespace App\Database\Seeds;

use App\Models\Role;
use CodeIgniter\Database\Seeder;
use CodeIgniter\I18n\Time;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $defaultRoles =  [[
            "name"          => 'Super Admin',
            "group_id"      => 1,
            "can_delete"    => "No",
            "created_at"    => Time::now(),
        ], [
            "name"          => 'Subscriber',
            "group_id"      => 2,
            "can_delete"    => "No",
            "created_at"    => Time::now(),
        ]];

        $role = new Role();
        $role->insertBatch($defaultRoles);
    }
}
