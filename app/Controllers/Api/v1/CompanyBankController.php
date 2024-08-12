<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\BankField;
use App\Models\Company;
use App\Models\CompanyBank;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use CodeIgniter\Model;
use PHPUnit\Util\Json;

class CompanyBankController extends BaseController
{
    use ResponseTrait;

    protected $companyBank;
    protected $bankField;

    public function __construct()
    {
        $this->companyBank = new CompanyBank();
        $this->bankField = new BankField();
    }

    public function index()
    {
        $userData = getTokenUser();
        $request    = $this->request->getGet();
        $request['subscriber_id'] = $userData['subscriber_id'];
        $response   = $this->companyBank->getResource($request);
        $response['companyList'] = model(Company::class)->select('id,company_name')->where('subscriber_id', $userData['subscriber_id'])->orderBy('company_name')->get()->getResultArray();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $request = $this->request->getPost();
        $loginUser  = getTokenUser();
        $validationRules      = [
            'bank_name'         => ['label' => 'bank name', 'rules' => 'required'],
            'bank_detail_name'  => ['label' => 'bank detail name', 'rules' => 'required'],
            'account_number'    => ['label' => 'account number', 'rules' => 'required'],
            'account_name'      => ['label' => 'account name', 'rules' => 'required'],
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id' => $loginUser['subscriber_id'],
                'company_id' => $request['company_id'],
                'bank_name' => $request['bank_name'],
                'bank_detail_name' => $request['bank_detail_name'],
                'account_number' => $request['account_number'],
                'account_name' => $request['account_name'],
                'created_by' => $loginUser['id'],
                'created_at'    => Time::now()
            ];
            $this->companyBank->save($newData);
            $insertedID = $this->companyBank->getInsertID();

            if (isset($request['field']) && !empty($request['field'])) {
                $extraField = new BankField();
                $extraFieldData = [];
                foreach ($request['field'] as $key => $value) {
                    $extraFieldData[] = [
                        "company_bank_id" => $insertedID,
                        "key" => $key,
                        "value" => $value,
                        "created_at" => Time::now()
                    ];
                }
                $extraField->insertBatch($extraFieldData);
            }
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG . " " . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_COMPANY_BANK]);
    }

    public function update()
    {
        $request = $this->request->getPost();

        $validationRules      = [
            'bank_name'         => ['label' => 'bank name', 'rules' => 'required'],
            'bank_detail_name'  => ['label' => 'bank detail name', 'rules' => 'required'],
            'account_number'    => ['label' => 'account number', 'rules' => 'required'],
            'account_name'      => ['label' => 'account name', 'rules' => 'required'],
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;
        $loginUser  = getTokenUser();
        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id' => $loginUser['subscriber_id'],
                'company_id' => $request['company_id'],
                'bank_name' => $request['bank_name'],
                'bank_detail_name' => $request['bank_detail_name'],
                'account_number' => $request['account_number'],
                'account_name' => $request['account_name'],
                'updated_by' => $loginUser['id'],
                'updated_at'    => Time::now()
            ];

            $this->companyBank->update($request['id'], $newData);
            $this->bankField->where('company_bank_id', $request['id'])->delete();

            if (isset($request['field']) && !empty($request['field'])) {
                $extraField = new BankField();
                $extraFieldData = [];
                foreach ($request['field'] as $key => $value) {
                    $extraFieldData[] = [
                        "company_bank_id" => $request['id'],
                        "key" => $key,
                        "value" => $value,
                        "created_at" => Time::now()
                    ];
                }
                $extraField->insertBatch($extraFieldData);
            }
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG . " " . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_COMPANY_BANK]);
    }

    public function view()
    {
        $request = $this->request->getPost();
        $response = $this->companyBank->getResource($request, true, true);
        $response['extraFiled'] = $this->bankField->select('key as extraFiled,value as extraValue')->where("company_bank_id", $response['id'])->get()->getResultArray();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $companyBankData = $this->companyBank->getResource($request, true);

        if ($companyBankData) {
            $companyBankID = $request['id'];
            try {
                $this->db->transBegin();
                $this->companyBank->delete($companyBankID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_COMPANY_BANK]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => COMPANY_BANK_NOT_FOUND], '404');
    }
}
