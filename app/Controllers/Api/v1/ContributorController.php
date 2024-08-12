<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Entities\Collection;
use App\Models\Contributor;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class ContributorController extends BaseController
{
    use ResponseTrait;
    protected Contributor $contributor;

    public function __construct()
    {
        $this->contributor = new Contributor();
    }

    public function index()
    {
        $request = $this->request->getGet();
        $response = Collection::tableData(
            $this->contributor->resource($request)->get()->getResultArray(),
            $this->contributor->resource($request)->countAllResults()
        );
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'first_name'    => ['label' => 'first name', 'rules' => 'required'],
            'last_name'     => ['label' => 'last name', 'rules' => 'required'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id' => $userData['subscriber_id'],
                'first_name' => $request['first_name'],
                'last_name' => $request['last_name'],
                'status' => $request['status'],
                'created_at' => Time::now(),
            ];
            $this->contributor->insert($newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_CONTRIBUTOR]);
    }


    public function update()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'id'            => ['label' => 'id', 'rules' => 'required'],
            'first_name'    => ['label' => 'first name', 'rules' => 'required'],
            'last_name'     => ['label' => 'last name', 'rules' => 'required'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id' => $userData['subscriber_id'],
                'first_name' => $request['first_name'],
                'last_name' => $request['last_name'],
                'status' => $request['status'],
                'updated_at' => Time::now(),
            ];
            $this->contributor->update($request['id'], $newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_CONTRIBUTOR]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $ContributorData = $this->contributor->find($request['id']);
        if ($ContributorData) {
            $ContributorID = $request['id'];
            try {
                $this->db->transBegin();
                $this->contributor->delete($ContributorID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_CONTRIBUTOR]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => CONTRIBUTOR_NOT_FOUND], '404');
    }
}
