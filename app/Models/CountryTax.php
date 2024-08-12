<?php

namespace App\Models;

use CodeIgniter\Model;

class CountryTax extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'country_taxes';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['country_id', 'tax_name', 'rate', 'is_percentage', 'status', 'created_by', 'updated_by', 'created_at', 'updated_at'];

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
        0 => 'tax_name',
        1 => 'rate',
        2 => 'is_percentage',
        3 => 'country_name',
        4 => 'status'
    ];

    /**
     * Get userList Data for user Listing
     */

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $builder = $this->builder();

        $builder->select('country_taxes.*, countries.country_name');
        $builder->join('countries', 'countries.id=country_taxes.country_id', 'LEFT');

        if (isset($filters['id']) && $filters['id'] != '') $builder->where('country_taxes.id', $filters['id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('tax_name', $search);
            $builder->orLike('rate', $search);
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
}
