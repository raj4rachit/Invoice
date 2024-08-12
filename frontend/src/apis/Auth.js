import { ChangeCompany, ChangeCompanyFinancialYear, checkLogin, ForgotPassword, LogoutUser, ResetPassword } from 'store/ApiConstant';
import { AxiosAuthServices, AxiosServices } from './axios/axiosServices';

export function LoginApi(data) {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    return AxiosServices.post(checkLogin, formData);
}

export function LogoutApi() {
    return AxiosAuthServices.post(LogoutUser);
}

export function ForgotPasswordApi(data) {
    const formData = new FormData();
    formData.append('email', data.email);
    return AxiosServices.post(ForgotPassword, formData);
}

export function ChangePasswordApi(data) {
    const formData = new FormData();
    formData.append('token', data.token);
    formData.append('password', data.new_password);
    return AxiosServices.post(ResetPassword, formData);
}

export function ChangeCompanyApi() {
    return AxiosAuthServices.post(ChangeCompany);
}

export function CompanyFinancialYearListApi(data) {
    const formData = new FormData();
    formData.append('id', data);
    return AxiosAuthServices.post(ChangeCompanyFinancialYear, formData);
}
