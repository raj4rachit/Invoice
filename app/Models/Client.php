<?php

namespace App\Models;

use CodeIgniter\Model;

class Client extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'clients';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['subscriber_id', 'client_name', 'company_name', 'enroll_date', 'tax_no', 'gst_vat_no', 'email', 'phone', 'is_bifurcated', 'address_1', 'address_2', 'city', 'state', 'zip_code', 'country_id', 'status',  'source_by', 'source_from', 'client_group_id', 'created_by', 'updated_by', 'created_at', 'updated_at'];

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
        0 => 'client_name',
        1 => 'enroll_date',
        2 => 'email',
        3 => 'phone',
        4 => 'group_name',
        5 => 'source_by', // Source by name
        6 => 'source_from', // Source from name
        7 => 'countries.country_name',
        8 => 'status',
    ];

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $contributeBy = new ClientContributedUser();
        $userData = getTokenUser();
        $builder = $this->builder();
        $builder->select('clients.*,countries.country_name, group.group_name as group_name, CONCAT(sourceBy.first_name," ", sourceBy.last_name) as source_by_name, sourceFrom.platform_name as source_from_name,  CONCAT(createdBy.first_name," ", createdBy.last_name) as created_by, CONCAT(updatedBy.first_name," ", updatedBy.last_name) as updated_by');

        $builder->join('client_groups as group', 'group.id = clients.client_group_id', 'LEFT');
        $builder->join('contributors as sourceBy', 'sourceBy.id = clients.source_by', 'LEFT');
        $builder->join('source_platforms as sourceFrom', 'sourceFrom.id = clients.source_from', 'LEFT');
        $builder->join('users as createdBy', 'createdBy.id = clients.created_by', 'LEFT');
        $builder->join('users as updatedBy', 'updatedBy.id = clients.updated_by', 'LEFT');
        $builder->join('countries', 'countries.id = clients.country_id', 'LEFT');

        (isset($filters['id']) && $filters['id'] != '') ? $builder->where('clients.id', $filters['id'])
            : $builder->where('clients.subscriber_id', $userData['subscriber_id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('clients.client_name', $search);
            $builder->orLike('clients.company_name', $search);
            $builder->orLike('clients.email', $search);
        }

        //Filter start
        (isset($filters['group_id']) && $filters['group_id'] != '0') && $builder->where('clients.client_group_id', $filters['group_id']);

        (isset($filters['source_by']) && $filters['source_by'] != '0') && $builder->where('clients.source_by', $filters['source_by']);

        (isset($filters['source_from']) && $filters['source_from'] != '0') && $builder->where('clients.source_from', $filters['source_from']);

        if ((isset($filters['from_date']) && $filters['from_date'] != '') && (isset($filters['to_date']) && $filters['to_date'] != '')) {
            $fromDate = $filters['from_date'];
            $toDate = $filters['to_date'];
            $builder->where("clients.enroll_date BETWEEN '$fromDate' AND '$toDate'");
        }
        // Filter end
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
            $builder->where('clients.subscriber_id', $userData['subscriber_id']);
            $results['totalCount'] = (int) $builder->countAllResults();
            $results['data'] = [];

            if ($returnAssoc) {
                foreach ($query->getResultArray() as $userDetails) {
                    $results['data'][$userDetails['id']] = $userDetails;
                }
            } else {
                foreach ($query->getResultArray() as $key => $userDetails) {
                    $getContributeBy = $contributeBy->where('client_id', $userDetails['id'])->findColumn('contributor_id');
                    $getCompany = model(CompanyClient::class)->where('client_id', $userDetails['id'])->findColumn('company_id');
                    $results['data'][$key] =  $userDetails;
                    $results['data'][$key]['contribute_by'] =  $getContributeBy ?? [];
                    $results['data'][$key]['client_companies'] =  $getCompany ?? [];
                }
            }
        }

        return $results;
    }

    /**
     * *****************************************
     * Get Subscriber Client List
     * *****************************************
     * @param string $status "Active | Inactive"
     * 
     * @return array
     */
    public function subscriberClientList($status = '')
    {
        $userData = getTokenUser();
        $builder = $this->builder();
        $builder->where('subscriber_id', $userData['subscriber_id']);
        $status && $builder->where('status', $status);
        $query = $builder->get();
        $result = $query->getResultArray();
        return $result;
    }

    /**
     * *************************************
     * Get User's Company Client List
     * *************************************
     * 
     * @param string $requestData
     * 
     * @return array
     * 
     */
    public function getUserClients(string $requestData = '', array $companyIDS = [])
    {
        $userData = getTokenUser();
        $userType = $userData['user_type'];

        $builder = $this->builder();
        if ($requestData) {
            $builder->select($requestData);
        }

        if (empty($companyIDS)) {
            if ($userType === 'Subscriber') {
                $builder->where('subscriber_id', $userData['subscriber_id']);
            } else {
                $companyUser = new CompanyUser();
                $clientIDS = $companyUser->select('company_clients.client_id as client_id')
                    ->join('company_clients', 'company_clients.company_id = company_users.company_id')
                    ->where('company_users.user_id', $userData['id'])
                    ->groupBy('client_id')
                    ->findColumn('client_id');
                $clientIDS = $clientIDS ?? [0];
                $builder->whereIn('id', $clientIDS);
            }
        } else {
            $companyClient = new CompanyClient();
            $clientIDS = $companyClient->whereIn('company_id', $companyIDS)->groupBy('client_id')->findColumn('client_id');
            $clientIDS = $clientIDS ?? [0];
            $builder->whereIn('id', $clientIDS);
        }

        $builder->where('status', 'Active');
        $builder->orderBy('client_name');
        $query = $builder->get();
        $result = $query->getResultArray();

        return $result;
    }


    /**
     * ******************************************************
     * Get User's Company Client List By Current Year Invoice
     * ******************************************************
     */
    public function getUserClientsByInvoiceYear(string $requestData = '', array $companyIDS = [])
    {
        $userData = getTokenUser();
        $userType = $userData['user_type'];

        $company = getSelectedCompany();
        $startDate = $company->start_date;
        $endDate = $company->end_date;
        // Get clients with invoices within the date range
        $invoice = new Invoice();
        $clientsWithInvoices = $invoice->select('client_id')
            ->where('invoice_date >=', $startDate)
            ->where('invoice_date <=', $endDate)
            ->groupBy('client_id')
            ->findColumn('client_id');

        // Query for clients with invoices within the date range
        $builder1 = $this->builder();
        if ($requestData) {
            $builder1->select($requestData);
        }
        if (empty($companyIDS)) {
            if ($userType === 'Subscriber') {
                $builder1->where('subscriber_id', $userData['subscriber_id']);
            } else {
                $companyUser = new CompanyUser();
                $clientIDS = $companyUser->select('company_clients.client_id as client_id')
                    ->join('company_clients', 'company_clients.company_id = company_users.company_id')
                    ->where('company_users.user_id', $userData['id'])
                    ->groupBy('client_id')
                    ->findColumn('client_id');
                $clientIDS = $clientIDS ?? [0];
                $builder1->whereIn('id', $clientIDS);
            }
        } else {
            $companyClient = new CompanyClient();
            $clientIDS = $companyClient->whereIn('company_id', $companyIDS)->groupBy('client_id')->findColumn('client_id');
            $clientIDS = $clientIDS ?? [0];
            $builder1->whereIn('id', $clientIDS);
        }
        $builder1->whereIn('id', $clientsWithInvoices);
        $builder1->where('status', 'Active');
        $builder1->orderBy('client_name');
        $result1 = $builder1->get()->getResultArray();

        // Query for clients without invoices within the date range
        $builder2 = $this->builder();
        if ($requestData) {
            $builder2->select($requestData);
        }
        if ($userType === 'Subscriber') {
            $builder2->where('subscriber_id', $userData['subscriber_id']);
        }
        if (!empty($companyIDS)) {
            $builder2->whereIn('id', $clientIDS);
        }
        if (!empty($clientsWithInvoices)) {
            $builder2->whereNotIn('id', $clientsWithInvoices);
        }
        $builder2->where('status', 'Active');
        $builder2->orderBy('client_name');
        $result2 = $builder2->get()->getResultArray();

        // Combine results with separator
        $data = [];
        if (!empty($result1)) {
            $data = array_merge($data, $result1);
        }
        if (!empty($result2)) {
            $data[] = [
                "id" => "-",
                "client_name" => "------------------",
                "company_name" => "------------------",
                "is_bifurcated" => "No"
            ];
            $data = array_merge($data, $result2);
        }

        return $data;
    }

    public function getUserBifurcatedClients(string $requestData = '', array $companyIDS = [])
    {
        $userData = getTokenUser();
        $userType = $userData['user_type'];

        $builder = $this->builder();
        if ($requestData) {
            $builder->select($requestData);
        }

        if (empty($companyIDS)) {
            if ($userType === 'Subscriber') {
                $builder->where('subscriber_id', $userData['subscriber_id']);
            } else {
                $companyUser = new CompanyUser();
                $clientIDS = $companyUser->select('company_clients.client_id as client_id')
                    ->join('company_clients', 'company_clients.company_id = company_users.company_id')
                    ->where('company_users.user_id', $userData['id'])
                    ->groupBy('client_id')
                    ->findColumn('client_id');
                $clientIDS = $clientIDS ?? [0];
                $builder->whereIn('id', $clientIDS);
            }
        } else {
            $companyClient = new CompanyClient();
            $clientIDS = $companyClient->whereIn('company_id', $companyIDS)->groupBy('client_id')->findColumn('client_id');
            $clientIDS = $clientIDS ?? [0];
            $builder->whereIn('id', $clientIDS);
        }

        $builder->where('is_bifurcated', 'Yes');
        $builder->where('status', 'Active');
        $builder->orderBy('client_name');
        $query = $builder->get();
        $result = $query->getResultArray();

        return $result;
    }

    const LIFETIME_ORDER = [
        0 => 'client_name',
        1 => 'enroll_date',
        2 => 'LifeTime',
        3 => 'ThisYear',
        4 => 'LastYear',
        5 => 'ThisMonth',
        6 => 'LastMonth',
    ];

    public function newClientData($filters)
    {
        $userData = getTokenUser();
        $selectedCompany = getSelectedCompany();
        $startDate = date('Y-m-d', strtotime($selectedCompany->start_date));
        $endDate = date('Y-m-d', strtotime($selectedCompany->end_date));
        // $lastStartDate = date('Y-m-d', strtotime($selectedCompany->start_date . ' -1 year'));
        // $lastEndDate = date('Y-m-d', strtotime($selectedCompany->end_date . ' -1 year'));

        // $builder->select("SUM(CASE WHEN (invoices.invoice_date BETWEEN '$lastStartDate' AND '$lastEndDate' ) THEN invoice_items.subtotal ELSE 0 END) AS LastYear");
        $builder = $this->db->table('invoices');
        $builder->select("SUM(invoices.subscriber_currency_conversion_rate * invoice_items.subtotal) AS LifeTime");
        $builder->select("SUM(CASE WHEN (invoices.invoice_date BETWEEN '$startDate' AND '$endDate' ) THEN invoices.subscriber_currency_conversion_rate * invoice_items.subtotal ELSE 0 END) AS ThisYear");
        $builder->select("SUM(CASE WHEN (invoices.invoice_date BETWEEN DATE_SUB('$startDate', INTERVAL 1 YEAR) AND DATE_SUB('$endDate', INTERVAL 1 YEAR)) THEN invoices.subscriber_currency_conversion_rate * invoice_items.subtotal ELSE 0 END) AS LastYear");
        $builder->select("SUM(CASE WHEN (
                    MONTH(invoices.invoice_date) = MONTH(CURDATE()) AND (YEAR(invoices.invoice_date) = YEAR(CURDATE()))
                    ) THEN invoices.subscriber_currency_conversion_rate * invoice_items.subtotal 
                    ELSE 0 END) AS ThisMonth");

        $builder->select("SUM(CASE WHEN (
                    MONTH(invoices.invoice_date) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND
                    (YEAR(invoices.invoice_date) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH)))
                    ) THEN invoices.subscriber_currency_conversion_rate * invoice_items.subtotal 
                    ELSE 0 END) AS LastMonth");

        $builder->select("clients.client_name, clients.company_name, clients.enroll_date");
        $builder->join('invoice_items', 'invoice_items.invoice_id = invoices.id', 'LEFT');
        $builder->join('clients', 'clients.id = invoice_items.client_id', 'LEFT');

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('clients.client_name', $search);
            $builder->orLike('clients.company_name', $search);
        }
        if ((isset($filters['displayLength']) && isset($filters['displayStart']))  && $filters['displayLength'] != '' && $filters['displayStart'] != '' && $filters['displayLength'] != '-1') {
            $builder->limit($filters['displayLength'], $filters['displayStart']);
        }
        $builder->groupBy('invoice_items.client_id');
        if (isset($filters['orderDir']) &&  isset($filters['orderColumn'])) {
            $order  = self::LIFETIME_ORDER[$filters['orderColumn']];
            $dir    = $filters['orderDir'];
            $builder->orderBy($order, $dir);
        }
        $query = $builder->get();
        $clientData = $query->getResultArray();

        $data['totalCount'] = (int) $builder->countAllResults();
        $data['data'] = [];

        $subscriberCurrency = model(Subscriber::class)->getCurrency($userData['subscriber_id']);

        if (!empty($clientData)) {
            foreach ($clientData as $key => $client) {
                $data['data'][$key]['lifeTime'] = format_amount($client['LifeTime'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                $data['data'][$key]['thisYear'] = format_amount($client['ThisYear'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                $data['data'][$key]['lastYear'] = format_amount($client['LastYear'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                $data['data'][$key]['thisMonth'] = format_amount($client['ThisMonth'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                $data['data'][$key]['lastMonth'] = format_amount($client['LastMonth'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                $data['data'][$key]['client_name'] = $client['client_name'];
                $data['data'][$key]['client_company_name'] = $client['company_name'];
                $data['data'][$key]['enrollment_date'] = $client['enroll_date'];
            }
        }

        return $data;
    }


    /**
     * Get Month list on start and end date
     * --------------------------------------------
     * this function return month id and month name
     * 
     * @return array
     */
    public function GetMonthList()
    {
        $userSelection = getSelectedCompany();
        $time   = strtotime($userSelection->start_date);
        $last   = date('M-Y', strtotime($userSelection->end_date));

        $monthList = [];
        do {
            $month = date('M-Y', $time);
            $monthYear[] = date('Y-m', $time);
            $monthList[] = ['id' => date('mY', $time), 'name' =>  date('M Y', $time)];
            $time = strtotime('+1 month', $time);
        } while ($month != $last);

        return $monthList;
    }

    /**
     * Get Client List Contribute by Employee
     * --------------------------------------
     * This function use for contribution
     * 
     * @param string $employeeID
     * @return mixed
     */
    public function ByContributeEmployee($employeeID)
    {
        $userData = getTokenUser();
        $selectedCompany = getSelectedCompany();
        $companyID = $selectedCompany->company_id;
        $userType = $userData['user_type'];

        $builder = $this->builder();
        $builder->select('id,client_name,company_name');

        if ($companyID === '0' && $userType === 'Subscriber') {
            $builder->where('subscriber_id', $userData['subscriber_id']);
        }

        if ($companyID !== '0') {
            $CompanyClientIDS = model(CompanyClient::class)->where('company_id', $companyID)->findColumn('client_id');
            $builder->whereIn('id', $CompanyClientIDS);
        }
        $clientIDS = model(ClientContributedUser::class)->where('user_id', $employeeID)->findColumn('client_id');
        $builder->whereIn('id', $clientIDS);
        $query = $builder->get()->getResultArray();

        return $query;
    }

    public function ByID($ID)
    {
        $builder = $this->builder();
        $builder->select('clients.*');
        $builder->select('countries.country_name');
        $builder->join('countries', 'countries.id=clients.country_id', 'Left');
        $builder->where('clients.id', $ID);
        $query = $builder->get()->getRowArray();
        return $query;
    }

    public function getClientByLoginUser()
    {
        $loginUser = getTokenUser();
        $builder = $this->builder();
        if ($loginUser['user_type'] === 'User') {
            $this->builder->join('client_contributed_user', 'client_contributed_user.user_id=clients.id', 'Left');
            $builder->where('client_contributed_user.user_id', $loginUser['id']);
        }
        $builder->where('clients.subscriber_id', $loginUser['subscriber_id']);

        $query = $builder->get()->getResultArray();
        return $query;
    }

    public function clientReportData($filters, $subscriberCurrency)
    {

        $startDate = $filters['start_date'];
        $endDate = $filters['end_date'];

        $builder = $this->builder();
        $builder->select('id,client_name, company_name as client_company_name');
        $builder->where('subscriber_id', $filters['subscriber_id']);
        $filters['client_id'] !== '0' && $builder->where('id', $filters['client_id']);
        $query = $builder->get();
        $result = $query->getResultArray();

        $data = $result;
        $ClientTotalSubscriberCurrency = 0;
        $ClientTotalUSDCurrency = 0;
        # Client Loop
        foreach ($result as $key => $client) :

            $clientSubscriberAmount = 0;
            $clientUSDAmount = 0;

            $compBuilder = $this->builder('company_clients');
            $compBuilder->select('companies.id as company_id, companies.company_name');
            $compBuilder->join('companies', 'companies.id=company_clients.company_id', 'LEFT');
            $compBuilder->where('company_clients.client_id', $client['id']);
            $compBuilder->orderBy('companies.company_name');
            $compQuery = $compBuilder->get();
            $clientCompanies = $compQuery->getResultArray();

            $data[$key]['companies'] = $clientCompanies;

            # Company Loop

            foreach ($clientCompanies as $CKey => $company) :
                $companySubscriberAmount = 0;
                $companyUSDAmount = 0;


                $invBuilder = $this->builder('invoices');
                $invBuilder->select('id , invoice_no , invoice_date , subscriber_currency_total_amount , USD_currency_total_amount');
                $invBuilder->where('company_id', $company['company_id']);
                $invBuilder->where('client_id', $client['id']);
                $invBuilder->where("invoice_date BETWEEN '$startDate' AND '$endDate'");
                $invQuery = $invBuilder->get();
                $invResult = $invQuery->getResultArray();
                foreach ($invResult as $IKey => $val) {
                    $companySubscriberAmount += $val['subscriber_currency_total_amount'];
                    $companyUSDAmount += $val['USD_currency_total_amount'];

                    $ClientTotalSubscriberCurrency += $val['subscriber_currency_total_amount'];
                    $ClientTotalUSDCurrency += $val['USD_currency_total_amount'];

                    $invResult[$IKey]['subscriber_currency_total_amount'] = format_amount($val['subscriber_currency_total_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                    $invResult[$IKey]['USD_currency_total_amount'] = format_amount($val['USD_currency_total_amount'], 'USD', 'en_US');
                }

                $clientSubscriberAmount += $companySubscriberAmount;
                $clientUSDAmount += $companyUSDAmount;

                $data[$key]['companies'][$CKey]['count'] = count($invResult);
                $data[$key]['companies'][$CKey]['subscriber_amount'] = format_amount($companySubscriberAmount, $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                $data[$key]['companies'][$CKey]['usd_amount'] = format_amount($companyUSDAmount, 'USD', 'en_US');

                $data[$key]['companies'][$CKey]['invoices'] = $invResult;
            endforeach;

            $data[$key]['count'] = array_sum(array_column($data[$key]['companies'], 'count'));
            $data[$key]['subscriber_amount'] = format_amount($clientSubscriberAmount, $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
            $data[$key]['usd_amount'] = format_amount($clientUSDAmount, 'USD', 'en_US');

        endforeach;

        return [
            'data' => $data,
            'total_subscriber_currency' => format_amount($ClientTotalSubscriberCurrency, $subscriberCurrency['short_code'], $subscriberCurrency['locale']),
            'total_usd_currency' => format_amount($ClientTotalUSDCurrency, 'USD', 'en_US'),
        ];
    }

    public function ClientBySubscriber($subscriberId): array
    {
        $builder = $this->builder();
        $builder->select('id , client_name , company_name');
        $builder->where('subscriber_id', $subscriberId);
        $builder->orderBy('company_name');
        return $builder->get()->getResultArray();
    }
}
