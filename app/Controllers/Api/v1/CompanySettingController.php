<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\CompanySetting;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class CompanySettingController extends BaseController
{
    use ResponseTrait;
    public $selectedCompany;
    public $companySetting;
    public $user;

    public function __construct()
    {
        $this->selectedCompany = getSelectedCompany();
        $this->user = getTokenUserID();
        $this->companySetting = new CompanySetting();
    }
    public function create()
    {
        $request = $this->request->getPost();
        $companyLogo = $this->request->getFile('company_logo');
        $validationRules      = [
            'company_id'   => ['label' => 'company', 'rules' => 'is_unique[company_settings.company_id,id,{id}]'],
            // 'company_logo' => ['label' => 'company logo', 'rules' => 'uploaded[company_logo]|mime_in[company_logo,image/png,image/jpeg,image/jpg,image/webp]|max_size[company_logo,2048]'],
            'company_code' => ['label' => 'company code', 'rules' => 'required'],
            'invoice_prefix_date_format' => ['label' => 'invoice date format prefix', 'rules' => 'required'],
        ];

        if ($companyLogo && $companyLogo->getName() != null) {
            $validationRules      = [
                'company_logo' => ['label' => 'company logo', 'rules' => 'uploaded[company_logo]|mime_in[company_logo,image/png,image/jpeg,image/jpg]|max_size[company_logo,2048]'],
            ];
        }

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {

            if (isset($request['company_id']) && $companyLogo && $companyLogo->getName() != null) {
                $companySettingList = $this->companySetting->where('company_id', $request['company_id'])->get()->getRow();

                if (!empty($companySettingList) && $companySettingList->company_logo != '') {
                    if (file_exists(FCPATH . '/company_logo/' . $companySettingList->company_logo)) {

                        unlink(FCPATH . '/company_logo/' . $companySettingList->company_logo);
                    }
                }


                $fileName = time() . '_' . $request['company_code'] . "_" . $companyLogo->getRandomName();
                $companyLogo->move(FCPATH . '/company_logo/', $fileName);
            }

            $newData = [
                'company_id'                    => $request['company_id'],
                'company_code'                  => $request['company_code'],
                'invoice_number_type'           => $request['invoice_number_type'],
                'prefix_company_code'           => $request['prefix_company_code'],
                'prefix_company_year'           => $request['prefix_company_year'],
                'prefix_company_month'          => $request['prefix_company_month'],
                'invoice_prefix_date_format'    => $request['invoice_prefix_date_format'],
                'created_at'                    => Time::now()
            ];

            if ($companyLogo && $companyLogo->getSizeByUnit() > 0) {
                $newData['company_logo'] =  $fileName;
            }

            if (isset($request['id']) && $request['id'] != "") {
                $newData['updated_by'] = $this->user;
                $this->companySetting->update($request['id'], $newData);
            } else {
                $newData['created_by'] = $this->user;
                $this->companySetting->save($newData);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        if (isset($request['id'])) {
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_COMPANY_SETTING]);
        } else {
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_COMPANY_SETTING]);
        }
    }
    // public function selectCompanySetting()
    // {       
    //     $companySetting = $this->companySetting->getSelectedCompanySetting($this->selectedCompany->company_id);
    //     print_r($companySetting);exit;
    // }
}
