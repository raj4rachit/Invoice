<?php

namespace App\Models;

use CodeIgniter\Model;

class Invoice extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'invoices';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'invoice_no',
        'invoice_date',
        'invoice_due_date',
        'subscriber_id',
        'company_id',
        'client_id',
        'company_financial_id',
        'is_bifurcated',
        'discount_type',
        'is_display_company_amount',
        'invoice_currency_id',
        'company_currency_id',
        'invoice_currency_total_amount',
        'company_currency_total_amount',
        'currency_conversion_rate',
        'invoice_currency_amount_received',
        'company_currency_amount_received',
        'total_tax_amount',
        'total_discount',
        'total_deduction',
        'subtotal',
        'invoice_status',
        'term_id',
        'total_remaining_amount',
        'total_difference',
        'subscriber_currency_id',
        'subscriber_currency_conversion_rate',
        'subscriber_currency_total_amount',
        'USD_currency_conversion_rate',
        'USD_currency_total_amount',
        'invoice_note',
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
        0 => 'id',
        1 => 'client_company',
        2 => 'invoice_date',
        3 => 'subtotal',
        4 => 'total_tax_amount',
        5 => 'currency_conversion_rate',
        6 => 'company_currency_total_amount',
        7 => 'company_currency_amount_received',
        8 => 'is_bifurcated',
        9 => 'invoice_status',
        10 => 'last_attachment_date'
    ];

    /**
     * Get userList Data for user Listing
     */

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $userSelection = getSelectedCompany();
        $userData = getTokenUser();
        $startDate = $userSelection->start_date;
        $endDate = $userSelection->end_date;
        $builder = $this->builder();
        $builder->select(
            'invoices.id,
            invoices.invoice_no,
            clients.client_name,
            clients.company_name as client_company,
            invoices.invoice_date,
            invoices.subtotal,
            invoices.total_discount,
            invoices.currency_conversion_rate,
            invoices.total_tax_amount,
            invoices.company_currency_total_amount,
            invoices.invoice_currency_total_amount,
            invoices.is_bifurcated,
            invoices.company_currency_amount_received,
            company_currency.locale as company_currency_locale,
            company_currency.short_code as company_currency_short_code,
            invoice_currency.locale as invoice_currency_locale,
            invoice_currency.short_code as invoice_currency_short_code,
            invoices.company_currency_amount_received,
            invoices.invoice_status',
        );
        $builder->select("(SELECT created_at FROM invoice_attachments WHERE invoice_id = invoices.id ORDER BY id DESC LIMIT 1) AS last_attachment_date");
        $builder->join('clients', 'clients.id = invoices.client_id');
        $builder->join('currencies as company_currency', 'company_currency.id = invoices.company_currency_id');
        $builder->join('currencies as invoice_currency', 'invoice_currency.id = invoices.invoice_currency_id');

        if ($userSelection->company_id != "0") {
            $builder->where('invoices.company_id', $userSelection->company_id);
            $builder->where('invoices.invoice_date >=', $userSelection->start_date);
            $builder->where('invoices.invoice_date <=', $userSelection->end_date);
        } else {

            $userCompany = new CompanyUser();
            $company = new Company();
            $user = getTokenUser();

            $userCompanies = $userCompany->select('company_id')->where('user_id', $user['id'])->get()->getResultArray();
            if ($user['role_id'] == "2") {
                $userCompanies = $company->select('id as company_id')->where('subscriber_id', $user['subscriber_id'])->get()->getResultArray();
            }

            if (!empty($userCompanies)) {
                $userCompaniesID = array_map(function ($companyID) {
                    return $companyID['company_id'];
                }, $userCompanies);
                $builder->whereIn('invoices.company_id', $userCompaniesID);
            }
        }

        $builder->where("invoices.subscriber_id", $userData['subscriber_id']);

        if (isset($filters['from_date']) || isset($filters['to_date'])) {
            isset($filters['from_date']) && $builder->where('invoices.invoice_date >=', $filters['from_date']);
            isset($filters['to_date']) && $builder->where('invoices.invoice_date <=', $filters['to_date']);
        } else {
            $builder->where("invoices.invoice_date BETWEEN '$startDate' AND '$endDate'");
        }

        if (isset($filters['id']) && $filters['id'] != '') $builder->where('invoices.id', $filters['id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('invoices.invoice_no', $search);
            $builder->orLike('clients.client_name', $search);
            $builder->orLike('clients.company_name', $search);
            $builder->orLike('invoices.invoice_date', $search);
            $builder->orLike('invoices.is_bifurcated', $search);
            $builder->orLike('invoices.subtotal', $search);
            $builder->orLike('invoices.currency_conversion_rate', $search);
            $builder->orLike('invoices.total_tax_amount', $search);
            $builder->orLike('invoices.company_currency_amount_received', $search);
            $builder->orLike('invoices.invoice_status', $search);
        }

        if (isset($filters['client_id']) && $filters['client_id'] !== '0') {
            $builder->where('invoices.client_id', $filters['client_id']);
        }

        if (isset($filters['status']) && $filters['status'] !== '0') {
            if ($filters['status'] === 'Over Due') {
                $builder->where('invoices.invoice_due_date <=', date('Y-m-d'));
                $builder->where('invoices.invoice_status', 'Due');
            } elseif ($filters['status'] === 'Unpaid') {
                $builder->whereIn('invoices.invoice_status', ['Due', 'Partial']);
            } else {
                $builder->where('invoices.invoice_status', $filters['status']);
            }
        }

        if (isset($filters['is_due']) && $filters['is_due'] === 'true') {
            $builder->whereIn('invoices.invoice_status', ['Due', 'Partial']);
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

            if (isset($filters['is_due']) && $filters['is_due'] === 'true') {
                $builder->whereIn('invoices.invoice_status', ['Due', 'Partial']);
            }

            $builder->where("invoices.subscriber_id", $userData['subscriber_id']);
            $builder->where("invoices.invoice_date BETWEEN '$startDate' AND '$endDate'");

            if (isset($filters['id']) && $filters['id'] != '') $builder->where('invoices.id', $filters['id']);
            $results['totalCount'] = (int) $builder->countAllResults();

            if ($returnAssoc) {
                $results['data'] = [];
                foreach ($query->getResultArray() as $userDetails) {
                    $results['data'][$userDetails['id']] = $userDetails;
                }
            } else {
                $data = $query->getResultArray();
                $footerTotal = [];
                if ($userSelection->company_id != "0") {
                    $footerTotal = [
                        'total' => 0,
                        'received_amount' => 0,
                    ];
                }
                $attachment = new InvoiceAttachment();
                if (!empty($data)) {
                    foreach ($data as $key => $result) {
                        $companyCurrency = ((($result['subtotal'] - $result['total_discount']) + $result['total_tax_amount']) * $result['currency_conversion_rate']);
                        if ($userSelection->company_id != "0") {
                            $footerTotal['total'] = (float) $footerTotal['total'] + (float) $companyCurrency;
                            $footerTotal['received_amount'] = (float) $footerTotal['received_amount'] + (float) $result['company_currency_amount_received'];
                        }
                        $data[$key]['has_attachment'] = ($attachment->where('invoice_id', $result['id'])->countAllResults()) > 0 ? true : false;
                        $data[$key]['subtotal'] = format_amount($result['subtotal'], $result['invoice_currency_short_code'], $result['invoice_currency_locale']);
                        $data[$key]['total_discount'] = format_amount($result['total_discount'], $result['invoice_currency_short_code'], $result['invoice_currency_locale']);
                        $data[$key]['total_tax_amount'] = format_amount($result['total_tax_amount'], $result['invoice_currency_short_code'], $result['invoice_currency_locale']);
                        $data[$key]['company_currency_total_amount'] = format_amount($companyCurrency, $result['company_currency_short_code'], $result['company_currency_locale']);
                        $data[$key]['invoice_currency_total_amount'] = format_amount($result['invoice_currency_total_amount'], $result['invoice_currency_short_code'], $result['invoice_currency_locale']);
                        $data[$key]['company_currency_amount_received'] = format_amount($result['company_currency_amount_received'], $result['company_currency_short_code'], $result['company_currency_locale']);
                        $data[$key]['currency_conversion_rate'] = format_amount($result['currency_conversion_rate'], $result['company_currency_short_code'], $result['company_currency_locale'], 6);
                        $data[$key]['is_discount'] = $result['total_discount'] > 0 ? true : false;
                        // $attachmentLastData = $attachment->where('invoice_id', $result['id'])->orderBy('id', 'DESC')->first();

                        // $data[$key]['last_attachment_date'] = !empty($attachmentLastData) ? $attachmentLastData['created_at'] : null;


                    }
                }
                $results['data'] = $data;
                if ($userSelection->company_id != "0") {
                    $currency = model(Company::class)->getCurrency($userSelection->company_id);

                    $footerTotal['total'] = format_amount($footerTotal['total'], $currency['short_code'], $currency['locale']);
                    $footerTotal['received_amount'] = format_amount($footerTotal['received_amount'], $currency['short_code'], $currency['locale']);
                }
                $results['footerTotal'] = $footerTotal;
            }
        }

        return $results;
    }


    public function resource($filters = array(), $pagination = true)
    {
        $userSelection = getSelectedCompany();
        $userData = getTokenUser();
        $startDate = $userSelection->start_date;
        $endDate = $userSelection->end_date;
        $builder = $this->builder();
        $builder->select(
            'invoices.id,
            invoices.invoice_no,
            clients.client_name,
            clients.company_name as client_company,
            invoices.invoice_date,
            invoices.subtotal,
            invoices.total_discount,
            invoices.currency_conversion_rate,
            invoices.total_tax_amount,
            invoices.company_currency_total_amount,
            invoices.invoice_currency_total_amount,
            invoices.is_bifurcated,
            invoices.company_currency_amount_received,
            company_currency.locale as company_currency_locale,
            company_currency.short_code as company_currency_short_code,
            invoice_currency.locale as invoice_currency_locale,
            invoice_currency.short_code as invoice_currency_short_code,
            invoices.company_currency_amount_received,
            invoices.invoice_status',
        );
        $builder->select("(SELECT created_at FROM invoice_attachments WHERE invoice_id = invoices.id ORDER BY id DESC LIMIT 1) AS last_attachment_date");
        $builder->join('clients', 'clients.id = invoices.client_id');
        $builder->join('currencies as company_currency', 'company_currency.id = invoices.company_currency_id', 'LEFT');
        $builder->join('currencies as invoice_currency', 'invoice_currency.id = invoices.invoice_currency_id', 'LEFT');

        if (isset($filters['id']) && $filters['id'] != '') $builder->where('invoices.id', $filters['id']);

        # Check Subscriber
        $builder->where("invoices.subscriber_id", $userData['subscriber_id']);

        # Check Client
        if (isset($filters['client_id']) && $filters['client_id'] !== '0') {
            $builder->where('invoices.client_id', $filters['client_id']);
        }

        if ($userSelection->company_id != "0") {
            $builder->where('invoices.company_id', $userSelection->company_id);
        } else {
            $userCompany = new CompanyUser();
            $company = new Company();
            $user = getTokenUser();

            $userCompanies = $userCompany->select('company_id')->where('user_id', $user['id'])->get()->getResultArray();
            if ($user['role_id'] == "2") {
                $userCompanies = $company->select('id as company_id')->where('subscriber_id', $user['subscriber_id'])->get()->getResultArray();
            }

            if (!empty($userCompanies)) {
                $userCompaniesID = array_map(function ($companyID) {
                    return $companyID['company_id'];
                }, $userCompanies);
                $builder->groupStart()->whereIn('invoices.company_id', $userCompaniesID)->groupEnd();
            }
        }

        # Check Invoice Date
        if (isset($filters['from_date']) || isset($filters['to_date'])) {
            isset($filters['from_date']) && $builder->where('invoices.invoice_date >=', $filters['from_date']);
            isset($filters['to_date']) && $builder->where('invoices.invoice_date <=', $filters['to_date']);
        } else {
            $builder->groupStart()->where("invoices.invoice_date BETWEEN '$startDate' AND '$endDate'")->groupEnd();
        }

        if (isset($filters['status']) && $filters['status'] !== '0') {
            if ($filters['status'] === 'Over Due') {
                $builder->where('invoices.invoice_due_date <=', date('Y-m-d'));
                $builder->where('invoices.invoice_status', 'Due');
            } elseif ($filters['status'] === 'Unpaid') {

                $builder->groupStart()
                    ->whereIn('invoices.invoice_status', ['Due', 'Partial'])
                    ->groupEnd();
            } else {
                $builder->where('invoices.invoice_status', $filters['status']);
            }
        }


        if (isset($filters['is_due']) && $filters['is_due'] === 'true') {
            $builder->whereIn('invoices.invoice_status', ['Due', 'Partial']);
        }

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->groupStart()->like('invoices.invoice_no', $search);
            $builder->orLike('clients.client_name', $search);
            $builder->orLike('clients.company_name', $search);
            $builder->orLike('invoices.subtotal', $search);
            $builder->orLike('invoices.currency_conversion_rate', $search);
            $builder->orLike('invoices.total_tax_amount', $search);
            $builder->orLike('invoices.company_currency_amount_received', $search);
            $builder->orLike('invoices.invoice_status', $search)->groupEnd();
        }

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
    /**
     * Invoice Widgets data for invoice listing page
     */
    public function getWidgetsData($filters = array())
    {
        $userSelection = getSelectedCompany();
        $loginUser = getTokenUser();
        $startDate = $userSelection->start_date;
        $endDate = $userSelection->end_date;
        $builder = $this->builder();

        # Total Invoice 
        $builder->select("COUNT(invoices.id) AS TotalInvoiceCount");
        $builder->select("SUM(invoices.subscriber_currency_total_amount) AS TotalInvoiceAmount");

        # Partial Invoice
        $builder->select("COUNT(CASE WHEN (invoices.invoice_status = 'Partial') THEN 1 ELSE NULL END) AS TotalPartialCount");
        $builder->select("SUM(CASE WHEN (invoices.invoice_status = 'Partial') THEN invoices.subscriber_currency_total_amount ELSE 0 END) AS TotalPartialAmount");

        # OverDue Invoice
        // $builder->select("COUNT(CASE WHEN (invoices.invoice_due_date <= CURDATE() AND (invoices.invoice_status = 'Due' AND invoices.invoice_status = 'Partial')) THEN 1 ELSE NULL END) AS TotalOverDueCount");
        // $builder->select("SUM(CASE WHEN (invoices.invoice_due_date <= CURDATE() AND (invoices.invoice_status = 'Due' AND invoices.invoice_status = 'Partial')) THEN invoices.subscriber_currency_total_amount ELSE 0 END) AS TotalOverDueAmount");
        $builder->select("COUNT(CASE WHEN (invoices.invoice_due_date <= CURDATE() AND (invoices.invoice_status = 'Due')) THEN 1 ELSE NULL END) AS TotalOverDueCount");
        $builder->select("SUM(CASE WHEN (invoices.invoice_due_date <= CURDATE() AND (invoices.invoice_status = 'Due')) THEN invoices.subscriber_currency_total_amount ELSE 0 END) AS TotalOverDueAmount");

        # UnPaid Invoice
        $builder->select("COUNT(CASE WHEN (invoices.invoice_status != 'Paid' AND invoices.invoice_status != 'Bad Debt') THEN 1 ELSE NULL END) AS TotalUnPaidCount");
        $builder->select("SUM(CASE WHEN (invoices.invoice_status != 'Paid' AND invoices.invoice_status != 'Bad Debt') THEN invoices.subscriber_currency_total_amount ELSE 0 END) AS TotalUnPaidAmount");

        # Paid Invoice
        $builder->select("COUNT(CASE WHEN (invoices.invoice_status = 'Paid') THEN 1 ELSE NULL END) AS TotalPaidCount");
        $builder->select("SUM(CASE WHEN (invoices.invoice_status = 'Paid') THEN invoices.subscriber_currency_total_amount ELSE 0 END) AS TotalPaidAmount");

        # Bed Dept Invoice
        $builder->select("COUNT(CASE WHEN (invoices.invoice_status = 'Bad Debt') THEN 1 ELSE NULL END) AS TotalBadDeptCount");
        $builder->select("SUM(CASE WHEN (invoices.invoice_status = 'Bad Debt') THEN invoices.subscriber_currency_total_amount ELSE 0 END) AS TotalBadDeptAmount");

        $builder->select('currencies.*');

        $builder->join('subscribers', 'subscribers.id=invoices.subscriber_id', 'LEFT');
        $builder->join('currencies', 'currencies.id=subscribers.currency_id', 'LEFT');

        # if Company ID is not 0 
        $userSelection->company_id != "0" &&  $builder->where('invoices.company_id', $userSelection->company_id);
        $builder->where('invoices.subscriber_id', $loginUser['subscriber_id']);
        $builder->where("invoices.invoice_date BETWEEN '$startDate' AND '$endDate'");
        $builder->groupBy('invoices.subscriber_id');
        $query = $builder->get();
        $results = $query->getRowArray();

        $data = [];
        if ($results) {
            $data = [
                'TotalInvoiceCount'     => $results['TotalInvoiceCount'],
                'TotalInvoiceAmount'    => format_amount($results['TotalInvoiceAmount'], $results['short_code'], $results['locale']),
                'TotalPartialCount'     => $results['TotalPartialCount'],
                'TotalPartialAmount'    => format_amount($results['TotalPartialAmount'], $results['short_code'], $results['locale']),
                'TotalUnPaidCount'      => $results['TotalUnPaidCount'],
                'TotalUnPaidAmount'     => format_amount($results['TotalUnPaidAmount'], $results['short_code'], $results['locale']),
                'TotalPaidCount'        => $results['TotalPaidCount'],
                'TotalPaidAmount'       => format_amount($results['TotalPaidAmount'], $results['short_code'], $results['locale']),
                'TotalBadDeptCount'     => $results['TotalBadDeptCount'],
                'TotalBadDeptAmount'    => format_amount($results['TotalBadDeptAmount'], $results['short_code'], $results['locale']),
                'TotalOverDueCount'     => $results['TotalOverDueCount'],
                'TotalOverDueAmount'    => format_amount($results['TotalOverDueAmount'], $results['short_code'], $results['locale']),
            ];
        }
        return $data;
    }

    /********************************************************************************************************************************
     * ==================================================== Subscriber Dashboard ====================================================
     * All subscriber dashboard function only use when login userType is Subscriber
     ********************************************************************************************************************************/

    /**
     * Dashboard Yearly Invoice Chart
     */
    public function yearlyChart($userData, $selectedCompany, $currencyData)
    {
        $subscriberID = $userData['subscriber_id'];
        $companyID = $selectedCompany->company_id;
        $IsSubscriber = $companyID === '0' ? true : false;
        $startDate = $selectedCompany->start_date;
        $endDate = $selectedCompany->end_date;
        $time   = strtotime($startDate);
        $last   = date('M-Y', strtotime($endDate));

        $monthName = [];
        do {
            $month = date('M-Y', $time);
            $monthYear[] = date('Y-m', $time);
            $monthName[] = $month;
            $time = strtotime('+1 month', $time);
        } while ($month != $last);

        $newMonthDate = [];
        foreach ($monthYear as $key => $vl) {
            if ($key === array_key_first($monthYear)) {
                $newMonthDate[] = [
                    'start_date' => date('Y-m-d', strtotime($startDate)),
                    'end_date' => date('Y-m-t', strtotime($vl)),
                ];
            } else if ($key === array_key_last($monthYear)) {
                $newMonthDate[] = [
                    'start_date' => date('Y-m-01', strtotime($vl)),
                    'end_date' => date('Y-m-d', strtotime($endDate)),
                ];
            } else {
                $newMonthDate[] = [
                    'start_date' => date('Y-m-01', strtotime($vl)),
                    'end_date' => date('Y-m-t', strtotime($vl)),
                ];
            }
        }

        $loginUser = [
            'subscriberID'  => $subscriberID,
            'companyIDs'    => [$companyID],
            'IsSubscriber'  => $IsSubscriber
        ];

        $invoiceData = $this->getInvoiceChartData($loginUser, $newMonthDate, $currencyData);
        $newIncome = $this->getNewIncomeByMonth($loginUser, $newMonthDate, $currencyData);
        $expenses = $this->getExpenses($loginUser, $newMonthDate, $currencyData);
        $otherIncome = $this->getOtherIncome($loginUser, $newMonthDate, $currencyData);


        $output = [
            'month' => $monthName,
            'series' => [
                [
                    'name' => 'Invoice Amount',
                    'type' => 'column',
                    "data" => array_column($invoiceData, 'total_amount')
                ],
                [
                    'name' => 'New Income',
                    'type' => 'column',
                    "data" => $newIncome
                ],
                [
                    'name' => 'Tax Amount',
                    'type' => 'column',
                    "data" => array_column($invoiceData, 'total_tax_amount')
                ],
                [
                    'name' => 'Expenses',
                    'type' => 'column',
                    "data" => $expenses
                ],
                [
                    'name' => 'Other Income',
                    'type' => 'column',
                    "data" => $otherIncome
                ],
                [
                    'name' => 'Invoice Amount',
                    'type' => 'line',
                    "data" => array_column($invoiceData, 'total_amount')
                ],
            ]
        ];
        return $output;
    }

    public function getInvoiceChartData($loginUser, $monthYear, $currencyData)
    {

        $output = [];
        foreach ($monthYear as $my) {
            $result = $this->getInTotal($loginUser, $my, $currencyData);

            $output[] = $result;
        }
        return $output;
    }

    public function getInTotal($loginUser, $date, $currencyData)
    {
        $subscriberID = $loginUser['subscriberID'];
        $companyIDs = $loginUser['companyIDs'];
        $IsSubscriber = $loginUser['IsSubscriber'];

        $startDate = $date['start_date'];
        $endDate = $date['end_date'];
        $action =  $currencyData['action'];

        $builder = $this->builder();

        if ($action === 'subscriber') {
            $builder->select('SUM(subscriber_currency_total_amount) AS total_amount, SUM(total_tax_amount * subscriber_currency_conversion_rate) AS total_tax_amount');
        } elseif ($action === 'default') {
            $builder->select('SUM(USD_currency_total_amount) AS total_amount, SUM(total_tax_amount * USD_currency_conversion_rate) AS total_tax_amount');
        } else {
            $builder->select('SUM(subtotal) AS total_amount, SUM(total_tax_amount) AS total_tax_amount');
        }

        $builder->where("invoice_date BETWEEN '$startDate' AND '$endDate'");
        if (!$IsSubscriber) {
            $builder->whereIn('company_id', $companyIDs);
        } else {
            $builder->where('subscriber_id', $subscriberID);
        }
        $builder->groupBy('subscriber_id');
        $query = $builder->get()->getRowArray();

        $output = [
            'total_amount' => !empty($query) ? $query['total_amount'] : '0',
            'total_tax_amount' => !empty($query) ? number_format((float)$query['total_tax_amount'], 2, '.', '') : '0',
        ];

        return $output;
    }

    public function getNewIncomeByMonth($loginUser, $MonthDate,  $currencyData)
    {
        $subscriberID = $loginUser['subscriberID'];
        $companyIDs = $loginUser['companyIDs'];
        $IsSubscriber = $loginUser['IsSubscriber'];
        $action = $currencyData['action'];

        // $startDate = $date['start_date'];
        // $endDate = $date['end_date'];

        // Get Client
        $clientBuilder = $this->builder('clients');
        $clientBuilder->select('clients.*');
        if ($IsSubscriber) {
            $clientBuilder->where('clients.subscriber_id', $subscriberID);
        } else {
            $clientBuilder->join('company_clients', 'company_clients.client_id=clients.id');
            $clientBuilder->whereIn('company_clients.company_id', $companyIDs);
        }
        // $clientBuilder->where("clients.enroll_date BETWEEN '$startDate' AND '$endDate'");
        $clientList = $clientBuilder->get()->getResultArray();


        $monthlyIncome = [];
        foreach ($MonthDate as $my) {


            $startDate = $my['start_date'];
            $endDate = $my['end_date'];

            $monthNewIncome = [];
            foreach ($clientList as  $value) :

                if ($startDate <= $value['enroll_date'] && $endDate >= $value['enroll_date']) {
                    $builder = $this->builder();

                    if ($action === 'subscriber') {
                        $builder->select("IFNULL(SUM(subscriber_currency_total_amount),0) AS NewIncome");
                    } elseif ($action === 'default') {
                        $builder->select("IFNULL(SUM(USD_currency_total_amount),0) AS NewIncome");
                    } else {
                        $builder->select("IFNULL(SUM(subtotal),0) AS NewIncome");
                    }
                    // $builder->select("invoices.*");
                    $builder->where('client_id', $value['id']);
                    if ($IsSubscriber) {
                        $builder->where('subscriber_id', $subscriberID);
                    } else {
                        $builder->whereIn('company_id', $companyIDs);
                    }
                    $builder->where("invoice_date BETWEEN '$startDate' AND '$endDate'");
                    $builder->groupBy('id');
                    $query = $builder->get()->getRowArray();
                    $monthNewIncome[] = !$query ? 0 : number_format((float)$query['NewIncome'], 2, '.', '');
                } else {
                    $monthNewIncome[] = 0;
                }

            endforeach;

            $monthlyIncome[] = array_sum($monthNewIncome);
        }

        return $monthlyIncome;
    }

    public function getExpenses($loginUser, $MonthDate, $currencyData)
    {

        $subscriberID = $loginUser['subscriberID'];
        $companyIDs = $loginUser['companyIDs'];
        $IsSubscriber = $loginUser['IsSubscriber'];
        $action = $currencyData['action'];

        $monthlyIncome = [];
        foreach ($MonthDate as $my) {
            $startDate = $my['start_date'];
            $endDate = $my['end_date'];

            $builder = $this->builder('expenses');
            if ($action === 'subscriber') {
                $builder->select("IFNULL(SUM(subscriber_amount),0) AS total");
            } elseif ($action === 'default') {
                $builder->select("IFNULL(SUM(USD_amount),0) AS total");
            } else {
                $builder->select("IFNULL(SUM(amount),0) AS total");
            }
            $builder->where("date BETWEEN '$startDate' AND '$endDate'");
            $builder->where('subscriber_id', $subscriberID);
            (!$IsSubscriber)  && $builder->whereIn('company_id', $companyIDs);
            $builder->groupBy('subscriber_id');
            $query = $builder->get()->getRowArray();


            $monthlyIncome[] = !$query ? 0 : number_format((float)$query['total'], 2, '.', '');
        }


        return $monthlyIncome;
    }

    public function getOtherIncome($loginUser, $MonthDate, $currencyData)
    {
        $subscriberID = $loginUser['subscriberID'];
        $companyIDs = $loginUser['companyIDs'];
        $IsSubscriber = $loginUser['IsSubscriber'];
        $action = $currencyData['action'];

        $monthlyIncome = [];
        foreach ($MonthDate as $my) {
            $startDate = $my['start_date'];
            $endDate = $my['end_date'];

            $builder = $this->builder('incomes');
            if ($action === 'subscriber') {
                $builder->select("IFNULL(SUM(subscriber_amount),0) AS total");
            } elseif ($action === 'default') {
                $builder->select("IFNULL(SUM(USD_amount),0) AS total");
            } else {
                $builder->select("IFNULL(SUM(amount),0) AS total");
            }
            $builder->where("date BETWEEN '$startDate' AND '$endDate'");
            $builder->where('subscriber_id', $subscriberID);
            (!$IsSubscriber)  && $builder->whereIn('company_id', $companyIDs);
            $builder->groupBy('subscriber_id');
            $query = $builder->get()->getRowArray();


            $monthlyIncome[] = !$query ? 0 : number_format((float)$query['total'], 2, '.', '');
        }

        return $monthlyIncome;
    }


    /**
     * month wise Generated Invoice Amount 
     * -----------------------------------
     * 
     * This function only user for Subscriber Dashboard
     */
    public function DateWiseInvoiceAmount($loginUser, $dates)
    {
        $subscriberID = $loginUser['subscriber_id'];
        $companyID = $loginUser['company_id'];
        $startDate = $dates['start_date'];
        $endDate = $dates['end_date'];

        $builder = $this->builder();

        if ($companyID != '0') {
            $builder->select("SUM(CASE WHEN(invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.company_id = $companyID) THEN invoices.subtotal * invoices.currency_conversion_rate ELSE 0 END) AS company_currency_amount");
            $builder->select('currencies.short_code as short_code,currencies.locale as locale');
            $builder->join('companies', 'companies.id=invoices.company_id', 'LEFT');
            $builder->join('currencies', 'currencies.id=companies.currency_id', 'LEFT');
        } else {
            $builder->select("SUM(CASE WHEN(invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.subscriber_id = $subscriberID) THEN invoices.subtotal * invoices.subscriber_currency_conversion_rate ELSE 0 END) AS subscriber_currency_amount");
            $builder->select('currencies.short_code as short_code,currencies.locale as locale');
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


    public function yoyReportIncome($years = [], $clientIDS = [])
    {



        $builder = $this->builder('clients');
        $builder->whereIn('id', $clientIDS);
        $query = $builder->get();
        $clients = $query->getResultArray();


        $newData = [];

        foreach ($clients as $key => $client) {
            $newData[$key]['name'] = $client['company_name'];
            $incomes = [];
            foreach ($years as $keys => $year) {
                $companyID = $year['company_id'];
                $startDate = $year['start_date'];
                $endDate = $year['end_date'];
                $clientID = $client['id'];

                $INVBuilder = $this->builder();
                $INVBuilder->selectSum("CASE WHEN(invoice_date BETWEEN '$startDate' AND '$endDate' AND client_id = '$clientID') THEN USD_currency_total_amount ELSE 0 END", 'USD_currency_total_amount');
                $INVBuilder->selectSum("CASE WHEN(invoice_date BETWEEN '$startDate' AND '$endDate' AND client_id = '$clientID') THEN subscriber_currency_total_amount ELSE 0 END", 'subscriber_currency_total_amount');
                $INVBuilder->selectSum("CASE WHEN(invoice_date BETWEEN '$startDate' AND '$endDate' AND client_id = '$clientID') THEN company_currency_total_amount ELSE 0 END", 'company_currency_total_amount');
                $INVBuilder->where('company_id', $companyID);
                $INVBuilder->groupBy('company_id');
                $INVQuery = $INVBuilder->get();
                $INVResult = $INVQuery->getRowArray();

                $INVResult['type'] = '';
                if ($keys > 0) {
                    $getAmount = $incomes[$keys - 1];
                    if ($INVResult['company_currency_total_amount'] > $getAmount['company_currency_total_amount'])
                        $INVResult['type'] = 'up';

                    if ($INVResult['company_currency_total_amount'] < $getAmount['company_currency_total_amount'])
                        $INVResult['type'] = 'down';
                }

                $incomes[] = $INVResult;
            }
            $newData[$key]['income'] = $incomes;
        }


        return $newData;
    }

    public function incomeClientData($years = [], $clientIDS = [], $company_ID = 0, $subscriberCurrency = [])
    {
        $builder = $this->builder('clients');
        $builder->whereIn('id', $clientIDS);
        $query = $builder->get();
        $clients = $query->getResultArray();


        $newData = [];

        foreach ($clients as $key => $client) {
            $newData[$key]['name'] = $client['company_name'];
            $incomes = [];
            foreach ($years as $keys => $year) {
                $companyID = $year['company_id'];
                $startDate = $year['start_date'];
                $endDate = $year['end_date'];
                $clientID = $client['id'];

                $INVBuilder = $this->builder();
                $INVBuilder->selectSum("CASE WHEN(invoice_date BETWEEN '$startDate' AND '$endDate' AND client_id = '$clientID') THEN USD_currency_total_amount ELSE 0 END", 'USD_currency_total_amount');
                $INVBuilder->selectSum("CASE WHEN(invoice_date BETWEEN '$startDate' AND '$endDate' AND client_id = '$clientID') THEN subscriber_currency_total_amount ELSE 0 END", 'subscriber_currency_total_amount');
                $INVBuilder->selectSum("CASE WHEN(invoice_date BETWEEN '$startDate' AND '$endDate' AND client_id = '$clientID') THEN company_currency_total_amount ELSE 0 END", 'company_currency_total_amount');
                // $INVBuilder->where('company_id', $companyID);
                $INVBuilder->where('company_id', $company_ID);
                $INVBuilder->groupBy('company_id');
                $INVQuery = $INVBuilder->get();
                $INVResult = $INVQuery->getRowArray();

                // $INVResult['USD_currency_total_amount'] = format_amount($INVResult['USD_currency_total_amount'], 'USD', 'en_US');
                // $INVResult['subscriber_currency_total_amount'] = format_amount($INVResult['subscriber_currency_total_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                $incomes[] = $INVResult;
            }
            $newData[$key]['income'] = $incomes;
        }


        return $newData;
    }

    public function clientIncomeData($filters, $clients = [])
    {
        $startDate = $filters['start_date'];
        $endDate = $filters['end_date'];
        $company_ID = $filters['company_id'];
        $newData = [];

        foreach ($clients as $key => $client) {
            $newData[$key]['name'] = $client['company_name'];
            $clientID = $client['id'];
            $builder = $this->builder();
            $builder->selectSum("CASE WHEN(invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate' AND invoices.client_id = '$clientID') THEN invoice_payments.invoice_currency_amount * invoice_payments.USD_ccr ELSE 0 END", 'USD_currency_total_amount');
            $builder->selectSum("CASE WHEN(invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate' AND invoices.client_id = '$clientID') THEN invoice_payments.invoice_currency_amount * invoice_payments.subscriber_ccr ELSE 0 END", 'subscriber_currency_total_amount');
            $builder->selectSum("CASE WHEN(invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate' AND invoices.client_id = '$clientID') THEN invoice_payments.company_currency_amount ELSE 0 END", 'company_currency_total_amount');
            $builder->join('invoice_payments','invoice_payments.invoice_id=invoices.id');
            $builder->where('company_id', $company_ID);
            $builder->groupBy('company_id');
            $query = $builder->get();
            $result = $query->getRowArray();
            $newData[$key]['income'] = $result;
        }
        return $newData;
    }
}
