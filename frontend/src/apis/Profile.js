import { ChangePassword } from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function changePasswordApi(data) {
    const formData = new FormData();
    formData.append('current_password', data.current_password);
    formData.append('password', data.new_password);
    return AxiosAuthServices.post(ChangePassword, formData);
}
