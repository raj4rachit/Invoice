import {
    AddClientGroup,
    AddCompanyBank,
    AddContributionRatio,
    AddCountry,
    AddCountryTax,
    AddCurrency,
    AddDocumentType,
    AddExpenseCategory,
    AddIncomeCategory,
    AddInvoiceItemType,
    AddInvoiceTerm,
    AddPaymentSource,
    AddSourcePlatform,
    ClientGroupList,
    CompanyBankList,
    ContributionRatioList,
    CountryList,
    CountryTaxList,
    CurrencyList,
    DeleteClientGroup,
    DeleteCompanyBank,
    DeleteContributionRatio,
    DeleteCountryTax,
    DeleteDocumentType,
    DeleteExpenseCategory,
    DeleteIncomeCategory,
    DeleteInvoiceItemType,
    DeleteInvoiceTerm,
    DeletePaymentSource,
    DeleteSourcePlatform,
    DocumentTypeList,
    EditClientGroup,
    EditCompanyBank,
    EditContributionRatio,
    EditCountry,
    EditCountryTax,
    EditCurrency,
    EditDocumentType,
    EditExpenseCategory,
    EditIncomeCategory,
    EditInvoiceItemType,
    EditInvoiceTerm,
    EditPaymentSource,
    EditSourcePlatform,
    ExpenseCategoryList,
    IncomeCategoryList,
    InvoiceItemTypeList,
    InvoiceTermList,
    PaymentSourceList,
    SourcePlatformList
} from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

// ========== Currency ========== //

export function currencyListApi(params) {
    return AxiosAuthServices.get(CurrencyList, params);
}

export function AddUpdateCurrencyApi(data) {
    const formData = new FormData();
    formData.append('currency_name', data.currency_name);
    formData.append('currency_symbol', data.currency_symbol);
    formData.append('short_code', data.short_code);
    formData.append('locale', data.locale);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditCurrency, formData);
    } else {
        return AxiosAuthServices.post(AddCurrency, formData);
    }
}

// ========== Country ========== //

export function countryListApi(params) {
    return AxiosAuthServices.get(CountryList, params);
}

export function AddUpdateCountryApi(data) {
    const formData = new FormData();
    formData.append('country_name', data.country_name);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditCountry, formData);
    } else {
        return AxiosAuthServices.post(AddCountry, formData);
    }
}

// ========== Country Tax ========== //

export function CountryTaxListApi(params) {
    return AxiosAuthServices.get(CountryTaxList, params);
}

export function addUpdateCountryTaxApi(data) {
    const formData = new FormData();
    formData.append('country_id', data.country_id);
    formData.append('tax_name', data.tax_name);
    formData.append('rate', data.rate);
    formData.append('is_percentage', data.is_percentage);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditCountryTax, formData);
    } else {
        return AxiosAuthServices.post(AddCountryTax, formData);
    }
}

export function deleteCountryTaxApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteCountryTax, formData);
}

// ========== payment source ========== //

export function PaymentSourceListApi(params) {
    return AxiosAuthServices.get(PaymentSourceList, params);
}

export function addUpdatePaymentSourceApi(data) {
    const formData = new FormData();
    formData.append('payment_source_name', data.payment_source_name);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditPaymentSource, formData);
    } else {
        return AxiosAuthServices.post(AddPaymentSource, formData);
    }
}

export function deletePaymentSourceApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeletePaymentSource, formData);
}

// ========== Invoice Item Type ========== //

export function InvoiceItemTypeListApi(params) {
    return AxiosAuthServices.get(InvoiceItemTypeList, params);
}

export function addUpdateInvoiceItemTypeListApi(data) {
    const formData = new FormData();
    formData.append('item_type_name', data.item_type_name);
    formData.append('is_date', data.is_date);
    formData.append('date_type', data.date_type);
    formData.append('date_no', data.date_no);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditInvoiceItemType, formData);
    } else {
        return AxiosAuthServices.post(AddInvoiceItemType, formData);
    }
}

export function deleteInvoiceItemTypeApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteInvoiceItemType, formData);
}

// ========== Source Platform ========== //
export function sourcePlatformListApi(params) {
    return AxiosAuthServices.get(SourcePlatformList, params);
}

export function addUpdateSourcePlatformApi(data) {
    const formData = new FormData();
    formData.append('platform_name', data.platform_name);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditSourcePlatform, formData);
    } else {
        return AxiosAuthServices.post(AddSourcePlatform, formData);
    }
}

export function deleteSourcePlatformApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteSourcePlatform, formData);
}

// ========== Client Group ========== //
export function ClientGroupListApi(params) {
    return AxiosAuthServices.get(ClientGroupList, params);
}

export function addUpdateClientGroupApi(data) {
    const formData = new FormData();
    formData.append('group_name', data.group_name);
    formData.append('description', data.description);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditClientGroup, formData);
    } else {
        return AxiosAuthServices.post(AddClientGroup, formData);
    }
}

export function deleteClientGroupApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteClientGroup, formData);
}

// ========== Invoice Term ========== //
export function InvoiceTermListApi(params) {
    return AxiosAuthServices.get(InvoiceTermList, params);
}

export function addUpdateInvoiceTermApi(data) {
    const formData = new FormData();
    formData.append('company_id', data.company_id);
    formData.append('title', data.name);
    formData.append('description', data.description);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditInvoiceTerm, formData);
    } else {
        return AxiosAuthServices.post(AddInvoiceTerm, formData);
    }
}

export function deleteInvoiceTermApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteInvoiceTerm, formData);
}

// ========== Contribution Ratio ========== //
export function ContributionRatioListApi(params) {
    return AxiosAuthServices.get(ContributionRatioList, params);
}

export function addUpdateContributionRatioApi(data) {
    const formData = new FormData();
    formData.append('title', data.ratio_name);
    formData.append('ratio', data.ratio);
    formData.append('description', data.description);
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditContributionRatio, formData);
    } else {
        return AxiosAuthServices.post(AddContributionRatio, formData);
    }
}

export function deleteContributionRatioApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteContributionRatio, formData);
}

// ========== Income Category ========== //
export function IncomeCategoryListApi(params) {
    return AxiosAuthServices.get(IncomeCategoryList, params);
}

export function AddUpdateIncomeCategoryApi(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.parent_id != '') {
        formData.append('parent_id', data.parent_id);
    } else {
        formData.append('parent_id', 0);
    }
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditIncomeCategory, formData);
    } else {
        return AxiosAuthServices.post(AddIncomeCategory, formData);
    }
}

export function DeleteIncomeCategoryApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteIncomeCategory, formData);
}

// ========== Expense Category ========== //
export function ExpenseCategoryListApi(params) {
    return AxiosAuthServices.get(ExpenseCategoryList, params);
}

export function AddUpdateExpenseCategoryApi(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.parent_id != '') {
        formData.append('parent_id', data.parent_id);
    } else {
        formData.append('parent_id', 0);
    }
    formData.append('status', data.status);

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditExpenseCategory, formData);
    } else {
        return AxiosAuthServices.post(AddExpenseCategory, formData);
    }
}

export function DeleteExpenseCategoryApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteExpenseCategory, formData);
}

// ==================== Company Bank Details ==================== //

export function CompanyBankListApi(params) {
    return AxiosAuthServices.get(CompanyBankList, params);
}

export function AddUpdateCompanyBank(data) {
    const formData = new FormData();
    formData.append('company_id', data.company_id);
    formData.append('bank_name', data.bank_name);
    formData.append('bank_detail_name', data.bank_details_name);
    formData.append('account_number', data.account_number);
    formData.append('account_name', data.account_name);

    data.extraFiled.map((i) => {
        formData.append(`field[${i.extraFiled}]`, i.extraValue);
    });

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditCompanyBank, formData);
    } else {
        return AxiosAuthServices.post(AddCompanyBank, formData);
    }
}

export function DeleteCompanyBankApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteCompanyBank, formData);
}

// ==================== Document Type ==================== //

export function DocumentTypeListApi(params) {
    return AxiosAuthServices.get(DocumentTypeList, params);
}

export function AddUpdateDocumentType(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('status', data.status);
    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditDocumentType, formData);
    } else {
        return AxiosAuthServices.post(AddDocumentType, formData);
    }
}

export function DeleteDocumentTypeApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteDocumentType, formData);
}
