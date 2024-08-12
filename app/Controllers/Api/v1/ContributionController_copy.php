<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\Client;
use App\Models\ContributionRatio;
use App\Models\User;
use CodeIgniter\API\ResponseTrait;

class ContributionController extends BaseController
{
    use ResponseTrait;
    protected $user;
    protected $client;
    protected $contributionRatio;

    public function __construct()
    {
        $this->user = new User();
        $this->client = new Client();
        $this->contributionRatio = new ContributionRatio();
    }

    public function index()
    {
        // Get User List By subscriber or Company from user table
        $response['employeeList']   = $this->user->ByCompany();
        $response['contributionRatioList']  = $this->contributionRatio->BySubscriber();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    /**
     * This function return employee id and Date wise data
     */
    public function EmployeesClientData()
    {
        $request    = $this->request->getPost();
        $response['monthList'] = $this->client->GetMonthList();
        $response['clientList'] = $request['employee_id'] !== '0' ? $this->client->ByContributeEmployee($request['employee_id']) : [];
        $response['selectedRatio'] = $request['employee_id'] !== '0' ? $this->client->ByContributeEmployee($request['employee_id']) : [];
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    /**
     * This function add or update user contribution ratio
     * 
     * @return mixed
     */
    public function createOrUpdate()
    {
        $request = $this->request->getPost();

        echo '<pre>';
        print_r($request);
        $employeeID = $request['employee_id'];
        $newData = [];

        foreach ($request['contribution'] as $key => $value) {
            $monthData = $request['contribution'][$key];
            foreach ($monthData as $k => $v) {
                $newData[] = [
                    'user_id' => $employeeID,
                    'client_id' => $key,
                    'month' => $k,
                ];
            }
        }

        print_r($newData);
        die;
    }
}
