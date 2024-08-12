<?php

namespace App\Models;

use CodeIgniter\Model;

class User extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'users';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'subscriber_id', 'username', 'password', 'first_name', 'last_name', 'email',  'phone', 'user_type', 'role_id', 'status', 'created_by', 'updated_by', 'created_at', 'updated_at'
    ];

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
    protected $beforeInsert   = ['passwordHash'];
    protected $afterInsert    = [];
    protected $beforeUpdate   = ['passwordHash'];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    const ORDERABLE = [
        0 => 'first_name',
        1 => 'email',
    ];

    protected function passwordHash(array $data)
    {
        if (isset($data['data']['password']))
            $data['data']['password'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
        return $data;
    }

    public function byEmail($email)
    {
        $builder = $this->builder();
        $builder->select('users.*');
        // $builder->select("CONCAT('" . base_url() . "/subscriber_logo/',subscribers.logo) as logo");
        $builder->select('IF(subscribers.logo IS NOT NULL,CONCAT("' . base_url("subscriber_logo") . '/' . '",subscribers.logo),"") AS logo');
        $builder->select('subscribers.financial_start_date, subscribers.financial_end_date');
        $builder->join('subscribers', 'subscribers.id=users.subscriber_id', 'LEFT');
        $builder->where('users.email', $email);
        $query = $builder->get();
        $result = $query->getRowArray();
        return $result;
    }

    /**
     * Get userList Data for user Listing
     */

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $userData = getTokenUser();
        $builder = $this->builder();
        $builder->select('users.*,CONCAT(createdBy.first_name," ", createdBy.last_name) as created_by,CONCAT(updatedBy.first_name, updatedBy.last_name) as updated_by');
        $builder->join('subscribers', 'subscribers.id = users.subscriber_id', 'LEFT');
        $builder->join('users as createdBy', 'createdBy.id = users.created_by', 'LEFT');
        $builder->join('users as updatedBy', 'updatedBy.id = users.updated_by', 'LEFT');

        if (isset($filters['id']) && $filters['id'] != '') {
            $builder->where('users.id', $filters['id']);
        } else {
            $builder->where('users.subscriber_id', $userData['subscriber_id']);
        }
        
        if ($userData['user_type'] === 'Subscriber') {
            $builder->where('users.id !=', $filters['login_user']);
            $builder->where('users.user_type !=', $userData['user_type']);
        }

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('users.first_name', $search);
            $builder->orLike('users.last_name', $search);
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
            (isset($filters['id']) && $filters['id'] != '') ? $builder->where('users.id', $filters['id']) : $builder->where('users.subscriber_id', $userData['subscriber_id']);
            $results['totalCount'] = (int) $builder->countAllResults();
            if ($returnAssoc) {
                $results['data'] = [];
                foreach ($query->getResultArray() as $userDetails) {
                    $results['data'][$userDetails['id']] = $userDetails;
                    $results['data'][$userDetails['id']]['full_name'] = $userDetails['first_name'] . ' ' . $userDetails['last_name'];
                }
            } else {
                $userDetails = array_map(function ($userDetail) {
                    $selectedCompany = $this->getSelectedCompanyUser($userDetail['id']);
                    $defaultCompany = $this->getSelectedCompanyUser($userDetail['id'], true, true);
                    $userDetail['selectedCompany'] = $selectedCompany;
                    $userDetail['full_name'] = $userDetail['first_name'] . ' ' . $userDetail['last_name'];
                    if (!empty($defaultCompany)) {
                        $userDetail['company_id'] = $defaultCompany->id;
                        $userDetail['company_name'] = $defaultCompany->company_name;
                    }
                    unset($userDetail['password']);
                    return $userDetail;
                }, $query->getResultArray());

                $results['data'] = $userDetails;
            }
        }

        return $results;
    }

    private function getSelectedCompanyUser(int $id, bool $single = false, bool $default = false)
    {
        $builder = $this->db->table('company_users');
        $builder->select('companies.id,company_name');
        $builder->join('companies', 'companies.id = company_users.company_id');
        $builder->where('company_users.user_id', $id);
        if ($default) {
            $builder->where('is_default', "Yes");
        }
        if ($single) {
            $result = $builder->get()->getRow();
        } else {
            $result = $builder->get()->getResultArray();
        }
        return $result;
    }

    /**
     * Get User By Subscriber or Company
     * -----------------------------------
     * This function only for user listing 
     * 
     * @return mixed
     */
    public function ByCompany()
    {
        $userData = getTokenUser();
        $selectedCompany = getSelectedCompany();
        $companyID = $selectedCompany->company_id;
        $userType = $userData['user_type'];


        $builder =  $this->builder();
        $builder->select('id, first_name, last_name');

        // Subscriber's all user
        if ($companyID === '0' && $userType === 'Subscriber') {

            $builder->where('subscriber_id', $userData['subscriber_id']);
        }

        // Selected Company's user
        if ($companyID !== '0') {
            $userIDS = model(CompanyUser::class)->where('company_id', $companyID)->findColumn('user_id');
            $builder->whereIn('id', $userIDS);
        }

        $builder->where('user_type !=', 'Subscriber');
        $query = $builder->get()->getResultArray();
        return $query;
    }
}
