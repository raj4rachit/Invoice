import { AddRestriction, DeleteRestriction, EditRestriction, RestrictionList } from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function restrictionListApi(params) {
    return AxiosAuthServices.get(RestrictionList, params);
}

export function addUpdateRestrictionApi(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('description', data.description);
    formData.append('permission_id', data.permission_id);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditRestriction, formData);
    } else {
        return AxiosAuthServices.post(AddRestriction, formData);
    }
}

export function deleteRestrictionApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteRestriction, formData);
}
