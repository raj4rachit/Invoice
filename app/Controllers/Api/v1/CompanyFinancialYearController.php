<?php

namespace App\Controllers\Api\v1;

use App\Controllers\BaseController;
use App\Models\Company;
use App\Models\CompanyFinancialYear;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;

class CompanyFinancialYearController extends BaseController
{
    use ResponseTrait;

    protected $companyFinancialYear;
    protected $company;

    public function __construct()
    {
        $this->companyFinancialYear = new CompanyFinancialYear();
        $this->company = new Company();
    }
    public function index()
    {
        $userData = getTokenUser();
        $request    = $this->request->getGet();
        $response   = $this->companyFinancialYear->getResource($request);
        $response['companies'] = $this->company->select('id,company_name')->where('subscriber_id',$userData['subscriber_id'])->get()->getResultArray();

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }
    public function create()
    {
        $request = $this->request->getPost();
        $userData = getTokenUser();
        $validationRules      = [
            'company_id'            => ['label' => 'company', 'rules' => 'required|numeric'],
            'financial_year_name'   => ['label' => 'company financial year', 'rules' => 'required|is_uniques[company_financial_years.financial_year_name,[company_id.{company_id}]]'],
            'start_date'            => ['label' => 'start date', 'rules' => 'required|valid_date[Y-m-d]|is_uniques[company_financial_years.start_date,[company_id.{company_id}]]'],
            'end_date'              => ['label' => 'end date', 'rules' => 'required|valid_date[Y-m-d]|is_uniques[company_financial_years.end_date,[company_id.{company_id}]]'],
            'is_default'            => ['label' => 'is default', 'rules' => 'required|in_list[Yes,No]'],
        ];
        $validationMessages = [
            'financial_year_name' => [
                'is_uniques' => 'The company financial year name field must contain a unique value.'
            ],
            'start_date' => [
                'is_uniques' => 'The start date field must contain a unique value.'
            ],
            'end_date' => [
                'is_uniques' => 'The end date field must contain a unique value.'
            ]
        ];
        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;
        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id'         => $userData['subscriber_id'],
                'company_id'            => $request['company_id'],
                'financial_year_name'   => $request['financial_year_name'],
                'start_date'            => $request['start_date'],
                'end_date'              => $request['end_date'],
                'is_default'            => $request['is_default'],
                'created_by'            => $userData['id'],
                'created_at'            => Time::now()
            ];
            if ($request['is_default'] === "Yes") {
                $data = [['is_default' => 'No', 'company_id' => $request['company_id']]];
                $this->companyFinancialYear->updateBatch($data, 'company_id');
            }
            $this->companyFinancialYear->save($newData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_COMPANY_FINANCIAL_YEAR]);
    }
    public function update()
    {
        $request = $this->request->getPost();
        $userData = getTokenUser();
        $validationRules      = [
            'company_id'            => ['label' => 'status', 'rules' => 'required|numeric'],
            'financial_year_name'   => ['label' => 'company financial year', 'rules' => 'required|is_uniques[company_financial_years.financial_year_name,[company_id.{company_id},id.{id}]]'],
            'start_date'            => ['label' => 'start date', 'rules' => 'required|valid_date[Y-m-d]|is_uniques[company_financial_years.start_date,[company_id.{company_id},id.{id}]]'],
            'end_date'              => ['label' => 'end date', 'rules' => 'required|valid_date[Y-m-d]|is_uniques[company_financial_years.end_date,[company_id.{company_id},id.{id}]]'],
            'is_default'            => ['label' => 'is default', 'rules' => 'required|in_list[Yes,No]'],
        ];
        $validationMessages = [
            'financial_year_name' => [
                'is_uniques' => 'The company financial year name field must contain a unique value.'
            ],
            'start_date' => [
                'is_uniques' => 'The start date field must contain a unique value.'
            ],
            'end_date' => [
                'is_uniques' => 'The end date field must contain a unique value.'
            ]
        ];
        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;
        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id'         => $userData['subscriber_id'],
                'company_id'            => $request['company_id'],
                'financial_year_name'   => $request['financial_year_name'],
                'start_date'            => $request['start_date'],
                'end_date'              => $request['end_date'],
                'is_default'            => $request['is_default'],
                'updated_by'            => $userData['id'],
                'updated_at'            => Time::now()
            ];
            if ($request['is_default'] === "Yes") {
                $data = [['is_default' => 'No', 'company_id' => $request['company_id']]];
                $this->companyFinancialYear->updateBatch($data, 'company_id');
            }
            $this->companyFinancialYear->update($request['id'], $newData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_COMPANY_FINANCIAL_YEAR]);
    }
    public function delete()
    {
        $request = $this->request->getPost();
        $companyFinancialYear = $this->companyFinancialYear->getResource($request, false, true);
        if ($companyFinancialYear && $request['id'] !== '') {
            $companyFinancialYearID = $companyFinancialYear['id'];
            try {
                $this->db->transBegin();
                $this->companyFinancialYear->delete($companyFinancialYearID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_COMPANY_FINANCIAL_YEAR]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => COMPANY_FINANCIAL_YEAR_NOT_FOUND], '404');
    }
}
