<?php

namespace App\Models;

use CodeIgniter\Model;

class CompanyFinancialYear extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'company_financial_years';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['subscriber_id','company_id', 'financial_year_name', 'start_date', 'end_date', 'is_default', 'created_by', 'updated_by', 'created_at', 'updated_at'];

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
        0 => 'financial_year_name',
        1 => 'start_date',
        2 => 'end_date',
        3 => 'is_default',
    ];

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $userData = getTokenUser();
        $builder = $this->builder();
        $builder->select('company_financial_years.*, companies.company_name as company_name');

        $builder->join('companies', 'companies.id = company_financial_years.company_id');

        (isset($filters['id']) && $filters['id'] != '') ? $builder->where('company_financial_years.id', $filters['id'])
            : $builder->where('company_financial_years.subscriber_id', $userData['subscriber_id']);
            
        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('company_financial_years.financial_year_name', $search);
            $builder->orLike('companies.company_name', $search);
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
            $builder->where('company_financial_years.subscriber_id', $userData['subscriber_id']);
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
