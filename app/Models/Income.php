<?php

namespace App\Models;

use CodeIgniter\Model;

class Income extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'incomes';
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


    public function resources($filters = array(), $pagination = true)
    {
        $builder = $this->builder();
        $builder->select('incomes.id,incomes.date,incomes.title,incomes.amount');
        $builder->select('income_categories.name as category_name, income_categories.id as category_id');
        $builder->select('SC.name as subcategory_name, SC.id as subcategory_id');
        $builder->select('companies.id as company_id,companies.company_name');
        $builder->select('currencies.short_code as company_shortCode, currencies.locale as company_locale');

        $builder->join('income_categories', 'income_categories.id=incomes.category_id');
        $builder->join('income_categories AS SC', 'SC.id=incomes.subcategory_id', 'LEFT');
        $builder->join('companies', 'companies.id=incomes.company_id');
        $builder->join('currencies', 'currencies.id=companies.currency_id');

        if (isset($filters['subscriber_id']) && $filters['user_type'] === 'User') {
            $builder->join('company_users', 'company_users.company_id=incomes.company_id');
            $builder->where('company_users.user_id', $filters['user_id']);
        }

        isset($filters['subscriber_id']) && $filters['subscriber_id'] != '' && $builder->where('incomes.subscriber_id', $filters['subscriber_id']);
        isset($filters['id']) && $filters['id'] != '' && $builder->where('incomes.id', $filters['id']);
        isset($filters['company_id']) && $filters['company_id'] != '0' && $builder->where('incomes.company_id', $filters['company_id']);
        isset($filters['category_id']) && $filters['category_id'] != '0' && $builder->where('incomes.category_id', $filters['category_id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('incomes.title', $search);
            $builder->orLike('companies.company_name', $search);
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

    public function getDateWiseIncomes($loginUser, $monthData)
    {
        $subscriberID   = $loginUser['subscriber_id'];
        $companyID      = $loginUser['company_id'];
        $startDate      = $monthData['start_date'];
        $endDate        = $monthData['end_date'];

        $builder = $this->builder();

        if ($companyID != '0') {
            $builder->select("SUM(CASE WHEN(incomes.date BETWEEN '$startDate' AND '$endDate' AND incomes.company_id = $companyID) THEN incomes.amount ELSE 0 END) AS amount");
            $builder->select('currencies.short_code as short_code,currencies.locale as locale');
            $builder->join('companies', 'companies.id=incomes.company_id', 'LEFT');
            $builder->join('currencies', 'currencies.id=companies.currency_id', 'LEFT');
            $builder->where('incomes.company_id', $companyID);
        } else {
            $builder->select("SUM(CASE WHEN(incomes.date BETWEEN '$startDate' AND '$endDate' AND incomes.subscriber_id = $subscriberID) THEN incomes.subscriber_amount ELSE 0 END) AS subscriber_amount");
            $builder->select('currencies.short_code as short_code,currencies.locale as locale');
            $builder->join('subscribers', 'subscribers.id=incomes.subscriber_id', 'LEFT');
            $builder->join('currencies', 'currencies.id=subscribers.currency_id', 'LEFT');
            $builder->where('incomes.subscriber_id', $subscriberID);
        }


        $builder->groupBy('incomes.subscriber_id');

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

    public function DateWiseIncomesSum($userData, $companyData, $dates = [])
    {
        $companyID      = $companyData->company_id;
        $startDate      = !empty($dates) ? $dates['start_date'] : $companyData->start_date;
        $endDate        = !empty($dates) ? $dates['end_date'] : $companyData->end_date;
        $userID         = $userData['id'];
        $subscriberID   = $userData['subscriber_id'];
        $userType       = $userData['user_type'];

        $builder = $this->builder();
        if ($userType === 'Subscriber' && $companyID === '0') {
            $builder->selectSum("CASE WHEN(incomes.date BETWEEN '$startDate' AND '$endDate' AND (incomes.subscriber_id = $subscriberID)) THEN incomes.subscriber_amount ELSE 0 END", 'total');
        } else if ($userType === 'User' && $companyID === '0') {
            $companyIDS = model(CompanyUser::class)->where('user_id', $userID)->findColumn('company_id');
            $builder->selectSum("CASE WHEN(incomes.date BETWEEN '$startDate' AND '$endDate') THEN incomes.subscriber_amount ELSE 0 END", 'total');
            $builder->whereIn('incomes.company_id', $companyIDS);
        } else {
            $builder->selectSum("CASE WHEN(incomes.date BETWEEN '$startDate' AND '$endDate' AND (incomes.company_id = $companyID)) THEN incomes.amount ELSE 0 END", 'total');
        }

        $builder->groupBy('incomes.subscriber_id');
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

    public function ByCatSubCat_New($filters)
    {
        $startDate = $filters['start_date'];
        $endDate = $filters['end_date'];

        if ($filters['company_id'] !== '0') {
            $companyIDs = model(Company::class)->where('id', $filters['company_id'])->findAll();
        } else {
            $companyIDs = model(Company::class)->where('subscriber_id', $filters['subscriber_id'])->findAll();
        }

        $builder = $this->builder('income_categories')->where('subscriber_id', $filters['subscriber_id'])->where('parent_id', null)->get()->getResultArray();
        $newData = [];
        foreach ($builder as $value) :
            $subCat = [];
            $subCategory = $this->builder('income_categories')->where('parent_id', $value['id'])->get()->getResultArray();
            foreach ($subCategory as $sValue) :
                $companyData = [];
                foreach ($companyIDs as $cValue) :
                    $incomes = $this->builder()
                        ->select('incomes.*,companies.company_name as company_name')
                        ->join('companies', 'companies.id=incomes.company_id', 'LEFT')
                        ->where('incomes.company_id', $cValue['id'])->where('incomes.subcategory_id', $sValue['id'])->where("incomes.date BETWEEN '$startDate' AND '$endDate'")->get()->getResultArray();

                    if (sizeof($incomes) > 0) {
                        $companyData[] = [
                            'id' => $sValue['id'],
                            'name' => $cValue['company_name'],
                            'count' => count(array_column($incomes, 'id')),
                            'amount' => array_sum(array_column($incomes, 'amount')),
                            'subscriber_amount' => array_sum(array_column($incomes, 'subscriber_amount')),
                            'USD_amount' => array_sum(array_column($incomes, 'USD_amount')),
                            'incomes' => $incomes
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

    public function ByCompanyIdWithDates($filters)
    {
        $userID         = $filters['id'];
        $userType       = $filters['user_type'];
        $subscriberID   = $filters['subscriber_id'];
        $companyID      = $filters['company_id'];
        $startDate      = $filters['start_date'];
        $endDate        = $filters['end_date'];

        $builder = $this->builder();
        $builder->select('incomes.*');
        $builder->select('companies.company_name as company_name');
        $builder->select('income_categories.name as category_name');
        $builder->join('companies', 'companies.id=incomes.company_id', 'Left');
        $builder->join('income_categories', 'income_categories.id=incomes.category_id', 'Left');

        if ($companyID !== '0') {
            $builder->where('incomes.company_id', $companyID);
        } else if ($userType !== 'Subscriber') {
            $builder->join('company_users', "company_users.company_id=incomes.company_id", 'LEFT');
            $builder->where('company_users.user_id', $userID);
        }

        $builder->where('incomes.subscriber_id', $subscriberID);
        $builder->where("date BETWEEN '$startDate' AND '$endDate'");
        $query = $builder->get();
        $results = $query->getResultArray();

        return $results;
    }
}
