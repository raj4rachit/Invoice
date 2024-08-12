<?php

namespace App\Models;

use CodeIgniter\Model;

class CompanyBank extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'company_banks';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['subscriber_id', 'company_id', 'bank_name', 'bank_detail_name', 'account_number', 'account_name', 'created_by', 'updated_by', 'created_at', 'updated_at'];

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
        0 => 'bank_name',
        1 => 'bank_detail_name',
        2 => 'account_name',
        3 => 'account_number',
    ];

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $builder = $this->builder();
        $builder->select('company_banks.*');
        $builder->select('companies.company_name as company_name');
        $builder->join('companies', 'companies.id=company_banks.company_id');

        if (isset($filters['id']) && $filters['id'] != '') $builder->where('company_banks.id', $filters['id']);
        if (isset($filters['subscriber_id']) && $filters['subscriber_id'] != '') $builder->where('company_banks.subscriber_id', $filters['subscriber_id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('company_banks.bank_detail_name', $search);
            $builder->orLike('company_banks.bank_name', $search);
            $builder->orLike('company_banks.account_number', $search);
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
            if (isset($filters['subscriber_id']) && $filters['subscriber_id'] != '') $builder->where('company_banks.subscriber_id', $filters['subscriber_id']);
            $results['totalCount'] = (int) $builder->countAllResults();
            if ($returnAssoc) {
                $results['data'] = [];
                foreach ($query->getResultArray() as $userDetails) {
                    $results['data'][$userDetails['id']] = $userDetails;
                }
            } else {
                $data = [];
                foreach ($query->getResultArray() as $key => $value) {
                    $data[$key] = $value;
                    $data[$key]['extraFiled'] = model(BankField::class)->select('key as extraFiled,value as extraValue')->where("company_bank_id", $value['id'])->findAll();
                }
                $results['data'] = $data;
            }
        }

        return $results;
    }
}
