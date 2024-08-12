import {
    AddCompanyFinancialYear,
    CompanyFinancialYearList,
    DeleteCompanyFinancialYear,
    EditCompanyFinancialYear,
    ViewCompany
} from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function companyFinancialYearListApi(params) {
    return AxiosAuthServices.get(CompanyFinancialYearList, params);
}

export function addUpdateCompanyFinancialYearApi(data) {
    const formData = new FormData();
    formData.append('company_id', data.company_id);
    formData.append('financial_year_name', data.financial_year_name);
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('is_default', data.is_default);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditCompanyFinancialYear, formData);
    } else {
        return AxiosAuthServices.post(AddCompanyFinancialYear, formData);
    }
}

export function deleteCompanyFinancialYearApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteCompanyFinancialYear, formData);
}

export function viewCompanyApi() {
    return AxiosAuthServices.post(ViewCompany);
}
