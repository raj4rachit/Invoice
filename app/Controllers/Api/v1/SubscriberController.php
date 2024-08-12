<?php

namespace App\Controllers\Api\v1;

use App\Controllers\BaseController;
use App\Models\Country;
use App\Models\Currency;
use App\Models\Subscriber;
use App\Models\User;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;

class SubscriberController extends BaseController
{
    use ResponseTrait;

    protected $subscriber;
    protected $user;
    protected $country;
    protected $currency;

    public function __construct()
    {
        $this->subscriber   = new Subscriber();
        $this->user         = new User();
        $this->country      = new Country();
        $this->currency     = new Currency();
    }

    public function index()
    {
        $request    = $this->request->getGet();
        $response   = $this->subscriber->getResource($request);
        $response['countryList'] = $this->country->select('id,country_name')->where('status', "Active")->findAll();
        $response['currencyList'] = $this->currency->select('id,currency_name,currency_symbol')->where('status', "Active")->findAll();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $request = $this->request->getPost();
        $logo = $this->request->getFile('logo');
        $validationRules      = [
            'official_name' => ['label' => 'official name', 'rules' => 'required|is_unique[subscribers.official_name]'],
            'first_name'    => ['label' => 'first name', 'rules' => 'required|string'],
            'last_name'     => ['label' => 'last name', 'rules' => 'required|string'],
            'email'         => ['label' => 'email', 'rules' => 'required|valid_email|is_unique[subscribers.email]'],
            'phone'         => ['label' => 'phone', 'rules' => 'required'],
            'address_1'     => ['label' => 'address line 1', 'rules' => 'required'],
            'address_2'     => ['label' => 'address line 2', 'rules' => 'permit_empty'],
            'city'          => ['label' => 'city', 'rules' => 'required|string'],
            'state'         => ['label' => 'state', 'rules' => 'required|string'],
            'zipcode'       => ['label' => 'zipcode', 'rules' => 'required'],
            'country_id'    => ['label' => 'country', 'rules' => 'required|numeric'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];


        if ($logo && $logo->getName() != null) {
            $validationRules      = [
                'logo' => ['label' => 'company logo', 'rules' => 'uploaded[logo]|mime_in[logo,image/png,image/jpeg,image/jpg]|max_size[logo,2048]'],
            ];
        }


        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {

            $fileName = null;
            if ($logo && $logo->getName() != null) {
                $fileName = time() . '_' . $logo->getRandomName();
                $logo->move(FCPATH . '/subscriber_logo/', $fileName);
            }

            $newData = [
                'official_name'         => $request['official_name'],
                'first_name'            => $request['first_name'],
                'last_name'             => $request['last_name'],
                'email'                 => $request['email'],
                'phone'                 => $request['phone'],
                'logo'                  => $fileName,
                'address_1'             => $request['address_1'],
                'address_2'             => $request['address_2'],
                'city'                  => $request['city'],
                'state'                 => $request['state'],
                'zipcode'               => $request['zipcode'],
                'country_id'            => $request['country_id'],
                'currency_id'           => $request['currency_id'],
                'financial_start_date'  => $request['financial_start_date'],
                'financial_end_date'    => $request['financial_end_date'],
                'status'                => $request['status'],
                'created_at'            => Time::now()
            ];
            $this->subscriber->save($newData);
            $tempPassword = uniqid();
            $userData = [
                'subscriber_id' => $this->subscriber->getInsertID(),
                'first_name'    => $request['first_name'],
                'last_name'     => $request['last_name'],
                'email'         => $request['email'],
                'password'      => $tempPassword,
                'phone'         => $request['phone'],
                'user_type'     => 'Subscriber',
                'role_id'       => 2,
                'created_by'    => getTokenUserID(),
                'status'        => "Active",
                'created_at'    => Time::now()
            ];
            $this->user->save($userData);
            $this->db->transCommit();
            //MSG For User Password
            $MSG = 'Below is the temporary password for login, please change it after login. <br />';
            $MSG .= '<b>Email </b>: ' . $request['email'] . "<br/>";
            $MSG .= '<b>Password </b>: ' . $tempPassword . "<br/><br/>";
            $MSG .= "<a href='" . site_url() . "'  style='padding:10px; background-color:#3fb0ac; text-decoration:none;color:white; border-radius: 10px;'> Login </a>";

            // Send Email
            $email = \Config\Services::email();
            $email->setFrom('admin@ibsystem.com', 'IB - System');
            $email->setTo($request['email'], $request['first_name'] . ' ' . $request['last_name']);
            $email->setSubject('Login Credentials | IB - System');
            $email->setMessage($MSG);
            $email->send();
            $email->printDebugger(['headers']);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_SUBSCRIBER]);
    }

    public function update()
    {
        $request = $this->request->getPost();
        $logo = $this->request->getFile('logo');

        $validationRules      = [
            'id'            => ['label' => 'subscriber id', 'rules' => 'required'],
            'official_name' => ['label' => 'official name', 'rules' => 'required|is_unique[subscribers.official_name,id,{id}]'],
            'first_name'    => ['label' => 'first name', 'rules' => 'required|string'],
            'last_name'     => ['label' => 'last name', 'rules' => 'required|string'],
            'email'         => ['label' => 'email', 'rules' => 'required|valid_email|is_unique[subscribers.email,id,{id}]'],
            'phone'         => ['label' => 'phone', 'rules' => 'required'],
            'address_1'     => ['label' => 'address line 1', 'rules' => 'required'],
            'address_2'     => ['label' => 'address line 2', 'rules' => 'permit_empty'],
            'city'          => ['label' => 'city', 'rules' => 'required|string'],
            'state'         => ['label' => 'state', 'rules' => 'required|string'],
            'zipcode'       => ['label' => 'zipcode', 'rules' => 'required'],
            'country_id'    => ['label' => 'country', 'rules' => 'required|numeric'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        if ($logo && $logo->getName() != null) {
            $validationRules      = [
                'logo' => ['label' => 'company logo', 'rules' => 'uploaded[logo]|mime_in[logo,image/png,image/jpeg,image/jpg]|max_size[logo,2048]'],
            ];
        }

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {

            $getSubscriberData = $this->subscriber->find($request['id']);
            $fileName = $getSubscriberData['logo'];
            if ($logo && $logo->getName() != null) {

                if ($getSubscriberData &&  $getSubscriberData['logo'] != '') {
                    if (file_exists(FCPATH . "/subscriber_logo/" . $getSubscriberData['logo'])) {
                        unlink(FCPATH . "/subscriber_logo/" . $getSubscriberData['logo']);
                    }
                }
                $fileName = time() . '_' . $logo->getRandomName();
                $logo->move(FCPATH . '/subscriber_logo/', $fileName);
            }

            $newData = [
                'official_name'         => $request['official_name'],
                'first_name'            => $request['first_name'],
                'last_name'             => $request['last_name'],
                'email'                 => $request['email'],
                'phone'                 => $request['phone'],
                'logo'                  => $fileName,
                'address_1'             => $request['address_1'],
                'address_2'             => $request['address_2'],
                'city'                  => $request['city'],
                'state'                 => $request['state'],
                'zipcode'               => $request['zipcode'],
                'country_id'            => $request['country_id'],
                'currency_id'           => $request['currency_id'],
                'financial_start_date'  => $request['financial_start_date'],
                'financial_end_date'    => $request['financial_end_date'],
                'status'                => $request['status'],
                'updated_at'            => Time::now()
            ];

            $oldUserData = $this->user->where('email', $request['email'])->first();
            $userData = [
                'subscriber_id' => $request['id'],
                'first_name'    => $request['first_name'],
                'last_name'     => $request['last_name'],
                'email'         => $request['email'],
                'phone'         => $request['phone'],
                'user_type'     => 'Subscriber',
                'role_id'       => 2,
                'updated_by'    => getTokenUserID(),
                'status'        => "Active",
                'updated_at'    => Time::now()
            ];
            $this->user->update($oldUserData['id'], $userData);

            $this->subscriber->update($request['id'], $newData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_SUBSCRIBER]);
    }
    public function delete()
    {
        $request        = $this->request->getPost();
        $subscriberData = $this->subscriber->getResource($request, false, true);
        if ($subscriberData) {
            $subscriberID = $request['id'];
            try {
                $this->db->transBegin();
                $this->subscriber->delete($subscriberID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_SUBSCRIBER]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => SUBSCRIBER_NOT_FOUND], '404');
    }
}
