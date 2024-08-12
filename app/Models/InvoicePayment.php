<?php

namespace App\Models;

use CodeIgniter\Model;

class InvoicePayment extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'invoice_payments';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['invoice_id', 'payment_date', 'reference_no', 'payment_source_id', 'invoice_currency_amount', 'tds', 'currency_conversion_rate', 'company_currency_amount', 'invoice_remaining_amount', 'difference_amount', 'amount_without_tax', 'subscriber_ccr', 'USD_ccr', 'payment_status', 'status', 'note', 'created_by', 'updated_by', 'created_at', 'updated_at'];

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
        0 => 'reference_no',
        1 => 'payment_date',
        1 => 'company_currency_amount',
        1 => 'tds',
        1 => 'currency_conversion_rate',
        1 => 'invoice_currency_amount',
        1 => 'payment_source_name',
        1 => 'status',
    ];

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $builder = $this->builder();
        // $builder->select('invoice_payments.*, payment_sources.payment_source_name,company_currencies.short_code as company_currency_short_code,company_currencies.locale as company_currency_locale, invoice_currencies.short_code as invoice_currency_short_code,invoice_currencies.locale as invoice_currency_locale');
        $builder->select('
        invoice_payments.id, invoice_payments.invoice_id, invoice_payments.payment_date, invoice_payments.reference_no, invoice_payments.tds, invoice_payments.company_currency_amount, invoice_payments.status,
        payment_sources.payment_source_name,
        company_currencies.short_code as company_currency_short_code, company_currencies.locale as company_currency_locale
        ');

        $builder->join('invoices', 'invoice_payments.invoice_id = invoices.id');
        $builder->join('currencies as company_currencies', 'company_currencies.id = invoices.company_currency_id', 'LEFT');
        // $builder->join('currencies as invoice_currencies', 'invoice_currencies.id = invoices.invoice_currency_id', 'LEFT');
        $builder->join('payment_sources', 'payment_sources.id = invoice_payments.payment_source_id');

        if (isset($filters['invoice_id']) && $filters['invoice_id'] != '') $builder->where('invoice_payments.invoice_id', $filters['invoice_id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('invoice_payments.reference_no', $search);
            $builder->orLike('invoice_payments.tds', $search);
            $builder->orLike('invoice_payments.company_currency_amount', $search);
            $builder->orLike('invoice_payments.status', $search);
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
                $data = $query->getResultArray();
                foreach ($data as $key => $value) {
                    // $data[$key]['invoice_currency_amount'] = format_amount($value['invoice_currency_amount'], $value['invoice_currency_short_code'], $value['invoice_currency_locale']);
                    $data[$key]['company_currency_amount'] = format_amount($value['company_currency_amount'], $value['company_currency_short_code'], $value['company_currency_locale']);
                    $data[$key]['tds'] = format_amount($value['tds'], $value['company_currency_short_code'], $value['company_currency_locale']);
                }
                $results['data'] = $data;
            }
        }

        return $results;
    }


    /**
     * Get invoice payment details
     */
    public function getAddEditInvoiceDetails($invoiceID)
    {
        $builder = $this->db->table('invoices');
        $builder->select('invoices.*');
        $builder->select("SUM((invoices.total_tax_amount * invoices.currency_conversion_rate) + invoices.company_currency_total_amount) as company_currency_total_amount");
        $builder->select("(SELECT SUM(company_currency_amount + tds) FROM invoice_payments WHERE invoice_id=invoices.id GROUP BY invoice_id) as total_payment_amount ");
        $builder->select('company_currencies.short_code as company_currency_short_code, company_currencies.locale as company_currency_locale');
        $builder->select('invoice_currencies.short_code as invoice_currency_short_code, invoice_currencies.locale as invoice_currency_locale');
        $builder->join('companies', 'companies.id=invoices.company_id');
        $builder->join('currencies as company_currencies', 'company_currencies.id = companies.currency_id');
        $builder->join('currencies as invoice_currencies', 'invoice_currencies.id = invoices.invoice_currency_id');
        $builder->where('invoices.id', $invoiceID);
        $query = $builder->get();
        $results = $query->getRowArray();

        // $data = [
        //     'net_amount_invoice'        => format_amount($results['subtotal'], $results['invoice_currency_short_code'], $results['invoice_currency_locale']),
        //     'net_amount_company'        => format_amount($results['subtotal'] * $results['currency_conversion_rate'], $results['company_currency_short_code'], $results['company_currency_locale']),
        //     'tax_invoice'               => format_amount($results['total_tax_amount'], $results['invoice_currency_short_code'], $results['invoice_currency_locale']),
        //     'tax_company'               => format_amount($results['total_tax_amount'] * $results['currency_conversion_rate'], $results['company_currency_short_code'], $results['company_currency_locale']),
        //     'total_amount_invoice'      => format_amount($results['invoice_currency_total_amount'], $results['invoice_currency_short_code'], $results['invoice_currency_locale']),
        //     'total_amount_company'      => format_amount($results['company_currency_total_amount'], $results['company_currency_short_code'], $results['company_currency_locale']),
        //     'remaining_amount_invoice'  => format_amount($results['invoice_currency_total_amount'] - $results['invoice_currency_amount_received'], $results['invoice_currency_short_code'], $results['invoice_currency_locale']),
        //     'remaining_amount_company'  => format_amount($results['total_remaining_amount'], $results['company_currency_short_code'], $results['company_currency_locale']),
        // ];
        return $results;
    }

    /**
     * This function use for Profit loss report
     * 
     * @param array $filters
     * 
     */
    public function ByCompanyIdWithDates($filters)
    {
        $userID = $filters['id'];
        $userType = $filters['user_type'];
        $subscriberID = $filters['subscriber_id'];
        $companyID = $filters['company_id'];
        $startDate = $filters['start_date'];
        $endDate = $filters['end_date'];

        $builder = $this->builder();
        $builder->select('SUM(invoice_payments.company_currency_amount) AS company_currency_amount');
        $builder->select('SUM(invoice_payments.invoice_currency_amount * invoice_payments.subscriber_ccr) AS subscriber_currency_amount');
        $builder->select('SUM(invoice_payments.invoice_currency_amount * invoice_payments.USD_ccr) AS USD_currency_amount');
        $builder->select('companies.company_name');
        $builder->join('invoices', 'invoices.id=invoice_payments.invoice_id');
        $builder->join('companies', 'companies.id=invoices.company_id');

        if ($companyID !== '0') {
            $builder->where('invoices.company_id', $companyID);
        } else if ($userType !== 'Subscriber') {
            $builder->join('company_users', "company_users.company_id=invoices.company_id", 'LEFT');
            $builder->where('company_users.user_id', $userID);
        }

        $builder->where('invoices.subscriber_id', $subscriberID);
        $builder->where("invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate'");
        $builder->groupBy('invoices.company_id');
        $query = $builder->get();

        return $query;
    }

    public function ByCompanyIdWithDates_2($filters)
    {
        $userID = $filters['id'];
        $userType = $filters['user_type'];
        $subscriberID = $filters['subscriber_id'];
        $companyID = $filters['company_id'];
        $startDate = $filters['start_date'];
        $endDate = $filters['end_date'];

        $builder = $this->builder('companies');
        $builder->select("SUM(CASE WHEN (invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate') THEN invoice_payments.company_currency_amount ELSE 0 END) AS company_currency_amount");
        $builder->select("SUM(CASE WHEN (invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate') THEN invoice_payments.invoice_currency_amount * invoice_payments.subscriber_ccr ELSE 0 END) AS subscriber_currency_amount");
        $builder->select("SUM(CASE WHEN (invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate') THEN invoice_payments.invoice_currency_amount * invoice_payments.USD_ccr ELSE 0 END) AS USD_currency_amount");

        $builder->select('companies.company_name');
        $builder->select('companies.id');
        $builder->join('invoices', 'invoices.company_id=companies.id', 'LEFT');
        $builder->join('invoice_payments', 'invoice_payments.invoice_id=invoices.id', 'LEFT');
        if ($companyID !== '0') {
            $builder->where('companies.id', $companyID);
        } else if ($userType !== 'Subscriber') {
            $builder->join('company_users', "company_users.company_id=invoices.company_id", 'LEFT');
            $builder->where('company_users.user_id', $userID);
        }
        $builder->where('companies.subscriber_id', $subscriberID);
        // $builder->where("invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate'");
        $builder->groupBy('companies.id');
        $query = $builder->get();

        return $query;
    }

    public function clientIDByPayments($filters)
    {
        $companyID = $filters['company_id'];
        $startDate = $filters['start_date'];
        $endDate = $filters['end_date'];

        $builder = $this->builder();
        $builder->select('clients.*');
        $builder->join('invoices', 'invoices.id=invoice_payments.invoice_id');
        $builder->join('clients', 'clients.id=invoices.client_id');
        $builder->where("invoices.company_id", $companyID);
        $builder->where("invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate'");
        $builder->groupBy('invoices.client_id');
        $query = $builder->get();
        return $query;
    }

    public function DateWiseInvoicePaymentAmount($loginUser, $dates)
    {
        $subscriberID = $loginUser['subscriber_id'];
        $companyID = $loginUser['company_id'];
        $startDate = $dates['start_date'];
        $endDate = $dates['end_date'];


        $builder = $this->builder();


        if ($companyID != '0') {
            $builder->select("SUM(CASE WHEN(invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate' AND invoices.company_id = $companyID) THEN invoice_payments.company_currency_amount ELSE 0 END) AS company_currency_amount");
            $builder->select('currencies.short_code as short_code,currencies.locale as locale');
            $builder->join('invoices', 'invoices.id=invoice_payments.invoice_id', 'LEFT');
            $builder->join('companies', 'companies.id=invoices.company_id', 'LEFT');
            $builder->join('currencies', 'currencies.id=companies.currency_id', 'LEFT');
        } else {
            $builder->select("SUM(CASE WHEN(invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate' AND invoices.subscriber_id = $subscriberID) THEN invoice_payments.invoice_currency_amount * invoice_payments.subscriber_ccr ELSE 0 END) AS subscriber_currency_amount");
            $builder->select('currencies.short_code as short_code,currencies.locale as locale');
            $builder->join('invoices', 'invoices.id=invoice_payments.invoice_id', 'LEFT');
            $builder->join('subscribers', 'subscribers.id=invoices.subscriber_id', 'LEFT');
            $builder->join('currencies', 'currencies.id=subscribers.currency_id', 'LEFT');
        }

        $companyID != '0'
            ? $builder->where('invoices.company_id', $companyID)
            : $builder->where('invoices.subscriber_id', $subscriberID);

        $builder->groupBy('invoices.subscriber_id');
        $query = $builder->get()->getRowArray();



        if (!$query) {
            $data = $companyID != '0' ? model(Company::class)->find($companyID) : model(Subscriber::class)->find($subscriberID);
            $CurrencyQuery = model(Currency::class)->find($data['currency_id']);
            $amount = 0;
            $finalAmount = format_amount($amount, $CurrencyQuery['short_code'], $CurrencyQuery['locale']);
        } else {
            $amount = ($companyID != '0' ? $query['company_currency_amount'] : $query['subscriber_currency_amount']);
            $finalAmount = format_amount($amount, $query['short_code'], $query['locale']);
        }

        return $finalAmount;
    }

    public function ByInvoiceID($invoiceID)
    {
        $builder = $this->builder();
        $builder->select('invoice_payments.*,payment_sources.payment_source_name as payment_source_name');
        $builder->join('payment_sources', 'payment_sources.id=invoice_payments.payment_source_id');
        $builder->where('invoice_payments.invoice_id', $invoiceID);
        $query = $builder->get();
        $results = $query->getResultArray();
        return $results;
    }
}
