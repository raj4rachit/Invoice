<?php

namespace App\Models;

use CodeIgniter\Model;

class IncomeCategory extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'income_categories';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['subscriber_id', 'parent_id', 'name', 'status', 'created_by', 'updated_by', 'created_at', 'updated_at'];

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
        1 => 'parent_name',
        2 => 'status',
    ];


    public function resources($filters = array(), $pagination = true)
    {
        $builder = $this->builder();
        $builder->select("income_categories.*,parent_category.name as parent_name");
        $builder->join("income_categories as parent_category", "parent_category.id = income_categories.parent_id", "LEFT");

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('income_categories.name', $search);
        }

        isset($filters['subscriber_id']) && $filters['subscriber_id'] != '' && $builder->where('income_categories.subscriber_id', $filters['subscriber_id']);


        if ($pagination) {
            if ((isset($filters['displayLength']) && isset($filters['displayStart']))  && $filters['displayLength'] != '' && $filters['displayStart'] != '' && $filters['displayLength'] != '-1') {
                $builder->limit($filters['displayLength'], $filters['displayStart']);
            }

            if (isset($filters['orderDir']) &&  isset($filters['orderColumn'])) {
                $order  = self::ORDERABLE[$filters['orderColumn']];
                $dir    = $filters['orderDir'];
                $builder->orderBy($order, $dir);
            }
        }

        return $builder;
    }

    public function BySubscriberParentCategory($subscriberID)
    {
        $builder = $this->builder();
        $builder->where('subscriber_id', $subscriberID);
        $builder->where('parent_id', null);
        $builder->orderBy('name');
        $query = $builder->get();
        $results = $query->getResultArray();
        return $results;
    }

    public function subCategoryByCategory($categoryID)
    {
        $builder = $this->builder();
        $builder->where('parent_id', $categoryID);
        $builder->orderBy('name');
        $query = $builder->get();
        $results = $query->getResultArray();
        return $results;
    }
}
