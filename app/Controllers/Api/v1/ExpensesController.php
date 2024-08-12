<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\Company;
use App\Models\ExpenseCategory;
use App\Models\Expenses;
use App\Models\Subscriber;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class ExpensesController extends BaseController
{
    use ResponseTrait;
    protected $expenses;
    protected $expenseCategory;
    protected $company;
    protected $subscriber;

    public function __construct()
    {
        $this->expenses = new Expenses();
        $this->expenseCategory = new ExpenseCategory();
        $this->company = new Company();
        $this->subscriber = new Subscriber();
    }

    public function index()
    {
        $loginUser  = getTokenUser();
        $request    = $this->request->getGet();

        $request['subscriber_id'] = $loginUser['subscriber_id'];
        $request['user_id'] = $loginUser['id'];
        $request['user_type'] = $loginUser['user_type'];
        $response['expensesList'] = $this->expenses->getResources($request);
        $response['initData']['companyList'] = $this->company->getCompaniesByUser($loginUser);
        $response['initData']['categoryList'] = $this->expenseCategory->BySubscriberParentCategory($loginUser['subscriber_id']);
        $response['initData']['subcategories'] = [];

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function getSubCategory()
    {
        $request = $this->request->getGet();
        $categoryID = $request['category_id'];
        $subCategoryData = $this->expenseCategory->subCategoryByCategory($categoryID);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $subCategoryData]);
    }

    public function create()
    {
        $loginUser = getTokenUser();
        $request = $this->request->getPost();

        // $validationRules      = [
        //     'company_id'    => ['label' => 'company', 'rules' => 'required'],
        //     'title'         => ['label' => 'title', 'rules' => 'required'],
        //     'date'          => ['label' => 'date', 'rules' => 'required'],
        //     'amount'        => ['label' => 'amount', 'rules' => 'required']
        // ];

        // if (!$this->validate($validationRules)) :
        //     $message = GET_VALIDATION_MSG($this->validator->getErrors());
        //     return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        // endif;

        $this->db->transBegin();

        try {

            $newData = [];

            foreach ($request['expenses'] as $key => $value) :
                $CompanyCurrencyDetails = $this->company->getCurrency($value['company_id']);
                $companySortCode = strtolower($CompanyCurrencyDetails['short_code']);

                $SubscriberCurrencyDetails = $this->subscriber->getCurrency($loginUser['subscriber_id']);
                $SubscriberSortCode = strtolower($SubscriberCurrencyDetails['short_code']);

                $curl = service('curlrequest');
                $CurrencyRate = $curl->get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/$companySortCode.json");
                $body = (array) json_decode($CurrencyRate->getBody());
                $rates = (array) $body[$companySortCode];

                $SubscriberAmount = (int) $value['amount'] * $rates[$SubscriberSortCode];
                $usdAmount = (int) $value['amount'] * $rates['usd'];
                $newData[] = [
                    'subscriber_id' => $loginUser['subscriber_id'],
                    'company_id' => $value['company_id'],
                    'category_id' => $value['category_id'],
                    'subcategory_id' => $value['subcategory_id'],
                    'title' => $value['title'],
                    'date' => $value['date'],
                    'amount' => $value['amount'],
                    'subscriber_ccr' => $rates[$SubscriberSortCode],
                    'subscriber_amount' => $SubscriberAmount,
                    'USD_ccr' => $rates['usd'],
                    'USD_amount' => $usdAmount,
                    'created_by' => $loginUser['id'],
                    'created_at' => Time::now()
                ];
            endforeach;
            $this->expenses->insertBatch($newData);

            // $newData = [
            //     'subscriber_id' => $loginUser['subscriber_id'],
            //     'company_id' => $request['company_id'],
            //     'category_id' => $request['category_id'],
            //     'subcategory_id' => $request['subcategory_id'],
            //     'title' => $request['title'],
            //     'date' => $request['date'],
            //     'amount' => $request['amount'],
            //     'subscriber_ccr' => $rates[$SubscriberSortCode],
            //     'subscriber_amount' => $SubscriberAmount,
            //     'USD_ccr' => $rates['USD'],
            //     'USD_amount' => $usdAmount,
            //     'created_by' => $loginUser['id'],
            //     'created_at' => Time::now()
            // ];
            // $this->expenses->save($newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG  . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_EXPENSES]);
    }

    public function update()
    {
        $loginUser = getTokenUser();
        $request = $this->request->getPost();

        $validationRules      = [
            'company_id' => ['label' => 'company', 'rules' => 'required'],
            'title'    => ['label' => 'title', 'rules' => 'required'],
            'date'     => ['label' => 'date', 'rules' => 'required'],
            'amount'         => ['label' => 'amount', 'rules' => 'required']
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();

        try {
            $expensesData = $this->expenses->where('id', $request['id'])->get()->getRowArray();

            $SubscriberAmount = (int) $request['amount'] * $expensesData['subscriber_ccr'];
            $usdAmount = (int) $request['amount'] * $expensesData['USD_ccr'];
            $newData = [
                'company_id'        => $request['company_id'],
                'category_id'       => $request['category_id'],
                'subcategory_id'    => $request['subcategory_id'],
                'title'             => $request['title'],
                'date'              => $request['date'],
                'amount'            => $request['amount'],
                'subscriber_ccr'    => $expensesData['subscriber_ccr'],
                'subscriber_amount' => $SubscriberAmount,
                'USD_ccr'           => $expensesData['USD_ccr'],
                'USD_amount'        => $usdAmount,
                'updated_by'        => $loginUser['id'],
                'updated_at'        => Time::now()
            ];
            $this->expenses->update($request['id'], $newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_EXPENSES]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $expensesData = $this->expenses->getResources($request, true);

        if ($expensesData) {
            $expensesID = $request['id'];
            try {
                $this->db->transBegin();
                $this->expenses->delete($expensesID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_EXPENSES]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => EXPENSES_NOT_FOUND], '404');
    }
}
