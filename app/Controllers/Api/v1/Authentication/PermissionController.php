<?php

namespace App\Controllers\Api\V1\Authentication;

use App\Controllers\BaseController;
use App\Models\Permission;
use App\Models\PermissionGroup;
use App\Models\Role;
use App\Models\User;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class PermissionController extends BaseController
{
    use ResponseTrait;
    protected $permission;
    protected $permissionGroup;
    protected $user;
    protected $role;

    public function __construct()
    {
        $this->permission = new Permission();
        $this->permissionGroup = new PermissionGroup();
        $this->user = new User();
        $this->role = new Role();
    }

    public function index()
    {
        $request = $this->request->getGet();
        $permissions = $this->permission->getResource($request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $permissions]);
    }

    public function groupList()
    {
        $request = $this->request->getGet();
        $response = $this->permissionGroup->getResource($request);
        // $response['permissionList'] = $this->permission->getPermissionForGroup();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function groupCreate()
    {
        $request = $this->request->getPost();
        // 'name' => ['label' => 'name', 'rules' => 'required|is_unique[permission_group.name]'],
        $userData = getTokenUser();
        $validationRules      = [
            'name' => ['label' => 'name', 'rules' => 'required|is_uniques[permission_group.name,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'description' => ['label' => 'description', 'rules' => 'required']
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
            $permissions = isset($request['permissions']) && !empty($request['permissions']) ? implode(',', $request['permissions']) : Null;
            $restrictions = isset($request['restrictions']) && !empty($request['restrictions']) ? implode(',', $request['restrictions']) : Null;

            $newData = [
                'name' => $request['name'],
                'description' => $request['description'],
                'permissions' => $permissions,
                'restrictions' => $restrictions,
                'subscriber_id' => $userData['subscriber_id'],
                'created_at' => Time::now()
            ];

            $this->permissionGroup->save($newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_PERMISSION_GROUP]);
    }

    public function groupUpdate()
    {
        $request = $this->request->getPost();
        $userData = getTokenUser();
        $validationRules      = [
            'name' => ['label' => 'name', 'rules' => 'required|is_uniques[permission_group.name,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'description' => ['label' => 'description', 'rules' => 'required']
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
            $permissions = isset($request['permissions']) && !empty($request['permissions']) ? implode(',', $request['permissions']) : Null;
            $restrictions = isset($request['restrictions']) && !empty($request['restrictions']) ? implode(',', $request['restrictions']) : Null;
            $newData = [
                'name' => $request['name'],
                'description' => $request['description'],
                'permissions' => $permissions,
                'restrictions' => $restrictions,
                'updated_at' => Time::now()
            ];

            $this->permissionGroup->update($request['id'], $newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_PERMISSION_GROUP]);
    }

    public function groupDelete()
    {
        $request = $this->request->getPost();
        $permissionGroup = $this->permissionGroup->getResource($request, false, true);

        if ($permissionGroup && $request['id'] !== '') {
            $permissionGroupID = $permissionGroup['id'];
            try {
                $this->db->transBegin();
                $this->permissionGroup->delete($permissionGroupID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_PERMISSION_GROUP]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => PERMISSION_GROUP_NOT_FOUND], '404');
    }

    public function groupView()
    {
        $request = $this->request->getPost();

        if ($request['type'] === "edit" && $request['id'] !== '') {
            $response['groupData'] = $this->permissionGroup->getResource($request, false, true);
        } else if ($request['type'] === "view" && $request['id'] !== null) {
            $response['groupData'] = $this->permissionGroup->getResource($request, false, true);
        }

        $userID = getTokenUserID();
        $userData = $this->user->getResource(['id' => $userID], false, true);
        $roleData = $this->role->getResource(['id' => $userData['role_id']], false, true);
        
        if ($userData['user_type'] === 'Subscriber') {
            $permissionGroupData = $this->permissionGroup->getResource(['id' => $roleData['group_id']], false, true);

            $response['allPermissionList'] = $this->permission->getPermissionForGroup($permissionGroupData['permissions'], $permissionGroupData['restrictions']);
        } else {
            $response['allPermissionList'] = $this->permission->getPermissionForGroup();
        }
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }
}
