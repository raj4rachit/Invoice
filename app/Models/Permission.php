<?php

namespace App\Models;

use CodeIgniter\Model;

class Permission extends Model
{
    // protected $DBGroup          = 'default';
    protected $table            = 'permissions';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['name', 'slug', 'url', 'is_default'];

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


    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $builder = $this->db->table('permissions');

        if (isset($filters['id']) && $filters['id'] != '') $builder->where('id', $filters['id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('name', $search);
        }

        if ((isset($filters['displayLength']) && isset($filters['displayStart'])) && $filters['displayLength'] != '' && $filters['displayStart'] != '' && $filters['displayLength'] != '-1') {
            $builder->limit($filters['displayLength'], $filters['displayStart']);
        }

        $query = $builder->get();

        if ($returnSingleRow) {
            $results = $query->getRowArray();
        } else {
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

    public function getPermissionForGroup($permissionID = [], $restrictionID = [])
    {
        $builder = $this->db->table('permissions');
        $builder->select('id,name,slug,is_default');
        (!empty($permissionID)) && $builder->whereIn('id', $permissionID);
        $query = $builder->get()->getResultArray();
        foreach ($query as $key => $permission) {
            $restrictionQuery = $this->db->table('restrictions')->select('id,permission_id,name,slug');
            (!empty($restrictionID)) && $restrictionQuery->whereIn('id', $restrictionID);
            $restrictionResult =  $restrictionQuery->where('permission_id', $permission['id'])->get()->getResultArray();
            $query[$key]['restrictions'] = $restrictionResult;
        }
        return $query;
    }
}
