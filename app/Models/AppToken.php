<?php

namespace App\Models;

use CodeIgniter\Model;

class AppToken extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'app_token';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['user_id', 'token', 'ip_address', 'device_type', 'platform_name', 'platform_agent', 'device_id', 'device_name', 'type', 'expired_at', 'created_at', 'updated_at'];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    public function __getTokenUserID()
    {
        $token = getToken();
        $builder = $this->builder()->where('token', $token);
        $query = $builder->get()->getRowArray();
        return $query['user_id'];
    }

    public function getForgotUser($token)
    {
        $builder = $this->builder()->where('token', $token)->where('type', 'Forgot');
        $query = $builder->get()->getRowArray();
        return $query;
    }
}
