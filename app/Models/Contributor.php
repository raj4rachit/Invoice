<?php

namespace App\Models;

use CodeIgniter\Model;

class Contributor extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'contributors';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['subscriber_id', 'first_name', 'last_name', 'status', 'created_at', 'updated_at'];

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

    const ORDERABLE = [
        0 => 'first_name',
        1 => 'last_name',
        2 => 'status',
    ];

    public function resource($filters = array(),  $pagination = true)
    {
        $userData = getTokenUser();
        $builder = $this->builder();
        $builder->where('subscriber_id', $userData['subscriber_id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('first_name', $search);
            $builder->orLike('last_name', $search);
        }

        if ($pagination) {
            if ((isset($filters['displayLength']) && isset($filters['displayStart']))  && $filters['displayLength'] != '' && $filters['displayStart'] != '' && $filters['displayLength'] != '-1') {
                $builder->limit($filters['displayLength'], $filters['displayStart']);
            }

            if (isset($filters['orderDir']) &&  isset($filters['orderColumn'])) {
                $order  = self::ORDERABLE[$filters['orderColumn']];
                $dir    = $filters['orderDir'];
                $builder->orderBy($order, $dir);
            }
        }
        return $builder;
    }
}
