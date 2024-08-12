<?php

namespace App\Controllers\Api\v1;

use App\Controllers\BaseController;
use App\Models\Country;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;

class CountryController extends BaseController
{
    use ResponseTrait;

    protected $country;

    public function __construct()
    {
        $this->country = new Country();
    }
    public function index()
    {
        $request    = $this->request->getGet();
        $response   = $this->country->getResource($request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $request = $this->request->getPost();

        $validationRules      = [
            'country_name'  => ['label' => 'country name', 'rules' => 'required|is_unique[countries.country_name]'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'country_name'  => $request['country_name'],
                'status'        => $request['status'],
                'created_at'    => Time::now()
            ];
            $this->country->save($newData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_COUNTRY]);
    }

    public function update()
    {
        $request = $this->request->getPost();

        $validationRules      = [
            'country_name'  => ['label' => 'country name', 'rules' => 'required|is_unique[countries.country_name,id,{id}]'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'country_name'  => $request['country_name'],
                'status'        => $request['status'],
                'updated_at'    => Time::now()
            ];
            $this->country->update($request['id'], $newData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_COUNTRY]);
    }
}
