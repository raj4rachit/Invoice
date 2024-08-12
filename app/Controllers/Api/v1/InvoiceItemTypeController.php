<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\InvoiceItemType;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class InvoiceItemTypeController extends BaseController
{

    use ResponseTrait;
    protected $itemType;

    public function __construct()
    {
        $this->itemType = new InvoiceItemType();
    }

    public function index()
    {
        $request    = $this->request->getGet();
        $response   = $this->itemType->getResource($request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $userData = getTokenUser();
        $request    = $this->request->getPost();

        $validationRules      = [
            'item_type_name'   => ['label' => 'item type name', 'rules' => 'required|is_uniques[invoice_item_types.item_type_name,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'status'                => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'item_type_name' => [
                'is_uniques' => 'The item type name field must contain a unique value.'
            ]
        ];

        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        try {
            $this->db->transBegin();
            $newData = [
                'subscriber_id'     => $userData['subscriber_id'],
                'item_type_name'    => $request['item_type_name'],
                'is_date'           => $request['is_date'],
                'date_type'         => $request['date_type'],
                'date_no'           => $request['date_no'] === '' ? null : $request['date_no'],
                'status'            => $request['status'],
                'created_by'        => $userData['id'],
                'created_at'        => Time::now()
            ];

            $this->itemType->save($newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_ITEM_TYPE]);
    }

    public function update()
    {
        $userData = getTokenUser();
        $request    = $this->request->getPost();

        $validationRules      = [
            'item_type_name'   => ['label' => 'item type name', 'rules' => 'required|is_uniques[invoice_item_types.item_type_name,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'status'                => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'item_type_name' => [
                'is_uniques' => 'The item type name field must contain a unique value.'
            ]
        ];

        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        try {
            $this->db->transBegin();
            $newData = [
                'item_type_name'    => $request['item_type_name'],
                'is_date'           => $request['is_date'],
                'date_type'         => $request['date_type'],
                'date_no'           => $request['date_no'] === '' ? null : $request['date_no'],
                'status'            => $request['status'],
                'updated_by'        => $userData['id'],
                'updated_at'        => Time::now()
            ];

            $this->itemType->update($request['id'], $newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_ITEM_TYPE]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $itemType = $this->itemType->getResource($request, false, true);
        if ($itemType && $request['id'] !== '') {
            $itemTypeID = $itemType['id'];
            try {
                $this->db->transBegin();
                $this->itemType->delete($itemTypeID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_ITEM_TYPE]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => ITEM_TYPE_NOT_FOUND], '404');
    }
}
