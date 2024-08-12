<?php

namespace App\Models;

use CodeIgniter\Model;

class PaymentTerm extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'payment_terms';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ["subscriber_id", "company_id", "title", "description", "status", "created_by", "updated_by", "created_at", "updated_at"];

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
        0 => 'title',
        1 => 'company_name',
        2 => 'description',
        3 => 'status',
    ];

    /**
     * Get userList Data for user Listing
     */

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $builder = $this->builder();
        $builder->select('payment_terms.*,companies.company_name');
        $builder->join('companies','companies.id = payment_terms.company_id','LEFT');
        if (isset($filters['id']) && $filters['id'] != '') $builder->where('payment_terms.id', $filters['id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('payment_terms.title', $search);
            $builder->orLike('companies.company_name', $search);
            $builder->orLike('payment_terms.description', $search);
            $builder->orLike('payment_terms.status', $search);
        }

        $user = getTokenUser();
        if ($user['user_type'] == "Subscriber") {
            $builder->where("payment_terms.subscriber_id", $user['subscriber_id']);
        }

        if ($user['user_type'] == "User") {
            $userCompany = new CompanyUser();
            $companyID = $userCompany->select('company_id')->where('user_id', $user['id'])->get()->getResultArray();
            $companyID = array_map(function ($value) {
                return $value['company_id'];
            }, $companyID);
            $builder->whereIn('payment_terms.company_id', $companyID);
        }

        if (isset($filters['company_id']) && $filters['company_id'] != '0') {
            $builder->where('payment_terms.company_id', $filters['company_id']);
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
