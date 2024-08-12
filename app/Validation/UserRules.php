<?php

namespace App\Validation;

use App\Models\User;

class UserRules
{
    public function checkEmail(string $str, string $fields, array $data)
    {
        $userModel = new User();

        $userData = $userModel->where('email', $data['email'])->first();

        if (!$userData)

            return false;

        return true;
    }
}
