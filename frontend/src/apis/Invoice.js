import {
    AddAttachment,
    AddInvoice,
    AddPayment,
    AttachmentList,
    DeleteAttachment,
    DeleteInvoice,
    DeletePayment,
    DownloadInvoice,
    DownloadInvoiceAttachment,
    DuplicateInvoice,
    EditInvoice,
    EditPayment,
    INITAttachment,
    InitPayment,
    InvoiceCurrency,
    InvoiceInit,
    InvoiceList,
    PaymentList
} from 'store/ApiConstant';
import { date } from 'yup/lib/locale';
import { AxiosAuthServices } from './axios/axiosServices';

export function InvoiceInitApi(data = {}) {
    const formData = new FormData();

    if (data.type === 'add') {
        formData.append('type', data.type);
    } else if (data.type === 'edit' || data.type === 'view') {
        formData.append('type', data.type);
        formData.append('id', data.id);
    }
    return AxiosAuthServices.post(InvoiceInit, formData);
}

export function InvoiceListApi(params) {
    return AxiosAuthServices.get(InvoiceList, params);
}

export function InvoiceCurrencyApi(params) {
    return AxiosAuthServices.get(InvoiceCurrency, params);
}

export function InvoiceAddUpdateApi(data) {
    const formData = new FormData();

    formData.append('client_id', data.client_id);
    formData.append('invoice_no', data.invoice_number);
    formData.append('invoice_date', data.invoice_date);
    formData.append('invoice_due_date', data.invoice_due_date);
    formData.append('is_bifurcated', data.is_bifurcated);
    formData.append('is_display_company_amount', data.is_display_company_amount);
    formData.append('discount_type', data.discount_type);
    formData.append('invoice_currency_id', data.invoice_currency_id);
    formData.append('invoice_currency_total_amount', data.grand_total);
    formData.append('currency_conversion_rate', data.ccr);
    formData.append('company_currency_total_amount', data.company_amount);
    formData.append('total_tax_amount', data.total_tax);
    formData.append('total_discount', data.total_discount);
    formData.append('total_deduction', data.total_deduction);
    formData.append('subtotal', data.subtotal);
    formData.append('term_id', data.payment_term_id);
    formData.append('subscriber_currency_id', data.subscriber_currency_id);
    formData.append('subscriber_currency_conversion_rate', data.subscriber_ccr);
    formData.append('subscriber_currency_total_amount', data.subscriber_currency_amount);
    formData.append('USD_currency_conversion_rate', data.USD_ccr);
    formData.append('USD_currency_total_amount', data.USD_currency_amount);
    formData.append('invoice_note', data.invoice_note);

    data.tax_id.map((i, idx) => {
        formData.append(`tax[${idx}][tax_id]`, i.id);
        formData.append(`tax[${idx}][tax_rate]`, i.rate);
        formData.append(`tax[${idx}][is_percentage]`, i.is_percentage);
    });

    data.invoice_item.map((i, idx) => {
        formData.append(`item[${idx}][item_type_id]`, i.item_type);
        formData.append(`item[${idx}][client_id]`, i.bifurcated_client);
        formData.append(`item[${idx}][resource_name]`, i.item_resource_name);
        formData.append(`item[${idx}][start_date]`, i.item_start_date);
        formData.append(`item[${idx}][end_date]`, i.item_end_date);
        formData.append(`item[${idx}][actual_day]`, i.item_actual_days);
        formData.append(`item[${idx}][working_day]`, i.item_working_days);
        formData.append(`item[${idx}][resource_quantity]`, i.item_qty);
        formData.append(`item[${idx}][rate]`, i.item_rate);
        formData.append(`item[${idx}][deduction]`, i.item_deduction);
        formData.append(`item[${idx}][tax_amount]`, i.item_tax_amount);
        formData.append(`item[${idx}][discount]`, i.item_discount);
        formData.append(`item[${idx}][discount_amount]`, i.item_discount_amount);
        formData.append(`item[${idx}][subtotal]`, i.item_subtotal);
        formData.append(`item[${idx}][total_amount]`, i.item_amount);
        formData.append(`item[${idx}][description]`, i.item_description);
    });

    data.bank_id.map((i) => {
        formData.append(`bank[]`, i.id);
    });

    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditInvoice, formData);
    } else {
        return AxiosAuthServices.post(AddInvoice, formData);
    }
}

export function DuplicateInvoiceApi(params) {
    return AxiosAuthServices.get(DuplicateInvoice, params);
}

export function InvoiceDeleteApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteInvoice, formData);
}

export function AttachmentListApi(params) {
    return AxiosAuthServices.get(AttachmentList, params);
}

export function AttachmentINITApi() {
    return AxiosAuthServices.post(INITAttachment);
}

export function AddAttachmentApi(data) {
    const formData = new FormData();
    // formData.append('file_name', data.file_name);
    // formData.append('document', data.attachment_file);
    // formData.append('doc_type', data.doc_type);
    formData.append('invoice_id', data.invoice_id);
    data.files.map((i, idx) => {
        formData.append(`files[${idx}][file_name]`, i.file_name);
        formData.append(`files[${idx}][document]`, i.attachment_file);
        formData.append(`files[${idx}][doc_type]`, i.doc_type);
    });

    return AxiosAuthServices.post(AddAttachment, formData);
}

export function AttachmentDeleteApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeleteAttachment, formData);
}

export function DownloadInvoiceApi(data) {
    const formData = new FormData();
    formData.append('id', data.invoice_id);
    return AxiosAuthServices.post(DownloadInvoice, formData);
}

export function DownloadInvoiceAttachmentApi(params) {
    return AxiosAuthServices.get(DownloadInvoiceAttachment, params);
}

// ========== Invoice Payment ========== //
export function PaymentListApi(params) {
    return AxiosAuthServices.get(PaymentList, params);
}

export function InitPaymentApi(data) {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('invoice_id', data.invoice_id);
    if (data.type === 'edit') {
        formData.append('id', data.id);
    }
    return AxiosAuthServices.post(InitPayment, formData);
}

export function AddEditPaymentApi(data) {
    const formData = new FormData();
    formData.append('invoice_id', data.invoice_id);
    formData.append('payment_date', data.payment_date);
    formData.append('reference_no', data.ref_no);
    formData.append('payment_source_id', data.way_of_payment);
    formData.append('invoice_currency_amount', data.invoiceCurrencyAmount);
    formData.append('company_currency_amount', data.companyCurrencyAmount);
    formData.append('tds', data.tds);
    formData.append('currency_conversion_rate', data.ccr);
    formData.append('difference', data.difference);
    formData.append('subscriber_ccr', data.subscriber_ccr);
    formData.append('USD_ccr', data.USD_ccr);
    formData.append('status', data.invoice_status);
    formData.append('note', data.note);
    if (data.id !== '' && data.formType === 'edit') {
        formData.append('id', data.id);
        return AxiosAuthServices.post(EditPayment, formData);
    } else {
        return AxiosAuthServices.post(AddPayment, formData);
    }
}

export function DeletePaymentApi(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    return AxiosAuthServices.post(DeletePayment, formData);
}
