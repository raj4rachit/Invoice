<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\DocumentType;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class DocumentTypeController extends BaseController
{

    use ResponseTrait;

    protected $documentType;

    public function __construct()
    {
        $this->documentType = new DocumentType();
    }

    public function index()
    {
        $loginUser  = getTokenUser();
        $request    = $this->request->getGet();
        $request['subscriber_id'] = $loginUser['subscriber_id'];

        $response = $this->documentType->getResources($request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    # Create Document Type Function
    public function create()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'name' => ['label' => 'name', 'rules' => 'required|is_uniques[document_types.name,[subscriber_id.' . $userData['subscriber_id'] . ']]']
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'subscriber_id' => $userData['subscriber_id'],
                'name' => $request['name'],
                'status' => $request['status'],
                'created_at' => Time::now()
            ];
            $this->documentType->insert($newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_DOCUMENT_TYPE]);
    }

    # Update Document Type Function
    public function update()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'name' => ['label' => 'name', 'rules' => 'required|is_uniques[document_types.name,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]']
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            $newData = [
                'name' => $request['name'],
                'status' => $request['status'],
                'updated_at' => Time::now()
            ];
            $this->documentType->update($request['id'], $newData);
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_DOCUMENT_TYPE]);
    }

    # Delete Document Type Function
    public function delete()
    {
        $request = $this->request->getPost();
        $documentTypeData = $this->documentType->getResources($request, true);
        if ($documentTypeData) {
            $documentTypeID = $request['id'];
            try {
                $this->db->transBegin();
                $this->documentType->delete($documentTypeID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_DOCUMENT_TYPE]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => DOCUMENT_TYPE_NOT_FOUND], '404');
    }
}
