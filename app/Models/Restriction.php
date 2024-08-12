<?php

namespace App\Models;

use CodeIgniter\Model;

class Restriction extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'restrictions';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['permission_id', 'name', 'slug', 'description', 'created_at', 'updated_at'];

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
        1 => 'permission_name',
    ];

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $builder = $this->db->table('restrictions as r');
        $builder->select('r.*, p.name as permission_name');
        $builder->join('permissions as p', 'p.id= r.permission_id', 'LEFT');

        if (isset($filters['id']) && $filters['id'] != '') $builder->where('r.id', $filters['id']);

        if (isset($filters['permission_id']) && $filters['permission_id'] != '0') $builder->where('r.permission_id', $filters['permission_id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('r.name', $search);
        }

        if ((isset($filters['displayLength']) && isset($filters['displayStart'])) && $filters['displayLength'] != '' && $filters['displayStart'] != '' && $filters['displayLength'] != '-1') {
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
            if (isset($filters['permission_id']) && $filters['permission_id'] != '0') $builder->where('r.permission_id', $filters['permission_id']);
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

    public function getRestrictionsByIds(array $IDs)
    {
        $builder = $this->db->table('restrictions');
        $builder->select('id,permission_id,name,slug');
        $builder->whereIn('id', $IDs);
        $query = $builder->get()->getResultArray();
        return $query;
    }
}
