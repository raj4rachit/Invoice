<?php

namespace App\Controllers\Api\v1;

use App\Controllers\BaseController;
use App\Models\Currency;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;

class CurrencyController extends BaseController
{
    use ResponseTrait;

    protected $currency;

    public function __construct()
    {
        $this->currency = new Currency();
    }
    public function index()
    {
        global $currencyLocale;
        $request    = $this->request->getGet();
        $response   = $this->currency->getResource($request);
        $response['currencyLocale'] = $currencyLocale;
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }
    public function create()
    {
        $request = $this->request->getPost();

        $validationRules      = [
            'currency_name'     => ['label' => 'currency name', 'rules' => 'required|is_unique[currencies.currency_name]'],
            'currency_symbol'   => ['label' => 'currency symbol', 'rules' => 'required|is_unique[currencies.short_code]'],
            'short_code'        => ['label' => 'short code', 'rules' => 'required'],
            'locale'            => ['label' => 'currency locale', 'rules' => 'required'],
            'status'            => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
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
                'locale'            => $request['locale'],
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
    public function update()
    {
        $request = $this->request->getPost();
        $validationRules      = [
            'currency_name'     => ['label' => 'currency name', 'rules' => 'required|is_unique[currencies.currency_name,id,{id}]'],
            'currency_symbol'   => ['label' => 'currency symbol', 'rules' => 'required|is_unique[currencies.short_code,id,{id}]'],
            'short_code'        => ['label' => 'short code', 'rules' => 'required'],
            'locale'            => ['label' => 'currency locale', 'rules' => 'required'],
            'status'            => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
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
                'locale'            => $request['locale'],
                'status'            => $request['status'],
                'updated_at'        => Time::now()
            ];

            $this->currency->update($request['id'], $newData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_CURRENCY]);
    }
}
