<?php

namespace App\Database\Seeds;

use App\Models\User;
use CodeIgniter\Database\Seeder;
use CodeIgniter\I18n\Time;

class UserSeeder extends Seeder
{
    public function run()
    {

        $defaultUser =  [
            'first_name'    => "Super",
            'last_name'     => "Admin",
            "username"      => 'superadmin',
            'email'         => "admin@gmail.com",
            'password'      => "123456",
            'phone'         => "1234567890",
            'user_type'     => "SuperAdmin",
            'role_id'       => 1,
            'status'        => "Active",
            "created_at"    => Time::now(),
        ];

        $user = new User();
        $user->save($defaultUser);
    }
}
