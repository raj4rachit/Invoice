<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\PaymentTerm;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class PaymentTermController extends BaseController
{
    use ResponseTrait;
    public $selectedCompany;
    public $paymentTerm;
    public $user;

    public function __construct()
    {
        $this->user = getTokenUser();
        $this->paymentTerm = new PaymentTerm();
    }

    public function index()
    {
        $userCompany = new CompanyUser();


        $companyID = $userCompany->select('company_id')->where('user_id', $this->user['id'])->get()->getResultArray();
        $companyID = array_map(function ($value) {
            return $value['company_id'];
        }, $companyID);
        $companies = new Company();
        $request    = $this->request->getGet();
        $response   = $this->paymentTerm->getResource($request);
        if ($this->user['user_type'] == "User") {
            $response['companies'] = $companies->select('id,company_name')->whereIn('id', $companyID)->get()->getResultArray();
        }
        if ($this->user['user_type'] == "Subscriber") {
            $response['companies'] = $companies->select('id,company_name')->where('subscriber_id', $this->user['subscriber_id'])->get()->getResultArray();
        }
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $request = $this->request->getPost();
        $validationRules      = [
            'company_id'   => ['label' => 'company', 'rules' => 'required'],
            'title'   => ['label' => 'title', 'rules' => 'required|is_uniques[payment_terms.title,[company_id.' . $request['company_id'] . ']]'],
            'description'   => ['label' => 'description', 'rules' => 'required'],
        ];
        $validationMessages = [
            'title' => [
                'is_uniques' => 'The title field must contain a unique value.'
            ]
        ];
        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;
        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id' => $this->user['subscriber_id'],
                'company_id' => $request['company_id'],
                'title' => $request['title'],
                'description' => $request['description'],
                'status' => $request['status'],
                'created_by' => $this->user['id'],
                'created_at' => Time::now()
            ];

            $this->paymentTerm->save($newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => $ex->getMessage()], '400');
        }
        $this->db->transCommit();

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_PAYMENT_TERM]);
    }

    public function update()
    {
        $request = $this->request->getPost();

        $validationRules      = [
            'id'   => ['label' => 'company', 'rules' => 'required'],
            'company_id'   => ['label' => 'company', 'rules' => 'required'],
            'title'   => ['label' => 'title', 'rules' => 'required|is_uniques[payment_terms.title,[company_id.' . $request['company_id'] . '],[id.{id}]]'],
            'description'   => ['label' => 'description', 'rules' => 'required'],
        ];
        $validationMessages = [
            'title' => [
                'is_uniques' => 'The title field must contain a unique value.'
            ]
        ];
        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;
        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id' => $this->user['subscriber_id'],
                'company_id' => $request['company_id'],
                'title' => $request['title'],
                'description' => $request['description'],
                'status' => $request['status'],
                'updated_by' => $this->user['id'],
                'updated_at' => Time::now()
            ];
            $this->paymentTerm->update($request['id'], $newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => $ex->getMessage()], '400');
        }
        $this->db->transCommit();

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_PAYMENT_TERM]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $paymentTermData = $this->paymentTerm->getResource($request, false, true);
        if ($paymentTermData) {
            $paymentTermID = $request['id'];
            try {
                $this->db->transBegin();
                $this->paymentTerm->delete($paymentTermID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_PAYMENT_TERM]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => PAYMENT_TERM_NOT_FOUND], '404');
    }
}
