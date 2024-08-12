<?php

namespace App\Models;

use CodeIgniter\Model;

class CompanySetting extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'company_settings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['company_id', 'company_logo', 'company_code', 'invoice_number_type', 'prefix_company_code', 'prefix_company_year', 'prefix_company_month', 'invoice_prefix_date_format', 'created_by', 'updated_by', 'created_at', 'updated_at'];

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

    public function getSelectedCompanySetting($company_id)
    {
        $builder = $this->builder();
        $builder->select("*,CONCAT('" . base_url() . "/company_logo/',company_logo) as company_logo");
        $builder->where('company_id', $company_id);
        $query = $builder->get();

        return $query->getRow();
    }


    public function generateInvoiceNumber($selectedCompany)
    {
        $companyID = $selectedCompany->company_id;

        $startYearTwoDigit = date('y', strtotime($selectedCompany->start_date));
        $endYearTwoDigit = date('y', strtotime($selectedCompany->end_date));
        $invoiceYearRange = ($startYearTwoDigit == $endYearTwoDigit) ? date('Y', strtotime($selectedCompany->start_date)) : $startYearTwoDigit . $endYearTwoDigit;

        $builder = $this->builder();
        $builder->where('company_id', $companyID);
        $result = $builder->get()->getRowArray();

        $invoiceNo = str_pad('0001', 4, "0", STR_PAD_LEFT);
        if ($result) {

            if ($result['invoice_number_type'] == '1') {
                $invoiceCount = model(Invoice::class)->where('company_id', $companyID)->countAllResults();

                if ($invoiceCount > 0) {
                    $count = $invoiceCount + 1;
                    $invoiceNo = str_pad((string) $count, 4, "0", STR_PAD_LEFT);
                }
                return $invoiceNo;
            } elseif ($result['invoice_number_type'] == '2') {
                $getTotalInvoice = model(Invoice::class)->where('company_id', $companyID)->where('MONTH(invoice_date)', date('m'))->where('YEAR(invoice_date)', date('Y'))->countAllResults();
                if ($getTotalInvoice > 0) {
                    $count = $getTotalInvoice + 1;
                    $invoiceNo = str_pad((string) $count, 4, "0", STR_PAD_LEFT);
                }

                $CompanyCode = $result['prefix_company_code'] == '1' ? $result['company_code'] . '/' : '';
                $CompanyYear = $result['prefix_company_year'] == '1' ? $invoiceYearRange . '/' : '';
                $CompanyMonth = $result['prefix_company_month'] == '1' ? strtoupper(date($result['invoice_prefix_date_format'])) . '/' : '';
                $customNumber =  $CompanyCode . $CompanyYear . $CompanyMonth . $invoiceNo;
                return $customNumber;
            }
            return $invoiceNo;
        }
        return $invoiceNo;
    }
}
