import propTypes from 'prop-types';
import {
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { useFormik } from 'formik';
import Required from 'views/utilities/Required';

import * as yup from 'yup';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { AddEditPaymentApi } from 'apis/Invoice';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import { useEffect } from 'react';

/**
 * Form Validation
 */
const validationSchema = yup.object().shape({
    invoice_status: yup.string().required('Invoice status is required.'),
    ref_no: yup.string().required('Reference no is required.'),
    payment_date: yup.string().required('Payment date no is required.'),
    way_of_payment: yup.string().required('Way of payment is required.'),
    invoiceCurrencyAmount: yup.string().required('Amount in invoice currency is required.'),
    companyCurrencyAmount: yup.string().required('Amount in company currency is required.'),
    tds: yup.string().required('TDS is required.'),
    ccr: yup.string().required('CCR is required.'),
    subscriber_ccr: yup.string().required('Subscriber ccr is required.'),
    USD_ccr: yup.string().required('USD ccr is required.'),
    difference: yup.string().required('Difference is required.')
});

const initFormValue = {
    companyAmount: 0,
    tds: 0
};

const AddEditPayment = ({ value, formId, invoiceData, currencyRateData, onSubmit }) => {
    const invoice = invoiceData ?? false;
    const currencyRate = currencyRateData ?? false;
    const initValue = value ?? false;
    useEffect(() => {
        initFormValue.companyAmount = 0;
        initFormValue.tds = 0;
    }, []);

    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            invoice_id: invoice ? invoice.id : '',
            invoice_status: initValue ? initValue.status : '',
            ref_no: initValue ? initValue.reference_no : '',
            payment_date: initValue ? initValue.payment_date : '',
            way_of_payment: initValue ? initValue.payment_source_id : '',
            remainingAmount: invoice.remaining_amount,
            invoiceCurrencyAmount: initValue ? initValue.invoice_currency_amount : '',
            companyCurrencyAmount: initValue ? initValue.company_currency_amount : '',
            tds: initValue ? initValue.tds : '',
            ccr: initValue ? initValue.currency_conversion_rate : currencyRate.company_ccr,
            subscriber_ccr: initValue ? initValue.subscriber_ccr : currencyRate.subscriber_ccr,
            USD_ccr: initValue ? initValue.USD_ccr : currencyRate.USD_ccr,
            difference: initValue ? initValue.difference_amount : '',
            note: initValue ? initValue.note : '',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            AddEditPaymentApi(values)
                .then((res) => {
                    if (res.data && res.data.status === 1) {
                        if (onSubmit) onSubmit();
                        resetForm();
                        apiSuccessSnackBar(res);
                    } else {
                        apiValidationSnackBar(res);
                    }
                })
                .catch((err) => {
                    apiErrorSnackBar(err);
                });
        }
    });

    const getDifference = () => {
        const remainingAmount = formik.values.remainingAmount;
        const amount = initFormValue.companyAmount;
        const tds = initFormValue.tds;

        let totalAmount = 0;
        totalAmount = Number(amount) + Number(tds);

        const totalDifference = totalAmount - Number(remainingAmount);

        formik.setFieldValue('companyCurrencyAmount', amount);
        formik.setFieldValue('tds', tds);
        formik.setFieldValue('difference', totalDifference.toFixed(2));
    };

    const invoiceStatusHandler = (e) => {
        const status = e.target.value;

        if (status === 'Bad Debt') {
            formik.setFieldValue('ref_no', 'Bad Debt');
            formik.setFieldValue('payment_date', invoice.invoice_date);
            formik.setFieldValue('invoiceCurrencyAmount', 0);
            formik.setFieldValue('companyCurrencyAmount', 0);
            formik.setFieldValue('tds', 0);
            formik.setFieldValue('difference', 0);
            formik.setFieldValue('note', 'Bad Debt Invoice');
        } else {
            if (formik.values.ref_no === 'Bad Debt') {
                formik.setFieldValue('ref_no', '');
                formik.setFieldValue('note', '');
                formik.setFieldValue('payment_date', null);
            }
        }
    };

    return (
        <form id={formId} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table
                            size="small"
                            sx={{
                                [`& .${tableCellClasses.root}`]: {
                                    borderBottom: 'none'
                                }
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell align="right">In Invoice Currency</TableCell>
                                    <TableCell align="right">In Company Currency</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Currency Rate</TableCell>
                                    <TableCell align="right">{currencyRate.invoice_ccr}</TableCell>
                                    <TableCell align="right">{currencyRate.company_ccr}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Net Amount</TableCell>
                                    <TableCell align="right">{invoice.net_amount_invoice}</TableCell>
                                    <TableCell align="right">{invoice.net_amount_company}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Tax</TableCell>
                                    <TableCell align="right">{invoice.tax_invoice}</TableCell>
                                    <TableCell align="right">{invoice.tax_company}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell align="right">{invoice.total_amount_invoice}</TableCell>
                                    <TableCell align="right">{invoice.total_amount_company}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="subtitle1">Remaining Amount</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="subtitle1">{invoice.remaining_amount_invoice}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="subtitle1">{invoice.remaining_amount_company}</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        {/* Form */}
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                size="small"
                                fullWidth
                                error={formik.touched.invoice_status && Boolean(formik.errors.invoice_status)}
                            >
                                <InputLabel id="itemTypeLabel">Invoice Status</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="itemTypeLabel"
                                    id="invoice_status"
                                    name="invoice_status"
                                    label="Invoice Status"
                                    value={formik.values.invoice_status}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        invoiceStatusHandler(e);
                                    }}
                                >
                                    {invoice &&
                                        invoice.invoice_status.map((i, idx) => (
                                            <MenuItem value={i} key={idx}>
                                                {i}
                                            </MenuItem>
                                        ))}
                                </Select>
                                <FormHelperText>{formik.touched.invoice_status && formik.errors.invoice_status}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                id="ref_no"
                                name="ref_no"
                                disabled={formik.values.invoice_status == 'Bad Debt'}
                                label={<Required title="Reference No." />}
                                value={formik.values.ref_no}
                                onChange={formik.handleChange}
                                error={formik.touched.ref_no && Boolean(formik.errors.ref_no)}
                                helperText={formik.touched.ref_no && formik.errors.ref_no}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DesktopDatePicker
                                    id="payment_date"
                                    name="payment_date"
                                    label={<Required title="Payment Date" />}
                                    inputFormat="YYYY-MM-DD"
                                    value={formik.values.payment_date}
                                    maxDate={moment()}
                                    onChange={(date) => {
                                        formik.setFieldValue('payment_date', moment(date).format('YYYY-MM-DD'));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            fullWidth
                                            size="small"
                                            {...params}
                                            error={formik.touched.payment_date && Boolean(formik.errors.payment_date)}
                                            helperText={formik.touched.payment_date && formik.errors.payment_date}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                size="small"
                                id="invoiceCurrencyAmount"
                                name="invoiceCurrencyAmount"
                                label={<Required title={invoice.filed_labels.invoice_amount} />}
                                value={formik.values.invoiceCurrencyAmount}
                                onChange={formik.handleChange}
                                error={formik.touched.invoiceCurrencyAmount && Boolean(formik.errors.invoiceCurrencyAmount)}
                                helperText={formik.touched.invoiceCurrencyAmount && formik.errors.invoiceCurrencyAmount}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                id="companyCurrencyAmount"
                                name="companyCurrencyAmount"
                                label={<Required title={invoice.filed_labels.company_amount} />}
                                value={formik.values.companyCurrencyAmount}
                                onChange={(e) => {
                                    initFormValue.companyAmount = e.target.value;
                                    getDifference();
                                }}
                                error={formik.touched.companyCurrencyAmount && Boolean(formik.errors.companyCurrencyAmount)}
                                helperText={formik.touched.companyCurrencyAmount && formik.errors.companyCurrencyAmount}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                id="tds"
                                name="tds"
                                label={<Required title="TDS" />}
                                value={formik.values.tds}
                                onChange={(e) => {
                                    initFormValue.tds = e.target.value;
                                    getDifference();
                                }}
                                error={formik.touched.tds && Boolean(formik.errors.tds)}
                                helperText={formik.touched.tds && formik.errors.tds}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                id="ccr"
                                name="ccr"
                                label={<Required title={invoice.filed_labels.company_ccr} />}
                                value={formik.values.ccr}
                                onChange={formik.handleChange}
                                error={formik.touched.ccr && Boolean(formik.errors.ccr)}
                                helperText={formik.touched.ccr && formik.errors.ccr}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                id="difference"
                                name="difference"
                                label={<Required title="Difference" />}
                                value={formik.values.difference}
                                onChange={formik.handleChange}
                                error={formik.touched.difference && Boolean(formik.errors.difference)}
                                helperText={formik.touched.difference && formik.errors.difference}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                id="subscriber_ccr"
                                name="subscriber_ccr"
                                label={<Required title={invoice.filed_labels.sub_ccr} />}
                                value={formik.values.subscriber_ccr}
                                onChange={formik.handleChange}
                                error={formik.touched.subscriber_ccr && Boolean(formik.errors.subscriber_ccr)}
                                helperText={formik.touched.subscriber_ccr && formik.errors.subscriber_ccr}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                id="USD_ccr"
                                name="USD_ccr"
                                label={<Required title="USD ccr" />}
                                value={formik.values.USD_ccr}
                                onChange={formik.handleChange}
                                error={formik.touched.USD_ccr && Boolean(formik.errors.USD_ccr)}
                                helperText={formik.touched.USD_ccr && formik.errors.USD_ccr}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl
                                size="small"
                                fullWidth
                                error={formik.touched.way_of_payment && Boolean(formik.errors.way_of_payment)}
                            >
                                <InputLabel id="itemTypeLabel">{<Required title="Way of Payment" />}</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="itemTypeLabel"
                                    id="way_of_payment"
                                    name="way_of_payment"
                                    label={<Required title="Way of Payment" />}
                                    value={formik.values.way_of_payment}
                                    onChange={formik.handleChange}
                                >
                                    {invoice &&
                                        invoice.way_of_payment.map((i, idx) => (
                                            <MenuItem value={i.id} key={idx}>
                                                {i.payment_source_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                                <FormHelperText>{formik.touched.way_of_payment && formik.errors.way_of_payment}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                multiline
                                size="small"
                                id="note"
                                name="note"
                                rows={5}
                                label="Note"
                                value={formik.values.note}
                                onChange={formik.handleChange}
                                error={formik.touched.note && Boolean(formik.errors.note)}
                                helperText={formik.touched.note && formik.errors.note}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

AddEditPayment.propTypes = {
    formId: propTypes.string,
    value: propTypes.object,
    invoiceData: propTypes.object,
    currencyRateData: propTypes.object,
    onSubmit: propTypes.func
};

export default AddEditPayment;
