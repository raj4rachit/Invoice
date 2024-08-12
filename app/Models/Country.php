<?php

namespace App\Models;

use CodeIgniter\Model;

class Country extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'countries';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['country_name', 'status', 'created_at', 'updated_at'];

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
        0 => 'country_name',
        1 => 'status',
    ];

    /**
     * Get userList Data for user Listing
     */

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $builder = $this->builder();
        if (isset($filters['id']) && $filters['id'] != '') $builder->where('id', $filters['id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('country_name', $search);
            $builder->orLike('status', $search);
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

    public function demoSP()
    {
        $sql = "CALL country_list()";
		$result = $this->db->query($sql);
        return $result->getResultArray();
    }
}
