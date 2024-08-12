<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientGroup extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'client_groups';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['subscriber_id', 'group_name', 'description', 'status', 'created_by', 'updated_by', 'created_at', 'updated_at'];

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
        0 => 'group_name',
        1 => 'status',
    ];

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $userData = getTokenUser();
        $builder = $this->builder();
        $builder->select('client_groups.*, CONCAT(createdBy.first_name," ", createdBy.last_name) as created_by, CONCAT(updatedBy.first_name," ", updatedBy.last_name) as updated_by');

        $builder->join('users as createdBy', 'createdBy.id = client_groups.created_by', 'LEFT');
        $builder->join('users as updatedBy', 'updatedBy.id = client_groups.updated_by', 'LEFT');

        (isset($filters['id']) && $filters['id'] != '') ? $builder->where('client_groups.id', $filters['id'])
            : $builder->where('client_groups.subscriber_id', $userData['subscriber_id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('client_groups.group_name', $search);
        }

        if ((isset($filters['displayLength']) && isset($filters['displayStart']))  && $filters['displayLength'] != '' && $filters['displayStart'] != '' && $filters['displayLength'] != '-1') {
            $builder->limit($filters['displayLength'], $filters['displayStart']);
        }

        if (isset($filters['orderDir']) &&  isset($filters['orderColumn'])) {
            $order  = self::ORDERABLE[$filters['orderColumn']];
            $dir    = $filters['orderDir'];
            $builder->orderBy($order, $dir);
        }

        $query = $builder->get();

        if ($returnSingleRow) {
            $results = $query->getRowArray();
        } else {
            $builder->where('client_groups.subscriber_id', $userData['subscriber_id']);
            $results['totalCount'] = (int) $builder->countAllResults();
            if ($returnAssoc) {
                $results['data'] = [];
                foreach ($query->getResultArray() as $userDetails) {
                    $results['data'][$userDetails['id']] = $userDetails;
                }
            } else {
                $results['data'] = $query->getResultArray();
            }
        }

        return $results;
    }
}
