<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\ContributionSlab;
use App\Models\Contributor;
use App\Models\User;
use App\Models\UserContribution;
use CodeIgniter\API\ResponseTrait;
use Exception;

class ContributionController extends BaseController
{
    use ResponseTrait;
    protected $user;
    protected $client;
    protected $contributionRatio;
    protected $userContribution;
    protected $contributionSlab;
    protected $contributor;

    public function __construct()
    {
        $this->user = new User();
        $this->userContribution = new UserContribution();
        $this->contributionSlab = new ContributionSlab();
        $this->contributor = new Contributor();
    }


    public function index()
    {
        $userData = getTokenUser();
        // Get User List By subscriber or Company from user table
        $response['employeeList']   = $this->contributor->where('subscriber_id', $userData['subscriber_id'])->where('status', 'Active')->findAll();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    /**
     * This function return employee id and Date wise data
     */
    public function EmployeesClientData()
    {
        $request = $this->request->getPost();


        // print_r($this->userContribution->report($request));
        // die;
        // $userContribution = $this->userContribution->where('user_id', $request['employee_id'])->get()->getRowArray();
        $response = $this->userContribution->report($request);
        // !empty($userContribution) &&  $response['slabs'] = $this->contributionSlab->select('from,to,amount_type,amount')->where('user_contribution_id', $userContribution['id'])->get()->getResultArray();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    /**
     * This function return employee id and Date wise data
     */
    public function EmployeeSlabs()
    {
        $request = $this->request->getPost();
        $userContribution = $this->userContribution->where('contributor_id', $request['employee_id'])->get()->getRowArray();
        $response = !empty($userContribution) ? $userContribution : '';
        !empty($userContribution) &&  $response['slabs'] = $this->contributionSlab->select('from,to,amount_type,amount')->where('user_contribution_id', $userContribution['id'])->get()->getResultArray();
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
        $userData = getTokenUser();
        $this->db->transBegin();
        try {
            $newArray = [
                'subscriber_id' => $userData['subscriber_id'],
                'contributor_id' => $request['employee_id'],
                'roll_over_month' => $request['roll_over_month'],
                'roll_over_bill' => $request['roll_over_bill'],
            ];

            if (isset($request['id'])) {
                $this->userContribution->update($request['id'], $newArray);
                $insertedID = $request['id'];
                $this->contributionSlab->where('user_contribution_id', $request['id'])->delete();
            } else {
                $this->userContribution->save($newArray);
                $insertedID = $this->userContribution->getInsertID();
            }

            if (isset($request['slabs'])) {
                $newSlabArray = [];
                foreach ($request['slabs'] as $value) {
                    $newSlabArray[] = [
                        'user_contribution_id' => $insertedID,
                        'from' => $value['from'],
                        'to' => $value['to'],
                        'amount_type' => $value['amount_type'],
                        'amount' => $value['amount'],
                    ];
                }
                $this->contributionSlab->insertBatch($newSlabArray);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            // return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        if (isset($request['id'])) {
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_USER_CONTRIBUTION]);
        }
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_USER_CONTRIBUTION]);
    }
}
