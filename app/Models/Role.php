<?php

namespace App\Models;

use CodeIgniter\Model;

class Role extends Model
{
    // protected $DBGroup          = 'default';
    protected $table            = 'role';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    // protected $returnType       = \App\Entities\RoleEntity::class;
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['name', 'group_id', 'subscriber_id', 'can_delete', 'status', 'created_at', 'updated_at'];

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
        0 => 'name',
        1 => 'group_name',
        2 => 'status'
    ];

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        // $builder = $this->builder();
        $builder = $this->db->table('role');
        $builder->select('role.*,permission_group.name as group_name');
        $builder->join('permission_group', 'permission_group.id = role.group_id', 'LEFT');
        $userData = getTokenUser();
        (isset($filters['id']) && $filters['id'] != '') ? $builder->where('role.id', $filters['id']) : $builder->where('role.subscriber_id', $userData['subscriber_id']);
        // $builder->where('role.subscriber_id', $userData['subscriber_id']);
        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('role.name', $search);
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
            (isset($filters['id']) && $filters['id'] != '') ? $builder->where('role.id', $filters['id']) : $builder->where('role.subscriber_id', $userData['subscriber_id']);
            $results['totalCount'] = (int) $builder->countAllResults();

            if ($returnAssoc) {
                $results['data'] = [];
                foreach ($query->getResultArray() as $roleDetails) {
                    $results['data'][$roleDetails['id']] = $roleDetails;
                }
            } else {
                $results['data'] = $query->getResultArray();
            }
        }

        return $results;
    }
}
