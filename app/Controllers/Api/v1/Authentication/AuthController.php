<?php

namespace App\Controllers\Api\V1\Authentication;

use App\Controllers\BaseController;
use App\Models\AppToken;
use App\Models\Company;
use App\Models\CompanyFinancialYear;
use App\Models\CompanyUser;
use App\Models\Permission;
use App\Models\PermissionGroup;
use App\Models\Restriction;
use App\Models\Role;
use App\Models\Subscriber;
use App\Models\User;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class AuthController extends BaseController
{
    use ResponseTrait;

    protected $user;
    protected $appToken;
    protected $role;
    protected $permission;
    protected $permissionGroup;
    protected $restriction;
    protected $company;
    protected $companyUser;
    protected $companyFinancialYear;

    public function __construct()
    {
        $this->user = new User();
        $this->appToken = new AppToken();
        $this->role = new Role();
        $this->permission = new Permission();
        $this->permissionGroup = new PermissionGroup();
        $this->restriction = new Restriction();
        $this->company = new Company();
        $this->companyUser = new CompanyUser();
        $this->companyFinancialYear = new CompanyFinancialYear();
    }
    public function testing()
    {
        print_r(getSelectedCompany());
        exit;
    }
    // Login user with login credentials
    public function checkLogin()
    {
        $request = $this->request->getPost();

        $validationRules      = [
            'email'     => ['label' => 'Email', 'rules' => 'required|valid_email|checkEmail[email]'],
            'password'  => ['label' => 'Password', 'rules' => 'required|min_length[6]|checkCredential[email,password]']
        ];

        $validationErrors = [
            'email' => [
                'valid_email' => 'Email is not valid please enter valid email.',
                'checkEmail' => 'Email is not exist in our records please enter registered email.'
            ],
            'password' => ['checkCredential' => 'Your email or password does not match.']
        ];

        if (!$this->validate($validationRules, $validationErrors)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        // $userData = $this->user->where('email', $request['email'])->first();
        $userData = $this->user->byEmail($request['email']);
        $token =  $this->setUserToken($userData['id']);
        // $token = '';
        $userAccess = $this->getUserAccess($userData['role_id']);
        $companyDetails = $this->userCompanyAccess($userData);

        $response['token'] = $token;
        $response['user'] = $userData;
        $response['access'] = $userAccess;
        $response['company'] = (object)$companyDetails;

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    private function setUserToken($userId, $type = 'Login')
    {
        $ipAddress = getClientIpAddress();
        $agent = $this->request->getUserAgent();
        if ($agent->isBrowser()) {
            $currentAgent = $agent->getBrowser() . ' ' . $agent->getVersion();
        } elseif ($agent->isRobot()) {
            $currentAgent = $agent->getRobot();
        } elseif ($agent->isMobile()) {
            $currentAgent = $agent->getMobile();
        } else {
            $currentAgent = 'Unidentified User Agent';
        }

        $token = random_string('alnum', 50);
        $this->db->transBegin();
        try {
            $newTokenData = [
                'user_id' => $userId,
                'token' => $token,
                'ip_address' => $ipAddress,
                'device_type' => $agent->isMobile() ? 'Mobile' : 'Desktop',
                'platform_name' => $agent->getPlatform(),
                'platform_agent' => $currentAgent,
                'type' => $type,
                'expired_at' => strtotime(date('Y-m-d H:i:s', strtotime("+5 min"))),
                'created_at' => Time::now()
            ];
            $this->appToken->save($newTokenData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();

        return $token;
    }

    private function getUserAccess($roleID)
    {
        // This permission group id is user assigned role group id
        $roleData = $this->role->find($roleID);
        $permissionGroupID = $roleData['group_id'];

        $permissionGroupData = $this->permissionGroup->find($permissionGroupID);

        $permissionIds = explode(',', $permissionGroupData['permissions'] ?? '');
        $restrictionIds = explode(',', $permissionGroupData['restrictions'] ?? '');

        $permissionData = $this->permission->whereIn('id', $permissionIds)->findColumn('slug');
        $restrictionData = $this->restriction->whereIn('id', $restrictionIds)->findColumn('slug');

        return [
            'permissions' => $permissionData,
            'restriction' => $restrictionData,
        ];
    }

    private function userCompanyAccess($user)
    {
        if ($user['user_type'] === 'SuperAdmin') {
            return ['company_id' => '0', 'start_date' => '', 'end_date' => ''];
        }

        $subscriber = model(Subscriber::class)->find($user['subscriber_id']);
        $getDates = checkSubscriberDate($subscriber['financial_start_date'], $subscriber['financial_end_date']);

        $obj = ['company_id' => '0', 'start_date' => $getDates['start_date'], 'end_date' => $getDates['end_date']];
        $getCompanies = $this->company->getCompaniesByUser($user);
        if (sizeof($getCompanies) === 1) {
            $newData = $getCompanies[0];
            $getCompanies[0]['company_id'] = $newData['id'];
            $getDefaultYear = $this->companyFinancialYear->select('id as year_id,company_id,financial_year_name,start_date,end_date')->where('company_id', $newData['id'])->where('is_default', 'Yes')->first();

            $newArray = array_merge($obj, $getCompanies[0]);


            return array_merge($newArray, $getDefaultYear);
        }
        return $obj;
    }
    /**
     * This function is use for logout user
     */
    public function logout()
    {
        $userToken = getToken();
        $appToken = $this->appToken->where('token', $userToken)->first();

        if ($appToken) {
            $this->db->transBegin();
            try {
                $this->appToken->delete($appToken['id']);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => LOGOUT_SUCCESS]);
        } else {
        }
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 401, 'message' => TOKEN_NOT_FOUND], 401);
    }

    /**
     * This function use for forgot password
     * if you don't have remember your password then you will change your password using email address
     * @return mixed
     */
    public function forgotPassword()
    {
        $request = $this->request->getPost();

        $validationRules      = [
            'email'     => ['label' => 'Email', 'rules' => 'required|valid_email|checkEmail[email]'],
        ];

        $validationErrors = [
            'email' => [
                'valid_email' => 'Email is not valid please enter valid email.',
                'checkEmail' => 'Please enter your registered email address.'
            ]
        ];

        if (!$this->validate($validationRules, $validationErrors)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $userData = $this->user->where('email', $request['email'])->first();
        $token =  $this->setUserToken($userData['id'], 'Forgot');

        // $MSG = 'This is forgot password request email \n <a href="' . base_url("/change-password/$token") . '">ResetPassword</a> ';
        $MSG = 'This is forgot password request email <br /> <a href="' . "http://localhost:3000/change-password/$token" . '">ResetPassword</a> ';

        // Send Email
        $email = \Config\Services::email();
        $email->setFrom('admin@ibsystem.com', 'IB - System');
        $email->setTo($userData['email'], $userData['first_name'] . ' ' . $userData['last_name']);
        $email->setSubject('Forgot Password | IB - System');
        $email->setMessage($MSG);
        $email->send();
        $email->printDebugger(['headers']);

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => EMAIL_SEND]);
    }

    public function resetPassword()
    {
        $request = $this->request->getPost();

        $validationRules      = [
            'password'      => ['label' => 'password', 'rules' => 'required']
        ];
        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $tokenUser = $this->appToken->getForgotUser($request['token']);

        if ($tokenUser) {
            $userID = $tokenUser['user_id'];
            $currentTime = strtotime(date("Y-m-d H:i:s"));
            $expiringTime = $tokenUser['expired_at'];
            if ($expiringTime > $currentTime) {
                try {
                    $this->db->transBegin();
                    $newPassword = [
                        'password' => $request['password'],
                        'updated_at'    => Time::now()
                    ];
                    $this->user->update($userID, $newPassword);
                    $this->appToken->delete($tokenUser['id']);
                } catch (\Exception $err) {
                    $this->db->transRollback();
                    return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
                }
                $this->db->transCommit();
                return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => CHANGE_PASSWORD_SUCCESS]);
            } else {
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => 'Token Expired.'], '400');
            }
        } else {
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => INVALID_TOKEN_MSG], '400');
        }
    }


    public function companyList()
    {
        // Get login User type
        $loginUser = getTokenUser();
        $response = $this->company->getCompaniesByUser($loginUser);
        foreach ($response as $key => $r) {
            $response[$key]['company_id'] = $r['id'];
        }
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function companyFinancialYearList()
    {
        $request = $this->request->getPost();
        $response = $this->companyFinancialYear->select('id as year_id,company_id,financial_year_name,start_date,end_date')->where('company_id', $request['id'])->get()->getResultArray();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }
}
