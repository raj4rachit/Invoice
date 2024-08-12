import { AddExpenses, DeleteExpenses, EditExpenses, ExpensesList, SubcategoryList } from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function ExpensesListApi(params) {
    return AxiosAuthServices.get(ExpensesList, params);
}

export function AddExpensesApi(data) {
    const formData = new FormData();
    console.log(data);
    data.expenses.map((i, idx) => {
        formData.append(`expenses[${idx}][company_id]`, data.company_id);
        formData.append(`expenses[${idx}][category_id]`, i.category_id);
        formData.append(`expenses[${idx}][subcategory_id]`, i.subcategory_id);
        formData.append(`expenses[${idx}][title]`, i.expenses_title);
        formData.append(`expenses[${idx}][date]`, i.date);
        formData.append(`expenses[${idx}][amount]`, i.amount);
    });
    return AxiosAuthServices.post(AddExpenses, formData);
}

export function AddUpdateExpensesApi(data) {
    const formData = new FormData();
    formData.append('company_id', data.company_id);
    formData.append('category_id', data.category_id);
    formData.append('subcategory_id', data.subcategory_id);
    formData.append('title', data.expenses_title);
    formData.append('date', data.date);
    formData.append('amount', data.amount);
    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditExpenses, formData);
    }
}

export function ExpensesDeleteApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteExpenses, formData);
}

export function SubcategoryListApi(params) {
    return AxiosAuthServices.get(SubcategoryList, params);
}
