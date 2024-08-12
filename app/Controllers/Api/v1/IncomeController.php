<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Entities\Collection;
use App\Models\Company;
use App\Models\Income;
use App\Models\IncomeCategory;
use App\Models\Subscriber;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class IncomeController extends BaseController
{
    use ResponseTrait;
    protected $incomes;
    protected $incomeCategory;
    protected $company;
    protected $subscriber;


    public function __construct()
    {
        $this->incomes = new Income();
        $this->incomeCategory = new IncomeCategory();
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

        $data = $this->incomes->resources($request)->get()->getResultArray();
        foreach ($data as $key => $result) {
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
            $data[$key]['subcategories'] = model(IncomeCategory::class)->subCategoryByCategory($result['category_id']);
        }


        $response['incomeList'] = Collection::tableData(
            $data,
            $this->incomes->resources($request, false)->countAllResults()
        );

        $response['initData']['companyList'] = $this->company->getCompaniesByUser($loginUser);
        $response['initData']['categoryList'] = $this->incomeCategory->BySubscriberParentCategory($loginUser['subscriber_id']);
        $response['initData']['subcategories'] = [];

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function getSubCategory()
    {
        $request = $this->request->getGet();
        $categoryID = $request['category_id'];
        $subCategoryData = $this->incomeCategory->subCategoryByCategory($categoryID);
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

            foreach ($request['incomes'] as $key => $value) :
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
            $this->incomes->insertBatch($newData);

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
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_INCOMES]);
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
            $incomesData = $this->incomes->where('id', $request['id'])->get()->getRowArray();

            $SubscriberAmount = (int) $request['amount'] * $incomesData['subscriber_ccr'];
            $usdAmount = (int) $request['amount'] * $incomesData['USD_ccr'];
            $newData = [
                'company_id'        => $request['company_id'],
                'category_id'       => $request['category_id'],
                'subcategory_id'    => $request['subcategory_id'],
                'title'             => $request['title'],
                'date'              => $request['date'],
                'amount'            => $request['amount'],
                'subscriber_ccr'    => $incomesData['subscriber_ccr'],
                'subscriber_amount' => $SubscriberAmount,
                'USD_ccr'           => $incomesData['USD_ccr'],
                'USD_amount'        => $usdAmount,
                'updated_by'        => $loginUser['id'],
                'updated_at'        => Time::now()
            ];
            $this->incomes->update($request['id'], $newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_INCOMES]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $incomesData = $this->incomes->find($request['id']);

        if ($incomesData) {
            $incomesID = $request['id'];
            try {
                $this->db->transBegin();
                $this->incomes->delete($incomesID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_INCOMES]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => INCOMES_NOT_FOUND], '404');
    }
}
