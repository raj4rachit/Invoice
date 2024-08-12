<?php

namespace App\Validation;

use App\Models\User;

class AuthRules
{
    public function checkCredential(string $str, string $fields, array $data)
    {
        $userModel = new User();

        $userData = $userModel->where('email', $data['email'])->first();

        if (!$userData)

            return false;

        return password_verify($data['password'], $userData['password']);
    }
}
