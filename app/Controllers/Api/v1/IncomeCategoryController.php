<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Entities\Collection;
use App\Models\IncomeCategory;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class IncomeCategoryController extends BaseController
{
    use ResponseTrait;
    protected $incomeCategory;

    public function __construct()
    {
        $this->incomeCategory = new IncomeCategory();
    }

    public function index()
    {
        $loginUser  = getTokenUser();
        $request    = $this->request->getGet();
        $request['subscriber_id'] = $loginUser['subscriber_id'];

        $response = Collection::tableData(
            $this->incomeCategory->resources($request)->get()->getResultArray(),
            $this->incomeCategory->resources($request, false)->countAllResults()
        );

        $response['parent_category'] = $this->incomeCategory->select('id,name')->where('status', "Active")->where('parent_id', NULL)->where('subscriber_id', $loginUser['subscriber_id'])->get()->getResultArray();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $request = $this->request->getPost();
        $validationRules      = [
            'name' => ['label' => 'name', 'rules' => 'required']
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $parentID = (isset($request['parent_id']) && $request['parent_id'] != "0") ? $request['parent_id'] : null;
            $loginUser  = getTokenUser();
            $newData = [
                'subscriber_id' => $loginUser['subscriber_id'],
                'name'          => $request['name'],
                'parent_id'     => $parentID,
                'status'        => $request['status'],
                'created_by'    => $loginUser['id'],
                'created_at'    => Time::now()
            ];
            $this->incomeCategory->insert($newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG  . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_INCOME_CATEGORY]);
    }

    public function update()
    {
        $request = $this->request->getPost();
        $validationRules      = [
            'name' => ['label' => 'name', 'rules' => 'required']
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $parentID =  (isset($request['parent_id']) && $request['parent_id'] != "0" && $request != null) ? $request['parent_id'] : null;
            $loginUser  = getTokenUser();
            $newData = [
                'name'          => $request['name'],
                'status'        => $request['status'],
                'parent_id'     => $parentID,
                'updated_by'    => $loginUser['id'],
                'updated_at'    => Time::now()
            ];

            $this->incomeCategory->update($request['id'], $newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG  . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_INCOME_CATEGORY]);
    }


    public function delete()
    {
        $request = $this->request->getPost();
        $incomeCategoryData = $this->incomeCategory->find($request['id']);
        if ($incomeCategoryData) {
            $incomeCategoryID = $request['id'];
            try {
                $this->db->transBegin();
                $this->incomeCategory->delete($incomeCategoryID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_INCOME_CATEGORY]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => INCOME_CATEGORY_NOT_FOUND], '404');
    }
}
