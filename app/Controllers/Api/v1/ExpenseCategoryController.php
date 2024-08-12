<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\ExpenseCategory;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class ExpenseCategoryController extends BaseController
{
    use ResponseTrait;
    protected $expenseCategory;

    public function __construct()
    {
        $this->expenseCategory = new ExpenseCategory();
    }

    public function index()
    {
        $loginUser  = getTokenUser();
        $request    = $this->request->getGet();
        $request['subscriber_id'] = $loginUser['subscriber_id'];
        $response = $this->expenseCategory->getResources($request);
        $response['parent_category'] = $this->expenseCategory->select('id,name')->where('status', "Active")->where('parent_id', NULL)->where('subscriber_id', $loginUser['subscriber_id'])->get()->getResultArray();

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
        (isset($request['parent_id']) && $request['parent_id'] != "0") ? $parentID = $request['parent_id'] : $parentID = null;
        try {
            $loginUser  = getTokenUser();
            $newData = [
                'subscriber_id' => $loginUser['subscriber_id'],
                'name'          => $request['name'],
                'parent_id'     => $parentID,
                'status'        => $request['status'],
                'created_by'    => $loginUser['id'],
                'created_at'    => Time::now()
            ];

            $this->expenseCategory->save($newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG  . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_EXPENSE_CATEGORY]);
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
        (isset($request['parent_id']) && $request['parent_id'] != "0" && $request != null) ? $parentID = $request['parent_id'] : $parentID = null;

        try {
            $loginUser  = getTokenUser();
            $newData = [
                'name'          => $request['name'],
                'status'        => $request['status'],
                'parent_id'     => $parentID,
                'updated_by'    => $loginUser['id'],
                'updated_at'    => Time::now()
            ];

            $this->expenseCategory->update($request['id'], $newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG  . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_EXPENSE_CATEGORY]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $expenseCategoryData = $this->expenseCategory->getResources($request, true);
        if ($expenseCategoryData) {
            $expenseCategoryID = $request['id'];
            try {
                $this->db->transBegin();
                $this->expenseCategory->delete($expenseCategoryID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_EXPENSE_CATEGORY]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => EXPENSE_CATEGORY_NOT_FOUND], '404');
    }
}
