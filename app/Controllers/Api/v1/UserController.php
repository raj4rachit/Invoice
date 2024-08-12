<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\Role;
use App\Models\User;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class UserController extends BaseController
{
    use ResponseTrait;
    protected $user;
    protected $role;
    protected $company;
    protected $companyUser;

    public function __construct()
    {
        $this->user = new User();
        $this->role = new Role();
        $this->company = new Company();
        $this->companyUser = new CompanyUser();
    }

    public function index()
    {
        $userData = getTokenUser();
        $request                    = $this->request->getGet();
        $request['login_user']      = $userData['id'];
        $response                   = $this->user->getResource($request);
        $response['roleList']       = $this->role->select('id,name')->where('subscriber_id', $userData['subscriber_id'])->orderBy('name')->findAll();
        $response['employerList']   = [];
        $response['companyList']   = $this->company->select('id,company_name')->where('subscriber_id', $userData['subscriber_id'])->where('status', 'Active')->orderBy('company_name')->get()->getResultArray();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $request = $this->request->getPost();
        $userData = getTokenUser();
        $validationRules      = [
            'first_name'    => ['label' => 'first name', 'rules' => 'required'],
            'last_name'     => ['label' => 'last name', 'rules' => 'required'],
            'email'         => ['label' => 'email', 'rules' => 'required|is_uniques[users.email,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'password'      => ['label' => 'password', 'rules' => 'required'],
            'phone'         => ['label' => 'phone', 'rules' => 'required'],
            'role_id'       => ['label' => 'role', 'rules' => 'required'],
            'status'        => ['label' => 'status', 'rules' => 'required'],
        ];
        $validationMessages = [
            'email' => [
                'is_uniques' => 'The email field must contain a unique value.'
            ]
        ];

        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id' => $userData['subscriber_id'],
                'first_name'    => $request['first_name'],
                'last_name'     => $request['last_name'],
                'email'         => $request['email'],
                'password'      => $request['password'],
                'phone'         => $request['phone'],
                'role_id'       => $request['role_id'],
                'user_type'     => "User",
                'status'        => $request['status'],
                'created_by'    => getTokenUserID(),
                'created_at'    => Time::now()
            ];

            $this->user->save($newData);
            if (isset($request['company_id'])) {
                $companyUserArray = array();
                foreach ($request['company_id'] as $value) {
                    $is_defualt = ($request['is_default'] == $value) ? "Yes" : "No";
                    $companyUserArray[] = [
                        'company_id' => $value,
                        'user_id' => $this->user->getInsertID(),
                        'is_default' => $is_defualt,
                        'created_by' => $userData['id'],
                        'created_at' => Time::now()
                    ];
                }
                $this->companyUser->insertBatch($companyUserArray);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_USER]);
    }

    public function update()
    {
        $request = $this->request->getPost();
        $userData = getTokenUser();
        $validationRules      = [
            'first_name'    => ['label' => 'first name', 'rules' => 'required'],
            'last_name'     => ['label' => 'last name', 'rules' => 'required'],
            'email'         => ['label' => 'email', 'rules' => 'required|is_uniques[users.email,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'phone'         => ['label' => 'phone', 'rules' => 'required'],
            'role_id'       => ['label' => 'role', 'rules' => 'required'],
            'status'        => ['label' => 'status', 'rules' => 'required'],
        ];
        $validationMessages = [
            'email' => [
                'is_uniques' => 'The email field must contain a unique value.'
            ]
        ];

        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'first_name'    => $request['first_name'],
                'last_name'     => $request['last_name'],
                'email'         => $request['email'],
                'phone'         => $request['phone'],
                'role_id'       => $request['role_id'],
                'status'        => $request['status'],
                'updated_by'    => getTokenUserID(),
                'updated_at'    => Time::now()
            ];
            !empty($request['password']) && $newData['password'] = $request['password'];

            $this->user->update($request['id'], $newData);
            $this->companyUser->where('user_id', $request['id'])->delete();
            if (isset($request['company_id'])) {
                $companyUserArray = array();
                foreach ($request['company_id'] as $value) {
                    $is_defualt = "No";
                    if (isset($request['is_default'])) {
                        $is_defualt = ($request['is_default'] == $value) ? "Yes" : "No";
                    }
                    $companyUserArray[] = [
                        'company_id' => $value,
                        'user_id' => $request['id'],
                        'is_default' => $is_defualt,
                        'created_by' => $userData['id'],
                        'created_at' => Time::now()
                    ];
                }
                $this->companyUser->insertBatch($companyUserArray);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_USER]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $userData = $this->user->getResource($request, false, true);
        if ($userData) {
            $userID = $request['id'];
            try {
                $this->db->transBegin();
                $this->user->delete($userID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_USER]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => USER_NOT_FOUND], '404');
    }

    // User Profile 
    public function changePassword()
    {
        $request = $this->request->getPost();
        $validationRules      = [
            'current_password'      => ['label' => 'current password', 'rules' => 'required'],
            'password'              => ['label' => 'password', 'rules' => 'required']
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $userID = getTokenUserID();
        $userData = $this->user->find($userID);
        if ($userData) {
            $checkPassword = password_verify($request['current_password'], $userData['password']);
            if ($checkPassword) {
                try {
                    $this->db->transBegin();
                    $newPassword = [
                        'password' => $request['password'],
                        'updated_at'    => Time::now()
                    ];
                    $this->user->update($userID, $newPassword);
                } catch (\Exception $err) {
                    $this->db->transRollback();
                    return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
                }
                $this->db->transCommit();
                return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => CHANGE_PASSWORD_SUCCESS]);
            }
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => CURRENT_PASSWORD_NOT_MATCH]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 401, 'message' => INVALID_USER], '401');
    }
}
