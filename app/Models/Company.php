<?php

namespace App\Models;

use CodeIgniter\Model;

class Company extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'companies';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['subscriber_id', 'company_name', 'trading_name', 'email', 'contact_number', 'website', 'registration_no', 'enroll_date', 'tax_no', 'gst_vat_no', 'currency_id', 'address_1', 'address_2', 'city', 'state', 'zip_code', 'country_id', 'status', 'created_by', 'updated_by', 'created_at', 'updated_at'];

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
        0 => 'company_name',
        1 => 'enroll_date',
        2 => 'trading_name',
        3 => 'email',
        4 => 'contact_number',
        5 => 'country_name',
        6 => 'status',
    ];

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $userData = getTokenUser();
        $builder = $this->builder();
        $builder->select('companies.*,currencies.currency_name, countries.country_name, CONCAT(createdBy.first_name," ", createdBy.last_name) as created_by, CONCAT(updatedBy.first_name," ", updatedBy.last_name) as updated_by');

        $builder->join('users as createdBy', 'createdBy.id = companies.created_by', 'LEFT');
        $builder->join('users as updatedBy', 'updatedBy.id = companies.updated_by', 'LEFT');
        $builder->join('countries', 'countries.id = companies.country_id', 'LEFT');
        $builder->join('currencies', 'currencies.id = companies.currency_id', 'LEFT');

        (isset($filters['id']) && $filters['id'] != '') ? $builder->where('companies.id', $filters['id'])
            : $builder->where('companies.subscriber_id', $userData['subscriber_id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('companies.company_name', $search);
            $builder->orLike('companies.trading_name', $search);
            $builder->orLike('companies.email', $search);
        }

        if ((isset($filters['from_date']) && $filters['from_date'] != '') && (isset($filters['to_date']) && $filters['to_date'] != '')) {
            $fromDate = $filters['from_date'];
            $toDate = $filters['to_date'];
            $builder->where("companies.enroll_date BETWEEN '$fromDate' AND '$toDate'");
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
            $builder->where('companies.subscriber_id', $userData['subscriber_id']);
            $results['totalCount'] = (int) $builder->countAllResults();
            if ($returnAssoc) {
                $results['data'] = [];
                foreach ($query->getResultArray() as $userDetails) {
                    $results['data'][$userDetails['id']] = $userDetails;
                }
            } else {
                $results['data'] = [];
                foreach ($query->getResultArray() as  $result) {
                    # code...
                    $selectedClient = $this->getSelectedCompanyClient($result['id']);
                    $result['selectedClient'] = $selectedClient;
                    $companySetting = new CompanySetting();
                    $emailConfig = new EmailConfigration();
                    $result['companySetting'] = $companySetting->getSelectedCompanySetting($result['id']);
                    $result['emailConfigration'] = $emailConfig->select('id,company_id,host,port,auth,encryption,username,password,sender_email')->where("company_id", $result['id'])->get()->getRow();
                    $results['data'][] = $result;
                }
            }
        }

        return $results;
    }

    private function getSelectedCompanyClient(int $id)
    {
        $builder = $this->db->table('company_clients');
        $builder->select('clients.id,clients.client_name');
        $builder->join('clients', 'clients.id = company_clients.client_id');
        $builder->where('company_clients.company_id', $id);
        $result = $builder->get()->getResultArray();
        return $result;
    }

    /**
     * This Function return Company currency details
     */
    public function getCurrency($companyID)
    {
        $builder = $this->builder();
        $builder->select('currencies.*');
        $builder->join('currencies', 'currencies.id=companies.currency_id');
        $builder->where('companies.id', $companyID);
        $query = $builder->get();
        $result = $query->getRowArray();
        return $result;
    }

    /***************************************************
     * Get company list as pr login user and user type *
     * 
     * This function use only for dropdown list
     ***************************************************/
    public function getCompaniesByUser($loginUser)
    {
        $builder = $this->builder();
        $builder->select('companies.id,companies.company_name');
        if ($loginUser['user_type'] === 'User') {
            $builder->join('company_users', 'company_users.company_id=companies.id');
            $builder->where('company_users.user_id', $loginUser['id']);
        }

        $builder->where('companies.subscriber_id', $loginUser['subscriber_id']);
        $builder->orderBy('companies.company_name');
        $query = $builder->get();
        $results = $query->getResultArray();

        return $results;
    }

    /*************************************
     *              Reports              *
     *************************************/

    //  Profit & loss Report
    public function withCurrency($companyID)
    {
        $builder = $this->builder();
        $builder->where('companies.id', $companyID);
        $query = $builder->get();
        $result = $query->getRowArray();
        $result['companyCurrency'] = $this->getCurrency($companyID);
        return $result;
    }
}
