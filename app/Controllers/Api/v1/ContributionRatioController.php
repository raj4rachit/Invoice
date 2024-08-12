<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\ContributionRatio;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;

class ContributionRatioController extends BaseController
{
    use ResponseTrait;
    protected $contributionRatio;

    public function __construct()
    {
        $this->contributionRatio = new ContributionRatio();
    }

    public function index()
    {
        $request    = $this->request->getGet();
        $response   = $this->contributionRatio->getResource($request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'title'     => ['label' => 'title', 'rules' => 'required|is_uniques[contribution_ratio.title,[subscriber_id.' . $userData['subscriber_id'] . ']]'],
            'status'    => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'title' => [
                'is_uniques' => 'The title field must contain a unique value.'
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
                'title'         => $request['title'],
                'ratio'         => $request['ratio'],
                'description'   => $request['description'],
                'status'        => $request['status'],
                'created_by'    => $userData['id'],
                'created_at'    => Time::now()
            ];

            $this->contributionRatio->save($newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_CONTRIBUTION_RATIO]);
    }


    public function update()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        $validationRules      = [
            'id'        => ['label' => 'id', 'rules' => 'required'],
            'title'     => ['label' => 'title', 'rules' => 'required|is_uniques[contribution_ratio.title,[subscriber_id.' . $userData['subscriber_id'] . '],[id.{id}]]'],
            'status'    => ['label' => 'status', 'rules' => 'required|in_list[Active,Inactive]'],
        ];

        $validationMessages = [
            'title' => [
                'is_uniques' => 'The title field must contain a unique value.'
            ]
        ];


        if (!$this->validate($validationRules, $validationMessages)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;
        try {
            $this->db->transBegin();
            $newData = [
                'title'         => $request['title'],
                'ratio'         => $request['ratio'],
                'description'   => $request['description'],
                'status'        => $request['status'],
                'updated_by'    => $userData['id'],
                'updated_at'    => Time::now()
            ];

            $this->contributionRatio->update($request['id'], $newData);
        } catch (Exception $err) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_CONTRIBUTION_RATIO]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $contributionRatio = $this->contributionRatio->find($request['id']);
        if ($contributionRatio && $request['id'] !== '') {
            $contributionRatioID = $contributionRatio['id'];
            try {
                $this->db->transBegin();
                $this->contributionRatio->delete($contributionRatioID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_CONTRIBUTION_RATIO]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => CONTRIBUTION_RATIO_NOT_FOUND], '404');
    }
}
