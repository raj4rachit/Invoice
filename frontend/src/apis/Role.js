import { AddRole, DeleteRole, EditRole, RoleList } from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function roleListApi(params) {
    return AxiosAuthServices.get(RoleList, params);
}

export function addUpdateRoleApi(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('group_id', data.permission_group);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditRole, formData);
    } else {
        return AxiosAuthServices.post(AddRole, formData);
    }
}

export function deleteRoleApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteRole, formData);
}
