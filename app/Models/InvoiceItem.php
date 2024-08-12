<?php

namespace App\Models;

use CodeIgniter\Model;

class InvoiceItem extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'invoice_items';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['invoice_id', 'item_type_id', 'client_id', 'is_bifurcated', 'resource_name', 'start_date', 'end_date', 'actual_days', 'working_days', 'resource_quantity', 'rate', 'deduction', 'tax_rate', 'tax_amount', 'discount', 'discount_amount', 'subtotal', 'total_amount', 'description', 'created_at', 'updated_at'];
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
}
