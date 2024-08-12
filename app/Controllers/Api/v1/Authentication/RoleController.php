<?php

namespace App\Controllers\Api\V1\Authentication;

use App\Controllers\BaseController;
use App\Models\PermissionGroup;
use App\Models\Role;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class RoleController extends BaseController
{
    use ResponseTrait;
    protected $role;
    protected $permissionGroup;

    public function __construct()
    {
        $this->role = new Role();
        $this->permissionGroup = new PermissionGroup();
    }

    public function index()
    {
        global $roleStatus;
        $request = $this->request->getGet();
        $response = $this->role->getResource($request);
        $response['status'] = $roleStatus;
        $response['permissionGroups'] = $this->permissionGroup->getLists();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $request = $this->request->getPost();
        $userData = getTokenUser();
        // 'name' => ['label' => 'name', 'rules' => 'required|is_uniques[role.name,[subscriber_id=>1],subscriber_id.' . $userData['subscriber_id'] . ']'],
        $validationRules      = [
            'name' => ['label' => 'name', 'rules' => 'required|is_uniques[role.name,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'group_id' => ['label' => 'permission group', 'rules' => 'required'],
            'status' => 'required',
        ];
        $validationMessages = [
            'name' => [
                'is_uniques' => 'The name field must contain a unique value.'
            ]
        ];
        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'name' => $request['name'],
                'group_id' => $request['group_id'],
                'status' => $request['status'],
                'subscriber_id' => $userData['subscriber_id'],
                'created_at' => Time::now()
            ];
            $this->role->save($newData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_ROLE]);
    }

    public function update()
    {
        // 'name' => ['label' => 'name', 'rules' => 'required|is_unique[role.name,id,{id}]'],
        $userData = getTokenUser();
        $validationRules      = [
            'name' => ['label' => 'name', 'rules' => 'required|is_uniques[role.name,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'group_id' => ['label' => 'permission group', 'rules' => 'required'],
            'status' => 'required',
        ];

        $validationMessages = [
            'name' => [
                'is_uniques' => 'The name field must contain a unique value.'
            ]
        ];

        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $request = $this->request->getPost();
            $newData = [
                'name' => $request['name'],
                'group_id' => $request['group_id'],
                'status' => $request['status'],
                'updated_at' => Time::now()
            ];
            $this->role->update($request['id'], $newData);
        } catch (\Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_ROLE]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $role = $this->role->getResource($request, false, true);

        if ($role && $request['id'] !== '') {
            $roleID = $role['id'];
            try {
                $this->db->transBegin();
                $this->role->delete($roleID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_ROLE]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => ROLE_NOT_FOUND], '404');
    }
}
