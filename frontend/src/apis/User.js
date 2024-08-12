import { AddUser, DeleteUser, EditUser, UserList } from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function userListApi(params) {
    return AxiosAuthServices.get(UserList, params);
}

export function AddUpdateUserApi(data) {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('role_id', data.role_id);
    formData.append('status', data.status);
    data.company_id.map((i) => {
        formData.append('company_id[]', i.id);
    });
    formData.append('is_default', data.is_default);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditUser, formData);
    } else {
        formData.append('password', data.password);
        return AxiosAuthServices.post(AddUser, formData);
    }
}

export function deleteUserApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteUser, formData);
}
