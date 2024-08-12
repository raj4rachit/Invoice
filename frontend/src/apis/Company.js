import {
    AddCompany,
    CompanyList,
    DeleteCompany,
    EditCompany,
    UpdateCompanySetting,
    UpdateEmailConfiguration,
    ViewCompany
} from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function companyListApi(params) {
    return AxiosAuthServices.get(CompanyList, params);
}

export function addUpdateCompanyApi(data) {
    const formData = new FormData();
    formData.append('company_name', data.company_name);
    formData.append('trading_name', data.trading_name);
    formData.append('email', data.email);
    formData.append('contact_number', data.contact_number);
    formData.append('website', data.website);
    formData.append('registration_no', data.registration_no);
    formData.append('enroll_date', data.enroll_date);
    formData.append('tax_no', data.tax_no);
    formData.append('gst_vat_no', data.gst_vat_no);
    formData.append('currency_id', data.currency_id);
    formData.append('address_1', data.address_1);
    formData.append('address_2', data.address_2);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('zip_code', data.zip_code);
    formData.append('country_id', data.country_id);
    data.client_id.map((i) => {
        formData.append('client_id[]', i.id);
    });
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditCompany, formData);
    } else {
        return AxiosAuthServices.post(AddCompany, formData);
    }
}

export function deleteCompanyApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteCompany, formData);
}

export function viewCompanyApi() {
    return AxiosAuthServices.post(ViewCompany);
}

export function updateCompanySettingApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('company_id', data.company_id);
    formData.append('company_logo', data.company_logo);
    formData.append('company_code', data.company_code);
    formData.append('invoice_number_type', data.invoice_number_type);
    formData.append('prefix_company_code', data.prefix_company_code);
    formData.append('prefix_company_year', data.prefix_company_year);
    formData.append('prefix_company_month', data.prefix_company_month);
    formData.append('invoice_prefix_date_format', data.invoice_prefix_date_format);

    return AxiosAuthServices.post(UpdateCompanySetting, formData);
}

// ========== Email Configuration ========= //
export function updateEmailConfigurationApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('company_id', data.company_id);
    formData.append('host', data.host);
    formData.append('port', data.port);
    formData.append('auth', data.auth);
    formData.append('ecryption', data.authType);
    formData.append('username', data.userName);
    formData.append('password', data.password);
    formData.append('sender_email', data.senderEmail);

    return AxiosAuthServices.post(UpdateEmailConfiguration, formData);
}
