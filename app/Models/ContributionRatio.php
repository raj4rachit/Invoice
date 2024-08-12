<?php

namespace App\Models;

use CodeIgniter\Model;

class ContributionRatio extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'contribution_ratio';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'subscriber_id',
        'title',
        'ratio',
        'description',
        'status',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at'
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
        1 => 'ratio',
        2 => 'status',
    ];

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $userData = getTokenUser();
        $builder = $this->builder();

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('title', $search);
        }
        $builder->where('subscriber_id', $userData['subscriber_id']);

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

            if (isset($filters['search']) && $filters['search'] != '') {
                $search = $this->db->escapeString((string) $filters['search']);
                $builder->like('title', $search);
            }
            $builder->where('subscriber_id', $userData['subscriber_id']);

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
     * This function return subscriber wise Contribution list
     * ------------------------------------------------------
     * This function use for only listing
     * 
     * @return mixed
     */

    public function BySubscriber()
    {
        $userData = getTokenUser();
        $builder = $this->builder();
        $builder->select('id,title, ratio');
        $builder->where('subscriber_id', $userData['subscriber_id']);
        $builder->where('status', 'Active');
        $query = $builder->get()->getResultArray();

        return $query;
    }
}
