import {
    ClientStatement,
    ExpenseStatement,
    IncomeStatement,
    InitClients,
    InitIncomeStatement,
    InitReport,
    ProfitLossReport,
    YOYReport
} from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function InitReportApi() {
    return AxiosAuthServices.get(InitReport);
}
export function ProfitLossReportApi(data) {
    const formData = new FormData();
    formData.append('company_id', data.company_id);
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('type', data.type);
    return AxiosAuthServices.post(ProfitLossReport, formData);
}

// Income Statement
export function InitIncomeStatementApi() {
    return AxiosAuthServices.get(InitIncomeStatement);
}

// Client List
export function InitClientsApi() {
    return AxiosAuthServices.get(InitClients);
}

export function IncomeStatementApi(data) {
    const formData = new FormData();
    formData.append('company_id', data.company_id);
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('type', data.type);
    return AxiosAuthServices.post(IncomeStatement, formData);
}

export function ExpenseStatementApi(data) {
    const formData = new FormData();
    formData.append('company_id', data.company_id);
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('type', data.type);
    return AxiosAuthServices.post(ExpenseStatement, formData);
}

export function ClientStatementApi(data) {
    const formData = new FormData();
    formData.append('client_id', data.client_id);
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('type', data.type);
    return AxiosAuthServices.post(ClientStatement, formData);
}

export function YOYReportApi(data) {
    const formData = new FormData();
    formData.append('company_id', data.company_id);
    formData.append('type', data.type);
    data.financial_years.map((i) => {
        data.type ? formData.append('years[]', i) : formData.append('years[]', i.year_id);
    });
    return AxiosAuthServices.post(YOYReport, formData);
}
