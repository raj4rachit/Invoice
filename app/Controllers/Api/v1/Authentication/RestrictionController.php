<?php

namespace App\Controllers\Api\V1\Authentication;

use App\Controllers\BaseController;
use App\Models\Permission;
use App\Models\Restriction;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class RestrictionController extends BaseController
{
    use ResponseTrait;
    protected $permission;
    protected $restriction;

    public function __construct()
    {
        $this->permission = new Permission();
        $this->restriction = new Restriction();
    }

    public function index()
    {
        $request = $this->request->getGet();
        $response = $this->restriction->getResource($request);
        $response['permissionList'] = $this->permission->select('id,name')->get()->getResult();

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $request = $this->request->getPost();
        $validationRules      = [
            'name' => ['label' => 'name', 'rules' => 'required'],
            'slug' => ['label' => 'slug', 'rules' => 'required|is_unique[restrictions.slug]'],
            'description' => ['label' => 'description', 'rules' => 'required'],
            'permission_id' => ['label' => 'permission', 'rules' => 'required']
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'name' => $request['name'],
                'slug' => $request['slug'],
                'description' => $request['description'],
                'permission_id' => $request['permission_id'],
                'created_at' => Time::now()
            ];
            $this->restriction->save($newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_RESTRICTION]);
    }

    public function update()
    {
        $request = $this->request->getPost();
        $validationRules      = [
            'name' => ['label' => 'name', 'rules' => 'required'],
            'slug' => ['label' => 'slug', 'rules' => 'required|is_unique[restrictions.slug,id,{id}]'],
            'description' => ['label' => 'description', 'rules' => 'required'],
            'permission_id' => ['label' => 'permission', 'rules' => 'required']
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'name' => $request['name'],
                'slug' => $request['slug'],
                'description' => $request['description'],
                'permission_id' => $request['permission_id'],
                'updated_at' => Time::now()
            ];
            $this->restriction->update($request['id'], $newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_RESTRICTION]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $getRestriction = $this->restriction->getResource($request, false, true);
        if ($getRestriction && $request['id'] !== '') {
            $ID = $getRestriction['id'];
            try {
                $this->db->transBegin();
                $this->restriction->delete($ID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_RESTRICTION]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => RESTRICTION_NOT_FOUND], '404');
    }
}
