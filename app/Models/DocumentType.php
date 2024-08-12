<?php

namespace App\Models;

use CodeIgniter\Model;

class DocumentType extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'document_types';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['subscriber_id', 'name', 'status', 'created_at', 'updated_at'];

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
        1 => 'status'
    ];

    public function getResources($filters = array(), $returnSingleRow = false)
    {
        $builder = $this->builder();
        $builder->select('document_types.*');


        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('document_types.name', $search);
        }

        isset($filters['id']) && $filters['id'] != '' && $builder->where('document_types.id', $filters['id']);
        isset($filters['subscriber_id']) && $filters['subscriber_id'] != '' && $builder->where('document_types.subscriber_id', $filters['subscriber_id']);

        // Pagination and orderable
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
                $builder->like('document_types.name', $search);
            }

            isset($filters['id']) && $filters['id'] != '' && $builder->where('document_types.id', $filters['id']);
            isset($filters['subscriber_id']) && $filters['subscriber_id'] != '' && $builder->where('document_types.subscriber_id', $filters['subscriber_id']);

            $results['totalCount'] = (int) $builder->countAllResults();
            $results['data'] =  $query->getResultArray();
        }

        return $results;
    }
}
