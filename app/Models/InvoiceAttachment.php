<?php

namespace App\Models;

use CodeIgniter\Model;

class InvoiceAttachment extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'invoice_attachments';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['invoice_id', 'file_name', 'document', 'document_type_id', 'created_at', 'updated_at'];

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



    public function byInvoiceID($invoiceID)
    {
        $builder = $this->builder();
        $builder->select('invoice_attachments.id,invoice_attachments.file_name,invoice_attachments.document');
        $builder->select('CONCAT("' . base_url() . '/invoice_attachments/",invoice_attachments.document) as document_link');
        $builder->select('document_types.name as doc_type_name');
        $builder->join('document_types', 'document_types.id=invoice_attachments.document_type_id', 'LEFT');
        $builder->where('invoice_attachments.invoice_id', $invoiceID);
        $query = $builder->get();
        $results = $query->getResultArray();
        return $results;
    }
}
