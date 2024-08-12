<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\PaymentSource;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class PaymentSourceController extends BaseController
{
    use ResponseTrait;
    protected $paymentSource;

    public function __construct()
    {
        $this->paymentSource = new PaymentSource();
    }

    public function index()
    {
        $request    = $this->request->getGet();
        $response   = $this->paymentSource->getResource($request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'payment_source_name'   => ['label' => 'payment source name', 'rules' => 'required|is_uniques[payment_sources.payment_source_name,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'status'                => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
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
                'subscriber_id'         => $userData['subscriber_id'],
                'payment_source_name'   => $request['payment_source_name'],
                'status'                => $request['status'],
                'created_by'            => $userData['id'],
                'created_at'            => Time::now()
            ];

            $this->paymentSource->save($newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_PAYMENT_SOURCE]);
    }

    public function update()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'id'                    => ['label' => 'payment source id', 'rules' => 'required'],
            'payment_source_name'   => ['label' => 'payment source name', 'rules' => 'required|is_uniques[payment_sources.payment_source_name,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'status'                => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
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
                'payment_source_name'   => $request['payment_source_name'],
                'status'                => $request['status'],
                'updated_by'            => $userData['id'],
                'updated_at'            => Time::now()
            ];

            $this->paymentSource->update($request['id'], $newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_PAYMENT_SOURCE]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $paymentSource = $this->paymentSource->getResource($request, false, true);
        if ($paymentSource && $request['id'] !== '') {
            $paymentSourceID = $paymentSource['id'];
            try {
                $this->db->transBegin();
                $this->paymentSource->delete($paymentSourceID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_PAYMENT_SOURCE]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => PAYMENT_SOURCE_NOT_FOUND], '404');
    }
}
