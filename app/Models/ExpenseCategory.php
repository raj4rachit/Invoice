<?php

namespace App\Models;

use CodeIgniter\Model;

class ExpenseCategory extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'expense_categories';
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

    /**
     * This function use for Expense Category Listing
     */

    public function getResources($filters = array(), $returnSingleRow = false)
    {

        $builder = $this->builder();
        $builder->select("expense_categories.*,parent_category.name as parent_name");

        $builder->join("expense_categories as parent_category", "parent_category.id = expense_categories.parent_id", "LEFT");

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('expense_categories.name', $search);
        }
        isset($filters['id']) && $filters['id'] != '' && $builder->where('expense_categories.id', $filters['id']);
        isset($filters['subscriber_id']) && $filters['subscriber_id'] != '' && $builder->where('expense_categories.subscriber_id', $filters['subscriber_id']);
        isset($filters['company_id']) && $filters['company_id'] != '0' && $builder->where('expense_categories.company_id', $filters['company_id']);


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
                $builder->like('expense_categories.name', $search);
            }
            isset($filters['id']) && $filters['id'] != '' && $builder->where('id', $filters['id']);
            isset($filters['subscriber_id']) && $filters['subscriber_id'] != '' && $builder->where('expense_categories.subscriber_id', $filters['subscriber_id']);
            isset($filters['company_id']) && $filters['company_id'] != '0' && $builder->where('expense_categories.company_id', $filters['company_id']);


            $results['totalCount'] = (int) $builder->countAllResults();
            $results['data'] =  $query->getResultArray();
        }

        return $results;
    }

    public function BySubscriber($subscriberID)
    {
        $builder = $this->builder();
        $builder->where('subscriber_id', $subscriberID);
        $builder->orderBy('name');
        $query = $builder->get();
        $results = $query->getResultArray();
        return $results;
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
