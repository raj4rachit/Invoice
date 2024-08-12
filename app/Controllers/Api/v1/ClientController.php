<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\Client;
use App\Models\ClientContributedUser;
use App\Models\ClientGroup;
use App\Models\Company;
use App\Models\CompanyClient;
use App\Models\CompanyUser;
use App\Models\Contributor;
use App\Models\Country;
use App\Models\SourcePlatform;
use App\Models\User;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class ClientController extends BaseController
{

    use ResponseTrait;
    protected $client;
    protected $clientContributedUser;
    protected $clientGroup;
    protected $country;
    protected $sourcePlatform;
    protected $user;
    protected $contributor;
    protected $company;
    protected $companyClient;

    public function __construct()
    {
        $this->client = new Client();
        $this->clientContributedUser = new ClientContributedUser();
        $this->clientGroup = new ClientGroup();
        $this->country = new Country();
        $this->sourcePlatform = new SourcePlatform();
        $this->user = new User();
        $this->contributor = new Contributor();
        $this->company = new Company();
        $this->companyClient = new CompanyClient();
    }

    public function index()
    {
        $request    = $this->request->getGet();
        $response   = $this->client->getResource($request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'company_name'      => ['label' => 'company name', 'rules' => 'permit_empty|is_uniques[clients.company_name,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'client_name'       => ['label' => 'client name', 'rules' => 'required'],
            'enroll_date'       => ['label' => 'enroll date', 'rules' => 'required'],
            'tax_no'            => ['label' => 'tax number', 'rules' => 'permit_empty|is_uniques[clients.tax_no,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'gst_vat_no'        => ['label' => 'gst/vat no', 'rules' => 'permit_empty|is_uniques[clients.gst_vat_no,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'email'             => ['label' => 'email', 'rules' => 'required|is_uniques[clients.email,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'phone'             => ['label' => 'phone', 'rules' => 'required'],
            'address_1'         => ['label' => 'address line 1', 'rules' => 'required'],
            'address_2'         => ['label' => 'address line 2', 'rules' => 'permit_empty'],
            'country_id'        => ['label' => 'country id', 'rules' => 'required|numeric'],
            'source_by'         => ['label' => 'source by', 'rules' => 'required|numeric'],
            'source_from'       => ['label' => 'source from', 'rules' => 'required|numeric'],
            'client_group_id'   => ['label' => 'client group id', 'rules' => 'required|numeric'],
            'is_bifurcated'     => ['label' => 'bifurcated', 'rules' => 'required|in_list[Yes,No]'],
            'status'            => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'company_name' => [
                'is_uniques' => 'The company name field must contain a unique value.'
            ],
            'tax_no' => [
                'is_uniques' => 'The tax number field must contain a unique value.'
            ],
            'gst_vat_no' => [
                'is_uniques' => 'The gst/vat number field must contain a unique value.'
            ],
            'email' => [
                'is_uniques' => 'The email field must contain a unique value.'
            ],
        ];

        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id'     => $userData['subscriber_id'],
                'company_name'      => $request['company_name'],
                'client_name'       => $request['client_name'],
                'enroll_date'       => $request['enroll_date'],
                'tax_no'            => $request['tax_no'],
                'gst_vat_no'        => $request['gst_vat_no'],
                'email'             => $request['email'],
                'phone'             => $request['phone'],
                'address_1'         => $request['address_1'],
                'address_2'         => $request['address_2'],
                'city'              => $request['city'],
                'state'             => $request['state'],
                'zip_code'          => $request['zip_code'],
                'country_id'        => $request['country_id'],
                'source_by'         => $request['source_by'],
                'source_from'       => $request['source_from'],
                'client_group_id'   => $request['client_group_id'],
                'is_bifurcated'     => $request['is_bifurcated'],
                'status'            => $request['status'],
                'created_by'        => $userData['id'],
                'created_at'        => Time::now()
            ];

            $this->client->save($newData);
            $clientID = $this->client->getInsertID();

            if (isset($request['contribute_by']) && !empty($request['contribute_by'])) {
                $contributeData = [];
                foreach ($request['contribute_by'] as $key => $value) {
                    $contributeData[$key]['subscriber_id'] = $userData['subscriber_id'];
                    $contributeData[$key]['client_id'] = $clientID;
                    $contributeData[$key]['contributor_id'] =  $value;
                }
                $this->clientContributedUser->insertBatch($contributeData);
            }

            // Add Client Company
            if (isset($request['client_companies']) && !empty($request['client_companies'])) {
                $companyData = [];
                foreach ($request['client_companies'] as $key => $value) :
                    $companyData[$key]['company_id'] = $value;
                    $companyData[$key]['client_id'] = $clientID;
                    $companyData[$key]['created_by'] = $userData['id'];
                    $companyData[$key]['created_at'] = Time::now();
                endforeach;
                $this->companyClient->insertBatch($companyData);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_CLIENT]);
    }

    public function update()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();

        $validationRules      = [
            'company_name'      => ['label' => 'company name', 'rules' => 'permit_empty|is_uniques[clients.company_name,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'client_name'       => ['label' => 'client name', 'rules' => 'required'],
            'enroll_date'       => ['label' => 'enroll date', 'rules' => 'required'],
            'tax_no'            => ['label' => 'tax number', 'rules' => 'permit_empty|is_uniques[clients.tax_no,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'gst_vat_no'        => ['label' => 'gst/vat no', 'rules' => 'permit_empty|is_uniques[clients.gst_vat_no,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'email'             => ['label' => 'email', 'rules' => 'required|is_uniques[clients.email,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'phone'             => ['label' => 'phone', 'rules' => 'required'],
            'address_1'         => ['label' => 'address line 1', 'rules' => 'required'],
            'address_2'         => ['label' => 'address line 2', 'rules' => 'permit_empty'],
            'country_id'        => ['label' => 'country id', 'rules' => 'required|numeric'],
            'source_by'         => ['label' => 'source by', 'rules' => 'required|numeric'],
            'source_from'       => ['label' => 'source from', 'rules' => 'required|numeric'],
            'client_group_id'   => ['label' => 'client group id', 'rules' => 'required|numeric'],
            'is_bifurcated'     => ['label' => 'bifurcated', 'rules' => 'required|in_list[Yes,No]'],
            'status'            => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'company_name' => [
                'is_uniques' => 'The company name field must contain a unique value.'
            ],
            'tax_no' => [
                'is_uniques' => 'The tax number field must contain a unique value.'
            ],
            'gst_vat_no' => [
                'is_uniques' => 'The gst/vat number field must contain a unique value.'
            ],
            'email' => [
                'is_uniques' => 'The email field must contain a unique value.'
            ],
        ];
        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;
        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id'     => $userData['subscriber_id'],
                'company_name'      => $request['company_name'],
                'client_name'       => $request['client_name'],
                'enroll_date'       => $request['enroll_date'],
                'tax_no'            => $request['tax_no'],
                'gst_vat_no'        => $request['gst_vat_no'],
                'email'             => $request['email'],
                'phone'             => $request['phone'],
                'address_1'         => $request['address_1'],
                'address_2'         => $request['address_2'],
                'city'              => $request['city'],
                'state'             => $request['state'],
                'zip_code'          => $request['zip_code'],
                'country_id'        => $request['country_id'],
                'source_by'         => $request['source_by'],
                'source_from'       => $request['source_from'],
                'client_group_id'   => $request['client_group_id'],
                'is_bifurcated'     => $request['is_bifurcated'],
                'status'            => $request['status'],
                'updated_by'        => $userData['id'],
                'updated_at'        => Time::now()
            ];
            $this->client->update($request['id'], $newData);

            $this->clientContributedUser->where('client_id', $request['id'])->delete();
            if (isset($request['contribute_by']) && !empty($request['contribute_by'])) {
                $contributeData = [];
                foreach ($request['contribute_by'] as $key => $value) {
                    $contributeData[$key]['subscriber_id'] = $userData['subscriber_id'];
                    $contributeData[$key]['client_id'] = $request['id'];
                    $contributeData[$key]['contributor_id'] =  $value;
                }
                $this->clientContributedUser->insertBatch($contributeData);
            }

            // Delete Client Company
            $this->companyClient->where('client_id', $request['id'])->delete();
            // Add Client Company
            if (isset($request['client_companies']) && !empty($request['client_companies'])) {
                $companyData = [];
                foreach ($request['client_companies'] as $key => $value) :
                    $companyData[$key]['company_id'] = $value;
                    $companyData[$key]['client_id'] = $request['id'];
                    $companyData[$key]['created_by'] = $userData['id'];
                    $companyData[$key]['created_at'] = Time::now();
                endforeach;
                $this->companyClient->insertBatch($companyData);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_CLIENT]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $clientData = $this->client->getResource($request, false, true);
        if ($clientData) {
            $clientID = $request['id'];
            try {
                $this->db->transBegin();
                $this->client->delete($clientID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_CLIENT]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => CLIENT_NOT_FOUND], '404');
    }

    public function clientView()
    {
        $request = $this->request->getPost();

        $userData = getTokenUser();
        $subscriber_id = $userData['subscriber_id'];

        $countries = $this->country->select('id,country_name')->where('status', 'Active')->orderBy('country_name')->get()->getResultArray();
        $clientGroups = $this->clientGroup->select('id,group_name')->where('subscriber_id', $subscriber_id)->where('status', 'Active')->orderBy('group_name')->get()->getResultArray();
        $sourcePlatform = $this->sourcePlatform->select('id,platform_name')->where('subscriber_id', $subscriber_id)->where('status', 'Active')->orderBy('platform_name')->get()->getResultArray();
        $sourceBy = $this->contributor->select('id,concat(first_name," ", last_name) as name')->where('subscriber_id', $subscriber_id)->orderBy('name')->get()->getResultArray();
        $companies = $this->company->select('id,company_name')->where('subscriber_id', $subscriber_id)->orderBy('company_name')->get()->getResultArray();
        $response = [
            'countries' => $countries,
            'group' => $clientGroups,
            'sourcePlatform' => $sourcePlatform,
            'sourceBy' => $sourceBy,
            'companies' => $companies,
        ];


        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }


    /**********************************************************************
     **************************** Client Group ****************************
     **********************************************************************/

    public function groupList()
    {
        $request    = $this->request->getGet();
        $response   = $this->clientGroup->getResource($request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function groupCreate()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'group_name'    => ['label' => 'group name', 'rules' => 'required|is_uniques[client_groups.group_name,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'group_name' => [
                'is_uniques' => 'The group name field must contain a unique value.'
            ]
        ];

        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        try {
            $this->db->transBegin();
            $newData = [
                'subscriber_id' => $userData['subscriber_id'],
                'group_name'    => $request['group_name'],
                'description'   => $request['description'],
                'status'        => $request['status'],
                'created_by'    => $userData['id'],
                'created_at'    => Time::now()
            ];

            $this->clientGroup->save($newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_CLIENT_GROUP]);
    }

    public function groupUpdate()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'group_name'    => ['label' => 'group name', 'rules' => 'required|is_uniques[client_groups.group_name,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'group_name' => [
                'is_uniques' => 'The group name field must contain a unique value.'
            ]
        ];

        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        try {
            $this->db->transBegin();
            $newData = [
                'group_name'    => $request['group_name'],
                'description'   => $request['description'],
                'status'        => $request['status'],
                'updated_by'    => $userData['id'],
                'updated_at'    => Time::now()
            ];

            $this->clientGroup->update($request['id'], $newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_CLIENT_GROUP]);
    }

    public function groupDelete()
    {
        $request = $this->request->getPost();
        $clientGroup = $this->clientGroup->getResource($request, false, true);
        if ($clientGroup && $request['id'] !== '') {
            $clientGroupID = $clientGroup['id'];
            try {
                $this->db->transBegin();
                $this->clientGroup->delete($clientGroupID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_CLIENT_GROUP]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => CLIENT_GROUP_NOT_FOUND], '404');
    }

    public function getClientBill()
    {
        $request = $this->request->getGet();
        // $this->client->newClientData($request);
        $response = $this->client->newClientData($request);

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }
}
