<?php

namespace App\Models;

use CodeIgniter\Model;

class PermissionGroup extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'permission_group';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['name', 'description', 'permissions', 'restrictions', 'subscriber_id', 'created_at', 'updated_at'];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    const ORDERABLE = [
        0 => 'name',
    ];

    public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    {
        $userData = getTokenUser();
        $restrictionModel = new Restriction();

        $builder = $this->db->table('permission_group');

        (isset($filters['id']) && $filters['id'] != '') ? $builder->where('id', $filters['id'])
            : $builder->where('subscriber_id', $userData['subscriber_id']);

        if (isset($filters['search']) && $filters['search'] != '') {
            $search = $this->db->escapeString((string) $filters['search']);
            $builder->like('name', $search);
        }

        if ((isset($filters['displayLength']) && isset($filters['displayStart'])) && $filters['displayLength'] != '' && $filters['displayStart'] != '' && $filters['displayLength'] != '-1') {
            $builder->limit($filters['displayLength'], $filters['displayStart']);
        }

        if (isset($filters['orderDir']) &&  isset($filters['orderColumn'])) {
            $order  = self::ORDERABLE[$filters['orderColumn']];
            $dir    = $filters['orderDir'];
            $builder->orderBy($order, $dir);
        }

        $query = $builder->get();

        if ($returnSingleRow) {
            $results = $query->getRowArray();
            $PermissionIDs = explode(',', $results['permissions'] ?? '');
            $RestrictionsIDs = explode(',', $results['restrictions'] ?? '');
            $results['permissions'] = $PermissionIDs;
            $results['restrictions'] = $RestrictionsIDs;
            $permissionList = $this->getPermissionsByID($PermissionIDs);
            $restrictionList = $restrictionModel->getRestrictionsByIds($RestrictionsIDs);
            $results['permissionList'] = $this->getPermissionRestrictions($permissionList, $restrictionList);
        } else {
            (isset($filters['id']) && $filters['id'] != '') ? $builder->where('id', $filters['id'])
                : $builder->where('subscriber_id', $userData['subscriber_id']);
            $results['totalCount'] = (int) $builder->countAllResults();

            if ($returnAssoc) {
                $results['data'] = [];
                foreach ($query->getResultArray() as $roleDetails) {
                    $PermissionIDs = explode(',', $roleDetails['permissions'] ?? '');
                    $roleDetails['permissions'] = $PermissionIDs;
                    $permissionList = $this->getPermissionsByID($PermissionIDs);
                    $results['data'][$roleDetails['id']] = $roleDetails;
                }
            } else {
                $results['data'] = [];
                foreach ($query->getResultArray() as $roleDetails) {
                    $PermissionIDs = explode(',', $roleDetails['permissions'] ?? '');
                    $permissionList = $this->getPermissionsByID($PermissionIDs);
                    $roleDetails['permissions']  = array_column($permissionList, 'name');
                    $results['data'][] = $roleDetails;
                }
            }
        }

        return $results;
    }

    // public function getResource($filters = array(), $returnAssoc = false, $returnSingleRow = false)
    // {
    //     $restrictionModel = new Restriction();

    //     $builder = $this->db->table('permission_group');

    //     if (isset($filters['id']) && $filters['id'] != '') $builder->where('id', $filters['id']);

    //     if (isset($filters['search']) && $filters['search'] != '') {
    //         $search = $this->db->escapeString((string) $filters['search']);
    //         $builder->like('name', $search);
    //     }

    //     if ((isset($filters['displayLength']) && isset($filters['displayStart'])) && $filters['displayLength'] != '' && $filters['displayStart'] != '' && $filters['displayLength'] != '-1') {
    //         $builder->limit($filters['displayLength'], $filters['displayStart']);
    //     }

    //     if (isset($filters['orderDir']) &&  isset($filters['orderColumn'])) {
    //         $order  = self::ORDERABLE[$filters['orderColumn']];
    //         $dir    = $filters['orderDir'];
    //         $builder->orderBy($order, $dir);
    //     }

    //     $query = $builder->get();

    //     if ($returnSingleRow) {
    //         $results = $query->getRowArray();
    //         $PermissionIDs = explode(',', $results['permissions'] ?? '');
    //         $RestrictionsIDs = explode(',', $results['restrictions'] ?? '');
    //         $results['permissions'] = $PermissionIDs;
    //         $results['restrictions'] = $RestrictionsIDs;
    //         $permissionList = $this->getPermissionsByID($PermissionIDs);
    //         $restrictionList = $restrictionModel->getRestrictionsByIds($RestrictionsIDs);
    //         $results['permissionList'] = $this->getPermissionRestrictions($permissionList, $restrictionList);
    //     } else {
    //         $results['totalCount'] = (int) $builder->countAllResults();

    //         if ($returnAssoc) {
    //             $results['data'] = [];
    //             foreach ($query->getResultArray() as $roleDetails) {
    //                 $PermissionIDs = explode(',', $roleDetails['permissions'] ?? '');
    //                 $RestrictionsIDs = explode(',', $roleDetails['restrictions'] ?? '');
    //                 $roleDetails['permissions'] = $PermissionIDs;
    //                 $roleDetails['restrictions'] = $RestrictionsIDs;
    //                 $permissionList = $this->getPermissionsByID($PermissionIDs);
    //                 $restrictionList = $restrictionModel->getRestrictionsByIds($RestrictionsIDs);
    //                 $roleDetails['permissionList'] = $this->getPermissionRestrictions($permissionList, $restrictionList);
    //                 $results['data'][$roleDetails['id']] = $roleDetails;
    //             }
    //         } else {
    //             $results['data'] = [];
    //             foreach ($query->getResultArray() as $roleDetails) {
    //                 $PermissionIDs = explode(',', $roleDetails['permissions'] ?? '');
    //                 $RestrictionsIDs = explode(',', $roleDetails['restrictions'] ?? '');
    //                 $roleDetails['permissions'] = $PermissionIDs;
    //                 $roleDetails['restrictions'] = $RestrictionsIDs;
    //                 $permissionList = $this->getPermissionsByID($PermissionIDs);
    //                 $restrictionList = $restrictionModel->getRestrictionsByIds($RestrictionsIDs);
    //                 $roleDetails['permissionList'] = $this->getPermissionRestrictions($permissionList, $restrictionList);
    //                 $results['data'][] = $roleDetails;
    //             }
    //         }
    //     }

    //     return $results;
    // }

    public function getPermissionRestrictions($permission, $restrictions)
    {

        $data = [];
        foreach ($permission as $value) :
            $id = $value['id'];
            $v['id'] = $id;
            $v['name'] = $value['name'];
            $filterRes = array_filter($restrictions, function ($item) use ($id) {
                return $item['permission_id'] === $id ?? [];
            });
            $newRes = [];
            foreach ($filterRes as $r) {
                $newRes[] = $r;
            }
            $v['restriction'] = $newRes;

            $data[] = $v;
        endforeach;

        return $data;
    }

    public function getPermissionsByID(array $Ids)
    {
        $builder = $this->db->table('permissions');
        $builder->whereIn('id', $Ids);
        $result = $builder->get()->getResultArray();
        return $result;
    }

    /**
     * This function use for get only Permission group
     * Get Permission with out any filters 
     * This function return array and object
     * @param integer $Id
     * @param boolean $returnSingleRow
     * @return mixed
     */
    public function getLists($Id = 0, $returnSingleRow = false)
    {
        $userData = getTokenUser();

        $builder = $this->builder();
        $builder->select('id,name');
        $builder->where('subscriber_id', $userData['subscriber_id']);
        if ($returnSingleRow) {
            $builder->where('id', $Id);
            return $builder->get()->getRowArray();
        }
        $builder->orderBy('name');
        return $builder->get()->getResultArray();
    }
}
