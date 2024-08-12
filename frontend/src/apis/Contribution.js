import {
    AddContributor,
    AddEditContribution,
    ClientListByEmployee,
    ContributorList,
    DeleteContributor,
    EditContributor,
    InitContribution,
    SlabsByEmployee
} from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function ContributionInitApi(params) {
    return AxiosAuthServices.get(InitContribution, params);
}

export function ClientListByEmployeeApi(data) {
    const formData = new FormData();
    formData.append('employee_id', data.employee_id);
    return AxiosAuthServices.post(ClientListByEmployee, formData);
}

export function SlabByEmployeeApi(data) {
    const formData = new FormData();
    formData.append('employee_id', data.employee_id);
    return AxiosAuthServices.post(SlabsByEmployee, formData);
}

// export function AddUpdateContributionApi(data) {
//     const formData = new FormData();
//     formData.append('employee_id', data.employee_id);

//     data.contribution.map((i, idx) => {
//         i !== undefined &&
//             Object.keys(i).map((iv) => {
//                 i[iv].map((ivv) => {
//                     formData.append(`contribution[${idx}][${iv}][]`, ivv.id);
//                 });
//             });
//     });
//     return AxiosAuthServices.post(AddEditContribution, formData);
// }
export function AddUpdateContributionApi(data) {
    const formData = new FormData();
    formData.append('employee_id', data.employee_id);
    formData.append('roll_over_month', data.roll_over_month);
    formData.append('roll_over_bill', data.roll_over_bill);

    data.slabs.map((i, idx) => {
        formData.append(`slabs[${idx}][from]`, i.from);
        formData.append(`slabs[${idx}][to]`, i.to);
        formData.append(`slabs[${idx}][amount_type]`, i.amount_type);
        formData.append(`slabs[${idx}][amount]`, i.amount);
    });

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
    }
    return AxiosAuthServices.post(AddEditContribution, formData);
}

// =========== Contributor =========== //

export function ContributorListApi(params) {
    return AxiosAuthServices.get(ContributorList, params);
}

export function addUpdateContributorApi(data) {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditContributor, formData);
    } else {
        return AxiosAuthServices.post(AddContributor, formData);
    }
}

export function deleteContributorApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteContributor, formData);
}
