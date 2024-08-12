<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\SourcePlatform ;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class SourcePlatformController extends BaseController
{
    use ResponseTrait;
    protected $sourcePlatform;

    public function __construct()
    {
        $this->sourcePlatform = new SourcePlatform();
    }

    public function index()
    {
        $request    = $this->request->getGet();
        $response   = $this->sourcePlatform->getResource($request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'platform_name' => ['label' => 'source platform name', 'rules' => 'required|is_uniques[source_platforms.platform_name,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'platform_name' => [
                'is_uniques' => 'The source platform name field must contain a unique value.'
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
                'platform_name' => $request['platform_name'],
                'status'        => $request['status'],
                'created_by'    => $userData['id'],
                'created_at'    => Time::now()
            ];

            $this->sourcePlatform->save($newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_SOURCE_PLATFORM]);
    }

    public function update()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'platform_name' => ['label' => 'source platform name', 'rules' => 'required|is_uniques[source_platforms.platform_name,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'status'        => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'payment_source_name' => [
                'is_uniques' => 'The payment source name field must contain a unique value.'
            ]
        ];

        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        try {
            $this->db->transBegin();
            $newData = [
                'platform_name' => $request['platform_name'],
                'status'        => $request['status'],
                'updated_by'    => $userData['id'],
                'updated_at'    => Time::now()
            ];

            $this->sourcePlatform->update($request['id'], $newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_SOURCE_PLATFORM]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $sourcePlatform = $this->sourcePlatform->getResource($request, false, true);
        if ($sourcePlatform && $request['id'] !== '') {
            $sourcePlatformID = $sourcePlatform['id'];
            try {
                $this->db->transBegin();
                $this->sourcePlatform->delete($sourcePlatformID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_SOURCE_PLATFORM]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => SOURCE_PLATFORM_NOT_FOUND], '404');
    }
}
