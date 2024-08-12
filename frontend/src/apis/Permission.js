import {
    AddPermissionGroup,
    DeletePermissionGroup,
    PermissionGroupList,
    PermissionList,
    UpdatePermissionGroup,
    ViewPermissionGroup
} from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function permissionListApi(params) {
    return AxiosAuthServices.get(PermissionList, params);
}

// ====================== Permission Group ====================== //

export function permissionGroupListApi(params) {
    return AxiosAuthServices.get(PermissionGroupList, params);
}

export function addUpdatePermissionGroupApi(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    data.permissions.map((item) => {
        formData.append('permissions[]', item);
    });

    data.restrictions.map((it) => {
        it.restriction.map((res) => {
            formData.append(`restrictions[]`, res.id);
        });
    });

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(UpdatePermissionGroup, formData);
    } else {
        return AxiosAuthServices.post(AddPermissionGroup, formData);
    }
}

export function deletePermissionGroupApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeletePermissionGroup, formData);
}

export function viewPermissionGroupApi(data) {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('id', data.id);
    return AxiosAuthServices.post(ViewPermissionGroup, formData);
}
