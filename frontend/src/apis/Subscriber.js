import { AddSubscriber, DeleteSubscriber, EditSubscriber, SubscriberList } from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function subscriberListApi(params) {
    return AxiosAuthServices.get(SubscriberList, params);
}

export function addUpdateSubscriberApi(data) {
    const formData = new FormData();
    formData.append('official_name', data.official_name);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('logo', data.logo);
    formData.append('address_1', data.address_1);
    formData.append('address_2', data.address_2);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('zipcode', data.zipcode);
    formData.append('country_id', data.country_id);
    formData.append('currency_id', data.currency_id);
    formData.append('financial_start_date', data.start_date);
    formData.append('financial_end_date', data.end_date);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditSubscriber, formData);
    } else {
        return AxiosAuthServices.post(AddSubscriber, formData);
    }
}

export function deleteSubscriberApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteSubscriber, formData);
}
