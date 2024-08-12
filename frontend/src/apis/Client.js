import { AddClient, ClientList, DeleteClient, EditClient, LifetimeIncomeList, ViewClient } from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function ClientListApi(params) {
    return AxiosAuthServices.get(ClientList, params);
}
export function ClientViewApi() {
    return AxiosAuthServices.post(ViewClient);
}

export function addUpdateClientApi(data) {
    const formData = new FormData();
    formData.append('client_name', data.client_name);
    formData.append('company_name', data.company_name);
    formData.append('enroll_date', data.enroll_date);
    formData.append('tax_no', data.tax_no);
    formData.append('gst_vat_no', data.gst_vat_no);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('address_1', data.address_1);
    formData.append('address_2', data.address_2);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('zip_code', data.zip_code);
    formData.append('country_id', data.country_id);
    formData.append('source_by', data.source_by);
    formData.append('source_from', data.source_from);
    formData.append('client_group_id', data.client_group_id);
    formData.append('is_bifurcated', data.is_bifurcated);
    formData.append('status', data.status);

    data.client_companies.map((res) => {
        formData.append('client_companies[]', res);
    });

    data.contribute_by.map((res) => {
        formData.append('contribute_by[]', res);
    });

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditClient, formData);
    } else {
        return AxiosAuthServices.post(AddClient, formData);
    }
}

export function deleteClientApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteClient, formData);
}

// ========== Lifetime Income ========== //

export function LifetimeIncomeListApi(params) {
    return AxiosAuthServices.get(LifetimeIncomeList, params);
}
