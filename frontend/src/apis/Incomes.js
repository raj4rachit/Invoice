import { AxiosAuthServices } from './axios/axiosServices';
import { AddIncomes, DeleteIncomes, EditIncomes, IncomesList, IncomesSubcategoryList } from 'store/ApiConstant';

export function IncomesListApi(params) {
    return AxiosAuthServices.get(IncomesList, params);
}

export function AddIncomesApi(data) {
    const formData = new FormData();
    console.log(data);
    data.incomes.map((i, idx) => {
        formData.append(`incomes[${idx}][company_id]`, data.company_id);
        formData.append(`incomes[${idx}][category_id]`, i.category_id);
        formData.append(`incomes[${idx}][subcategory_id]`, i.subcategory_id);
        formData.append(`incomes[${idx}][title]`, i.incomes_title);
        formData.append(`incomes[${idx}][date]`, i.date);
        formData.append(`incomes[${idx}][amount]`, i.amount);
    });
    return AxiosAuthServices.post(AddIncomes, formData);
}

export function AddUpdateIncomesApi(data) {
    const formData = new FormData();
    formData.append('company_id', data.company_id);
    formData.append('category_id', data.category_id);
    formData.append('subcategory_id', data.subcategory_id);
    formData.append('title', data.incomes_title);
    formData.append('date', data.date);
    formData.append('amount', data.amount);
    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditIncomes, formData);
    }
}

export function IncomesDeleteApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteIncomes, formData);
}

export function SubcategoryListApi(params) {
    return AxiosAuthServices.get(IncomesSubcategoryList, params);
}
