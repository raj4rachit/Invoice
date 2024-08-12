<?php

namespace App\Models;

use CodeIgniter\Model;

class Subscriber extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'subscribers';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['official_name', 'first_name', 'last_name', 'email', 'phone', 'logo', 'address_1', 'address_2', 'city', 'state', 'zipcode', 'country_id', 'currency_id', 'financial_start_date', 'financial_end_date', 'status', 'created_at', 'updated_at'];

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
        0 => 'official_name',
        1 => 'first_name',
        2 => 'last_name',
        3 => 'email',
        4 => 'phone',
        5 => 'address_1',
        6 => 'address_2',
        7 => 'city',
        8 => 'state',
        9 => 'zipcode',
        10 => 'country_name',
        11 => 'status',
    ];

    /**
     * Get userList Data for user Listing
     */

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $builder = $this->db->table('subscribers as subs');
        $builder->select('subs.*, countries.country_name');
        $builder->join('countries', 'countries.id= subs.country_id', 'LEFT');
        if (isset($filters['id']) && $filters['id'] != '') $builder->where('subs.id', $filters['id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('subs.official_name', $search);
            $builder->orLike('subs.first_name', $search);
            $builder->orLike('subs.last_name', $search);
            $builder->orLike('subs.email', $search);
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

    /**
     * This Function return Subscriber currency details
     */
    public function getCurrency($subscriberID)
    {
        $builder = $this->builder();
        $builder->select('currencies.*');
        $builder->join('currencies', 'currencies.id=subscribers.currency_id');
        $builder->where('subscribers.id', $subscriberID);
        $query = $builder->get();
        $result = $query->getRowArray();
        return $result;
    }
}
