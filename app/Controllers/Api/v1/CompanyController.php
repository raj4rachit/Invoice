<?php

namespace App\Controllers\Api\v1;

use App\Controllers\BaseController;
use App\Models\Client;
use App\Models\Company;
use App\Models\CompanyClient;
use App\Models\CompanyFinancialYear;
use App\Models\Country;
use App\Models\Currency;
use App\Models\User;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class CompanyController extends BaseController
{
    use ResponseTrait;
    protected $company;
    protected $country;
    protected $user;
    protected $currency;
    protected $client;
    protected $companyClient;
    protected $companyFinancialYear;

    public function __construct()
    {
        $this->company = new Company();
        $this->client = new Client();
        $this->companyClient = new CompanyClient();
        $this->country = new Country();
        $this->currency = new Currency();
        $this->user = new User();
        $this->companyFinancialYear = new CompanyFinancialYear();
    }

    public function index()
    {
        $request    = $this->request->getGet();
        $response   = $this->company->getResource($request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'company_name' => ['label' => 'company name', 'rules' => 'required|is_uniques[companies.company_name,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'trading_name' => ['label' => 'trading name', 'rules' => 'required'],
            'email' => ['label' => 'email', 'rules' => 'required|is_uniques[companies.email,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'contact_number' => ['label' => 'contact number', 'rules' => 'required'],
            'website' => ['label' => 'website', 'rules' => 'required|valid_url'],
            'registration_no' => ['label' => 'registration number', 'rules' => 'permit_empty|is_uniques[companies.registration_no,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'enroll_date' => ['label' => 'enroll date', 'rules' => 'required'],
            'tax_no' => ['label' => 'tax number', 'rules' => 'required|is_uniques[companies.tax_no,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'gst_vat_no' => ['label' => 'gst/vat no', 'rules' => 'required|is_uniques[companies.gst_vat_no,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'currency_id' => ['label' => 'currency id', 'rules' => 'required|numeric'],
            'address_1' => ['label' => 'address line 1', 'rules' => 'required'],
            'address_2' => ['label' => 'address line 2', 'rules' => 'permit_empty'],
            'country_id' => ['label' => 'country id', 'rules' => 'required|numeric'],
            'status' => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'company_name' => [
                'is_uniques' => 'The company name field must contain a unique value.'
            ],
            'registration_no' => [
                'is_uniques' => 'The registration number field must contain a unique value.'
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
                'trading_name'      => $request['trading_name'],
                'email'             => $request['email'],
                'contact_number'    => $request['contact_number'],
                'website'           => $request['website'],
                'registration_no'   => $request['registration_no'],
                'enroll_date'       => $request['enroll_date'],
                'tax_no'            => $request['tax_no'],
                'gst_vat_no'        => $request['gst_vat_no'],
                'currency_id'       => $request['currency_id'],
                'address_1'         => $request['address_1'],
                'address_2'         => $request['address_2'],
                'city'              => $request['city'],
                'state'             => $request['state'],
                'zip_code'          => $request['zip_code'],
                'country_id'        => $request['country_id'],
                'status'            => $request['status'],
                'created_by'        => $userData['id'],
                'created_at'        => Time::now()
            ];

            $this->company->save($newData);
            if (isset($request['client_id'])) {
                $companyClientArray = array();
                foreach ($request['client_id'] as $value) {
                    $companyClientArray[] = [
                        'company_id' => $this->company->getInsertID(),
                        'client_id' => $value,
                        'created_by' => $userData['id'],
                        'created_at' => Time::now()
                    ];
                }
                $this->companyClient->insertBatch($companyClientArray);
            }
            if (isset($request['financial_year_name'])) {
                $finacialYearData = [
                    'financial_year_name' => $request['financial_year_name'],
                    'financial_year_name' => $request['financial_year_name'],
                    'start_date' => $request['start_date'],
                    'end_date' => $request['end_date'],
                    'subscriber_id' => $userData['subscriber_id'],
                    'company_id' => $this->company->getInsertID(),
                    'is_default' => "Yes",
                    'created_by' => $userData['id'],
                    'created_at' => Time::now()
                ];
                $this->companyFinancialYear->save($finacialYearData);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_COMPANY]);
    }

    public function update()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'id'              => ['lable' => 'company id', 'rules' => 'required'],
            'company_name'    => ['label' => 'company name', 'rules' => 'required|is_uniques[companies.company_name,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'trading_name'    => ['label' => 'trading name', 'rules' => 'required'],
            'email'           => ['label' => 'email', 'rules' => 'required|is_uniques[companies.email,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'contact_number'  => ['label' => 'contact number', 'rules' => 'required'],
            'website'         => ['label' => 'website', 'rules' => 'required|valid_url'],
            'registration_no' => ['label' => 'registration number', 'rules' => 'permit_empty|is_uniques[companies.registration_no,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'enroll_date'     => ['label' => 'enroll date', 'rules' => 'required'],
            'tax_no'          => ['label' => 'tax number', 'rules' => 'required|is_uniques[companies.tax_no,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'gst_vat_no'      => ['label' => 'gst/vat no', 'rules' => 'required|is_uniques[companies.gst_vat_no,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'currency_id'     => ['label' => 'currency id', 'rules' => 'required|numeric'],
            'address_1'       => ['label' => 'address line 1', 'rules' => 'required'],
            'address_2'       => ['label' => 'address line 2', 'rules' => 'permit_empty'],
            'country_id'      => ['label' => 'country id', 'rules' => 'required|numeric'],
            'status'          => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'company_name' => [
                'is_uniques' => 'The company name field must contain a unique value.'
            ],
            'registration_no' => [
                'is_uniques' => 'The registration number field must contain a unique value.'
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
                'trading_name'      => $request['trading_name'],
                'email'             => $request['email'],
                'contact_number'    => $request['contact_number'],
                'website'           => $request['website'],
                'registration_no'   => $request['registration_no'],
                'enroll_date'       => $request['enroll_date'],
                'tax_no'            => $request['tax_no'],
                'gst_vat_no'        => $request['gst_vat_no'],
                'currency_id'       => $request['currency_id'],
                'address_1'         => $request['address_1'],
                'address_2'         => $request['address_2'],
                'city'              => $request['city'],
                'state'             => $request['state'],
                'zip_code'          => $request['zip_code'],
                'country_id'        => $request['country_id'],
                'status'            => $request['status'],
                'updated_by'        => getTokenUserID(),
                'updated_at'        => Time::now()
            ];

            $this->company->update($request['id'], $newData);

            $this->companyClient->where('company_id', $request['id'])->delete();
            if (isset($request['client_id'])) {
                $companyClientArray = array();
                foreach ($request['client_id'] as $value) {
                    $companyClientArray[] = [
                        'company_id' => $request['id'],
                        'client_id' => $value,
                        'created_by' => $userData['id'],
                        'created_at' => Time::now()
                    ];
                }
                $this->companyClient->insertBatch($companyClientArray);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_COMPANY]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $companyData = $this->company->getResource($request, false, true);
        if ($companyData) {
            $companyID = $request['id'];
            try {
                $this->db->transBegin();
                $this->company->delete($companyID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_COMPANY]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => COMPANY_NOT_FOUND], '404');
    }

    public function companyView()
    {

        global $dateFormat;
        $userData = getTokenUser();
        $subscriber_id = $userData['subscriber_id'];

        $countries = $this->country->select('id,country_name')->where('status', 'Active')->orderBy('country_name')->get()->getResultArray();
        $currencies = $this->currency->select('id,currency_name,currency_symbol,short_code')->where('status', 'Active')->orderBy('currency_name')->get()->getResultArray();
        $userData = getTokenUser();
        $clients   = $this->client->select('id,client_name,company_name')->where('subscriber_id', $userData['subscriber_id'])->orderBy('company_name')->get()->getResultArray();

        $response = [
            'countries' => $countries,
            'currencies' => $currencies,
            'clients' => $clients,
            'dateFormat' => $dateFormat
        ];

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }
}
