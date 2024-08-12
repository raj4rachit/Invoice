<?php

namespace App\Models;

use CodeIgniter\Model;

class InvoiceBank extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'invoice_banks';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['invoice_id', 'company_bank_id', 'created_at'];

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


    public function invoiceBanks($invoiceID)
    {
        $builder = $this->builder('invoices');
        $builder->select('CB.*');
        $builder->join('invoice_banks as IB', 'IB.invoice_id=invoices.id', 'LEFT');
        $builder->join('company_banks as CB', 'CB.id=IB.company_bank_id');
        $builder->where('IB.invoice_id', $invoiceID);
        $query = $builder->get();
        $results = $query->getResultArray();
        foreach ($results as $key => $value) :
            $bankFiled = model(BankField::class)->where('company_bank_id', $value['id'])->findAll();
            $results[$key]['filed'] = $bankFiled;
        endforeach;
        return $results;
    }
}
