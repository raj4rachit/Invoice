<?php

namespace App\Controllers\Api\v1;

use App\Controllers\BaseController;
use App\Models\Country;
use App\Models\CountryTax;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;

class TaxController extends BaseController
{
    use ResponseTrait;

    protected $tax;
    protected $country;

    public function __construct()
    {
        $this->tax      = new CountryTax();
        $this->country  = new Country();
    }
    public function index()
    {
        $request    = $this->request->getGet();
        $response   = $this->tax->getResource($request);
        $response['countryList'] = $this->country->select('id,country_name')->where('status', "Active")->findAll();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }
    public function create()
    {
        $request = $this->request->getPost();
        $userData = getTokenUser();

        $validationRules      = [
            'country_id'    => ['label' => 'country name', 'rules' => 'required|numeric'],
            'tax_name'      => ['label' => 'tax name', 'rules' => 'required|is_uniques[country_taxes.tax_name,[country_id.{country_id}]]'],
            'rate'          => ['label' => 'rate', 'rules' => 'required|numeric'],
            'is_percentage' => ['label' => 'rate', 'rules' => 'required|in_list[Yes,No]'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'tax_name' => [
                'is_uniques' => 'The tax name field must contain a unique value.'
            ]
        ];

        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'country_id'    => $request['country_id'],
                'tax_name'      => $request['tax_name'],
                'rate'          => $request['rate'],
                'is_percentage' => $request['is_percentage'],
                'status'        => $request['status'],
                'created_by'    => getTokenUserID(),
                'created_at'    => Time::now()
            ];
            $this->tax->save($newData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_TAX]);
    }
    public function update()
    {
        $request = $this->request->getPost();

        $validationRules      = [
            'id'            => ['label' => 'tax id', 'rules' => 'required|numeric'],
            'country_id'    => ['label' => 'country name', 'rules' => 'required|numeric'],
            'tax_name'      => ['label' => 'tax name', 'rules' => 'required|is_uniques[country_taxes.tax_name,[country_id.{country_id}],[id.{id}]]'],
            'rate'          => ['label' => 'rate', 'rules' => 'required|numeric'],
            'is_percentage' => ['label' => 'rate', 'rules' => 'required|in_list[Yes,No]'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];
        $validationMessages = [
            'tax_name' => [
                'is_uniques' => 'The tax name field must contain a unique value.'
            ]
        ];

        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'country_id'    => $request['country_id'],
                'tax_name'      => $request['tax_name'],
                'rate'          => $request['rate'],
                'is_percentage' => $request['is_percentage'],
                'status'        => $request['status'],
                'updated_by'    => getTokenUserID(),
                'updated_at'    => Time::now()
            ];
            $this->tax->update($request['id'], $newData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_TAX]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $tax = $this->tax->getResource($request, false, true);
        if ($tax && $request['id'] !== '') {
            $taxID = $tax['id'];
            try {
                $this->db->transBegin();
                $this->tax->delete($taxID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_TAX]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => TAX_NOT_FOUND], '404');
    }
}
