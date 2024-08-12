<?php

namespace App\Models;

use CodeIgniter\Model;

class Expenses extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'expenses';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['subscriber_id', 'company_id', 'category_id', 'subcategory_id', 'title', 'date', 'amount', 'subscriber_ccr', 'subscriber_amount', 'USD_ccr', 'USD_amount', 'created_by', 'updated_by', 'created_at', 'updated_at'];

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
        0 => 'title',
        1 => 'date',
        2 => 'category_name',
        3 => 'subcategory_name',
        4 => 'company_name',
        5 => 'amount',
    ];

    /**
     * This function use for listing expenses data
     * 
     * @param array $filters
     */
    public function getResources($filters = array(), $returnSingleRow = false)
    {
        $userSelection = getSelectedCompany();
        $startDate = $userSelection->start_date;
        $endDate = $userSelection->end_date;

        $builder = $this->builder();
        $builder->select('expenses.id,expenses.date,expenses.title,expenses.amount');
        $builder->select('expense_categories.name as category_name, expense_categories.id as category_id');
        $builder->select('SC.name as subcategory_name, SC.id as subcategory_id');
        $builder->select('companies.id as company_id,companies.company_name');
        $builder->select('currencies.short_code as company_shortCode, currencies.locale as company_locale');
        $builder->join('expense_categories', 'expense_categories.id=expenses.category_id');
        $builder->join('expense_categories AS SC', 'SC.id=expenses.subcategory_id', 'LEFT');
        $builder->join('companies', 'companies.id=expenses.company_id');
        $builder->join('currencies', 'currencies.id=companies.currency_id');

        if (isset($filters['subscriber_id']) && $filters['user_type'] === 'User') {
            $builder->join('company_users', 'company_users.company_id=expenses.company_id');
            $builder->where('company_users.user_id', $filters['user_id']);
        }

        isset($filters['subscriber_id']) && $filters['subscriber_id'] != '' && $builder->where('expenses.subscriber_id', $filters['subscriber_id']);
        isset($filters['id']) && $filters['id'] != '' && $builder->where('expenses.id', $filters['id']);
        isset($filters['company_id']) && $filters['company_id'] != '0' ? $builder->where('expenses.company_id', $filters['company_id']) : ($userSelection->company_id != "0" ? $builder->where('expenses.company_id', $userSelection->company_id) : '');
        isset($filters['category_id']) && $filters['category_id'] != '0' && $builder->where('expenses.category_id', $filters['category_id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);

            $builder->like('expenses.title', $search);
            // $builder->orLike('companies.company_name', $search);
        }

        if (isset($filters['from_date']) || isset($filters['to_date'])) {
            isset($filters['from_date']) && $builder->where('date >=', $filters['from_date']);
            isset($filters['to_date']) && $builder->where('date <=', $filters['to_date']);
        } else {
            $builder->where("date BETWEEN '$startDate' AND '$endDate'");
        }

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

            if (isset($filters['subscriber_id']) && $filters['user_type'] === 'User') {
                $builder->join('company_users', 'company_users.company_id=expenses.company_id');
                $builder->where('company_users.user_id', $filters['user_id']);
            }

            isset($filters['subscriber_id']) && $filters['subscriber_id'] != '' && $builder->where('expenses.subscriber_id', $filters['subscriber_id']);
            isset($filters['id']) && $filters['id'] != '' && $builder->where('expenses.id', $filters['id']);
            // isset($filters['company_id']) && $filters['company_id'] != '0' && $builder->where('expenses.company_id', $filters['company_id']);
            isset($filters['company_id']) && $filters['company_id'] != '0' ? $builder->where('expenses.company_id', $filters['company_id']) : ($userSelection->company_id != "0" ? $builder->where('expenses.company_id', $userSelection->company_id) : '');

            isset($filters['category_id']) && $filters['category_id'] != '0' && $builder->where('expenses.category_id', $filters['category_id']);

            if (isset($filters['search']) && $filters['search'] != '') {
                $search = $this->db->escapeString((string) $filters['search']);

                $builder->like('expenses.title', $search);
                // $builder->orLike('companies.company_name', $search);
            }


            if (isset($filters['from_date']) || isset($filters['to_date'])) {
                isset($filters['from_date']) && $builder->where('date >=', $filters['from_date']);
                isset($filters['to_date']) && $builder->where('date <=', $filters['to_date']);
            } else {
                $builder->where("date BETWEEN '$startDate' AND '$endDate'");
            }

            $results['totalCount'] = (int) $builder->countAllResults();
            $data = [];
            $resultData = $query->getResultArray();

            if (!empty($resultData)) {
                foreach ($resultData as $key => $result) {
                    $data[$key]['id'] = (int) $result['id'];
                    $data[$key]['title'] = $result['title'];
                    $data[$key]['category_id'] = $result['category_id'];
                    $data[$key]['category_name'] = $result['category_name'];
                    $data[$key]['subcategory_id'] = $result['subcategory_id'];
                    $data[$key]['subcategory_name'] = $result['subcategory_name'];
                    $data[$key]['company_id'] = $result['company_id'];
                    $data[$key]['company_name'] = $result['company_name'];
                    $data[$key]['date'] = $result['date'];
                    $data[$key]['amount'] = $result['amount'];
                    $data[$key]['formate_amount'] = format_amount($result['amount'], $result['company_shortCode'], $result['company_locale']);
                    $data[$key]['subcategories'] = model(ExpenseCategory::class)->subCategoryByCategory($result['category_id']);
                }
            }
            $results['data'] =  $data;
        }

        return $results;
    }

    public function ByCompanyIdWithDates($filters)
    {
        $userID         = $filters['id'];
        $userType       = $filters['user_type'];
        $subscriberID   = $filters['subscriber_id'];
        $companyID      = $filters['company_id'];
        $startDate      = $filters['start_date'];
        $endDate        = $filters['end_date'];

        $builder = $this->builder();
        $builder->select('expenses.*');
        $builder->select('companies.company_name as company_name');
        $builder->select('expense_categories.name as category_name');
        $builder->join('companies', 'companies.id=expenses.company_id', 'Left');
        $builder->join('expense_categories', 'expense_categories.id=expenses.category_id', 'Left');

        if ($companyID !== '0') {
            $builder->where('expenses.company_id', $companyID);
        } else if ($userType !== 'Subscriber') {
            $builder->join('company_users', "company_users.company_id=expenses.company_id", 'LEFT');
            $builder->where('company_users.user_id', $userID);
        }

        $builder->where('expenses.subscriber_id', $subscriberID);
        $builder->where("date BETWEEN '$startDate' AND '$endDate'");
        $query = $builder->get();
        $results = $query->getResultArray();

        return $results;
    }

    public function DateWiseExpenseSum($userData, $companyData, $dates = [])
    {
        $companyID      = $companyData->company_id;
        $startDate      = !empty($dates) ? $dates['start_date'] : $companyData->start_date;
        $endDate        = !empty($dates) ? $dates['end_date'] : $companyData->end_date;
        $userID         = $userData['id'];
        $subscriberID   = $userData['subscriber_id'];
        $userType       = $userData['user_type'];

        $builder = $this->builder();
        if ($userType === 'Subscriber' && $companyID === '0') {
            $builder->selectSum("CASE WHEN(expenses.date BETWEEN '$startDate' AND '$endDate' AND (expenses.subscriber_id = $subscriberID)) THEN expenses.subscriber_amount ELSE 0 END", 'total');
        } else if ($userType === 'User' && $companyID === '0') {
            $companyIDS = model(CompanyUser::class)->where('user_id', $userID)->findColumn('company_id');
            $builder->selectSum("CASE WHEN(expenses.date BETWEEN '$startDate' AND '$endDate') THEN expenses.subscriber_amount ELSE 0 END", 'total');
            $builder->whereIn('expenses.company_id', $companyIDS);
        } else {
            $builder->selectSum("CASE WHEN(expenses.date BETWEEN '$startDate' AND '$endDate' AND (expenses.company_id = $companyID)) THEN expenses.amount ELSE 0 END", 'total');
        }

        $builder->groupBy('expenses.subscriber_id');
        $query = $builder->get()->getRowArray();

        $currencyBuilder = $this->builder('currencies');
        $currencyBuilder->select('currencies.*');
        if (($userType === 'Subscriber' && $companyID === '0')) {
            $currencyBuilder->join('subscribers', 'subscribers.currency_id=currencies.id');
            $currencyBuilder->where('subscribers.id', $subscriberID);
        } else {
            $currencyBuilder->join('companies', 'companies.currency_id=currencies.id');
            $currencyBuilder->where('companies.id', $companyID);
        }
        $newQuery = $currencyBuilder->get()->getRowArray();

        $total = $query ? $query['total'] : 0;
        $result = format_amount($total, $newQuery['short_code'], $newQuery['locale']);
        return $result;
    }


    public function getDateWiseExpenses($loginUser, $monthData)
    {
        $subscriberID   = $loginUser['subscriber_id'];
        $companyID      = $loginUser['company_id'];
        $startDate      = $monthData['start_date'];
        $endDate        = $monthData['end_date'];

        $builder = $this->builder();



        if ($companyID != '0') {
            $builder->select("SUM(CASE WHEN(expenses.date BETWEEN '$startDate' AND '$endDate' AND expenses.company_id = $companyID) THEN expenses.amount ELSE 0 END) AS amount");
            $builder->select('currencies.short_code as short_code,currencies.locale as locale');
            $builder->join('companies', 'companies.id=expenses.company_id', 'LEFT');
            $builder->join('currencies', 'currencies.id=companies.currency_id', 'LEFT');
            $builder->where('expenses.company_id', $companyID);
        } else {
            $builder->select("SUM(CASE WHEN(expenses.date BETWEEN '$startDate' AND '$endDate' AND expenses.subscriber_id = $subscriberID) THEN expenses.subscriber_amount ELSE 0 END) AS subscriber_amount");
            $builder->select('currencies.short_code as short_code,currencies.locale as locale');
            $builder->join('subscribers', 'subscribers.id=expenses.subscriber_id', 'LEFT');
            $builder->join('currencies', 'currencies.id=subscribers.currency_id', 'LEFT');
            $builder->where('expenses.subscriber_id', $subscriberID);
        }


        $builder->groupBy('expenses.subscriber_id');

        $query = $builder->get()->getRowArray();

        if (!$query) {
            $data = $companyID != '0' ? model(Company::class)->find($companyID) : model(Subscriber::class)->find($subscriberID);
            $CurrencyQuery = model(Currency::class)->find($data['currency_id']);
            $amount = 0;
            $finalAmount = format_amount($amount, $CurrencyQuery['short_code'], $CurrencyQuery['locale']);
        } else {
            $amount = $companyID != '0' ? $query['amount'] : $query['subscriber_amount'];
            $finalAmount = format_amount($amount, $query['short_code'], $query['locale']);
        }
        return $finalAmount;
    }

    public function ByCatSubCat($filters)
    {

        $startDate = $filters['start_date'];
        $endDate = $filters['end_date'];

        $builder = $this->builder('expense_categories')->where('subscriber_id', $filters['subscriber_id'])->where('parent_id', null)->get()->getResultArray();
        $newData = [];
        $newData = [];
        foreach ($builder as $value) :
            $subCat = [];
            $subCategory = $this->builder('expense_categories')->where('parent_id', $value['id'])->get()->getResultArray();
            foreach ($subCategory as $sValue) :
                if ($filters['company_id'] !== '0') {
                    $expenses = $this->builder()
                        ->select('expenses.*,companies.company_name as company_name')
                        ->join('companies', 'companies.id=expenses.company_id', 'LEFT')
                        ->where('expenses.company_id', $filters['company_id'])->where('expenses.subcategory_id', $sValue['id'])->where("expenses.date BETWEEN '$startDate' AND '$endDate'")->get()->getResultArray();
                } else {
                    $expenses = $this->builder()
                        ->select('expenses.*,companies.company_name as company_name')
                        ->join('companies', 'companies.id=expenses.company_id', 'LEFT')
                        ->where('expenses.subscriber_id', $filters['subscriber_id'])->where('expenses.subcategory_id', $sValue['id'])->where("expenses.date BETWEEN '$startDate' AND '$endDate'")->get()->getResultArray();
                }
                if (count($expenses) > 0) {
                    $subCat[] = [
                        'id' => $sValue['id'],
                        'name' => $sValue['name'],
                        'count' => count(array_column($expenses, 'id')),
                        'amount' => array_sum(array_column($expenses, 'amount')),
                        'subscriber_amount' => array_sum(array_column($expenses, 'subscriber_amount')),
                        'USD_amount' => array_sum(array_column($expenses, 'USD_amount')),
                        'expenses' => $expenses
                    ];
                }
            endforeach;

            if (count($subCat) > 0) {

                $newData[] = [
                    'id' => $value['id'],
                    'name' => $value['name'],
                    'count' => array_sum(array_column($subCat, 'count')),
                    'amount' => array_sum(array_column($subCat, 'amount')),
                    'subscriber_amount' => array_sum(array_column($subCat, 'subscriber_amount')),
                    'USD_amount' => array_sum(array_column($subCat, 'USD_amount')),
                    'sub_categories' => $subCat
                ];
            }
        endforeach;

        return $newData;
    }


    public function ByCatSubCat_New($filters)
    {
        $startDate = $filters['start_date'];
        $endDate = $filters['end_date'];

        if ($filters['company_id'] !== '0') {
            $companyIDs = model(Company::class)->where('id', $filters['company_id'])->findAll();
        } else {
            $companyIDs = model(Company::class)->where('subscriber_id', $filters['subscriber_id'])->findAll();
        }

        $builder = $this->builder('expense_categories')->where('subscriber_id', $filters['subscriber_id'])->where('parent_id', null)->get()->getResultArray();
        $newData = [];
        foreach ($builder as $value) :
            $subCat = [];
            $subCategory = $this->builder('expense_categories')->where('parent_id', $value['id'])->get()->getResultArray();
            foreach ($subCategory as $sValue) :
                $companyData = [];
                foreach ($companyIDs as $cValue) :
                    $expenses = $this->builder()
                        ->select('expenses.*,companies.company_name as company_name')
                        ->join('companies', 'companies.id=expenses.company_id', 'LEFT')
                        ->where('expenses.company_id', $cValue['id'])->where('expenses.subcategory_id', $sValue['id'])->where("expenses.date BETWEEN '$startDate' AND '$endDate'")->get()->getResultArray();

                    if (sizeof($expenses) > 0) {
                        $companyData[] = [
                            'id' => $sValue['id'],
                            'name' => $cValue['company_name'],
                            'count' => count(array_column($expenses, 'id')),
                            'amount' => array_sum(array_column($expenses, 'amount')),
                            'subscriber_amount' => array_sum(array_column($expenses, 'subscriber_amount')),
                            'USD_amount' => array_sum(array_column($expenses, 'USD_amount')),
                            'expenses' => $expenses
                        ];
                    }
                endforeach;

                if (sizeof($companyData) > 0) {
                    $subCat[] = [
                        'id' => $sValue['id'],
                        'name' => $sValue['name'],
                        'count' => array_sum(array_column($companyData, 'count')),
                        'amount' => array_sum(array_column($companyData, 'amount')),
                        'subscriber_amount' => array_sum(array_column($companyData, 'subscriber_amount')),
                        'USD_amount' => array_sum(array_column($companyData, 'USD_amount')),
                        'company' => $companyData
                    ];
                }


            endforeach;

            if (sizeof($subCat) > 0) {
                $newData[] = [
                    'id' => $value['id'],
                    'name' => $value['name'],
                    'count' => array_sum(array_column($subCat, 'count')),
                    'amount' => array_sum(array_column($subCat, 'amount')),
                    'subscriber_amount' => array_sum(array_column($subCat, 'subscriber_amount')),
                    'USD_amount' => array_sum(array_column($subCat, 'USD_amount')),
                    'sub_categories' => $subCat
                ];
            }
        endforeach;

        return $newData;
    }

    public function yoyReportExpenses($years = [], $categoryIDS = [])
    {
        $getCategory = model(ExpenseCategory::class)->whereIn('id', $categoryIDS)->findAll();

        $newData = [];

        foreach ($getCategory as $key => $category) :
            $newData[$key]['name'] = $category['name'];
            $expenses = [];
            $categoryID = $category['id'];
            foreach ($years as $keys => $year) :
                $companyID = $year['company_id'];
                $startDate = $year['start_date'];
                $endDate = $year['end_date'];

                $builder = $this->builder();
                $builder->selectSum("CASE WHEN(date BETWEEN '$startDate' AND '$endDate' AND category_id = '$categoryID') THEN USD_amount ELSE 0 END", 'USD_currency_total_amount');
                $builder->selectSum("CASE WHEN(date BETWEEN '$startDate' AND '$endDate' AND category_id = '$categoryID') THEN subscriber_amount  ELSE 0 END", 'subscriber_currency_total_amount');
                $builder->selectSum("CASE WHEN(date BETWEEN '$startDate' AND '$endDate' AND category_id = '$categoryID') THEN amount ELSE 0 END", 'company_currency_total_amount');
                $builder->where('company_id', $companyID);

                $builder->groupBy('company_id');
                $query = $builder->get();
                $result = $query->getRowArray();

                $result['type'] = '';
                if ($keys > 0) {
                    $getAmount = $expenses[$keys - 1];
                    if ($result['company_currency_total_amount'] > $getAmount['company_currency_total_amount'])
                        $result['type'] = 'up';

                    if ($result['company_currency_total_amount'] < $getAmount['company_currency_total_amount'])
                        $result['type'] = 'down';
                }
                $expenses[] = $result;
            endforeach;
            $newData[$key]['expenses'] = $expenses;
        endforeach;

        return $newData;
    }
}
