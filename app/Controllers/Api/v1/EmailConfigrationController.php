<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\EmailConfigration;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class EmailConfigrationController extends BaseController
{
    use ResponseTrait;
    public $selectedCompany;
    public $emailConfigration;
    public $user;

    public function __construct()
    {
        $this->selectedCompany = getSelectedCompany();
        $this->user = getTokenUserID();
        $this->emailConfigration = new EmailConfigration();
    }
    public function create()
    {
        $request = $this->request->getPost();

        $validationRules      = [
            'company_id'   => ['label' => 'company', 'rules' => 'required|is_unique[email_configrations.company_id,id,{id}]'],
            'host'   => ['label' => 'company', 'rules' => 'required'],
            'port'   => ['label' => 'company', 'rules' => 'required'],
            'auth'   => ['label' => 'company', 'rules' => 'required|in_list[TRUE,FALSE]'],
            'ecryption'   => ['label' => 'company', 'rules' => 'required|in_list[NONE,TLS,SSL]'],
            'username'   => ['label' => 'company', 'rules' => 'required'],
            'password'   => ['label' => 'company', 'rules' => 'required'],
            'sender_email'   => ['label' => 'company', 'rules' => 'required'],
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;
        $this->db->transBegin();
        try {
            $newData = [
                'company_id' => $request['company_id'],
                'host' => $request['host'],
                'port' => $request['port'],
                'auth' => $request['auth'],
                'ecryption' => $request['ecryption'],
                'username' => $request['username'],
                'password' => $request['password'],
                'sender_email' => $request['sender_email'],
            ];

            if (isset($request['id']) && $request['id'] != "") {
                $newData['updated_by'] = $this->user;
                $newData['updated_at'] = Time::now();
                $this->emailConfigration->update($request['id'], $newData);
            } else {

                $newData['created_by'] = $this->user;
                $newData['created_at'] = Time::now();
                $this->emailConfigration->save($newData);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        if (isset($request['id'])) {
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_EMAILCONFIG]);
        } else {
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_EMAILCONFIG]);
        }
    }
}
