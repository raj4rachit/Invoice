<?php

namespace App\Controllers\Api\v1;

use App\Controllers\BaseController;
use App\Models\CompanyClient;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;

class CompanyClientController extends BaseController
{
    use ResponseTrait;

    protected $companyClient;

    public function __construct()
    {
        $this->companyClient = new CompanyClient();
    }
    public function index()
    {
        $request    = $this->request->getGet();
        $response   = $this->companyClient->getResource($request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }
    public function create()
    {
        $request = $this->request->getPost();

        $validationRules      = [
            'currency_name'     => ['label' => 'currency name', 'rules' => 'required|is_unique[currencies.currency_name]'],
            'currency_symbol'   => ['label' => 'currency symbol','rules'=>'required|is_unique[currencies.short_code]'],
            'short_code'        => ['label' => 'short code','rules'=>'required'],
            'status'            => ['label' => 'status','rules'=>'required|in_list[Active,Inactive]'],
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'currency_name'     => $request['currency_name'],
                'currency_symbol'   => $request['currency_symbol'],
                'short_code'        => $request['short_code'],
                'status'            => $request['status'],
                'created_at'        => Time::now()
            ];
            $this->currency->save($newData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_CURRENCY]);

    }
}
