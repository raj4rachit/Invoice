import propTypes from 'prop-types';
import {
    Autocomplete,
    Checkbox,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    Link,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { Box } from '@mui/system';
import Required from 'views/utilities/Required';
import { useFormik } from 'formik';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { AddEditItem } from './AddEditItem';
import CenterDialog from 'views/utilities/CenterDialog';
import { useMemo } from 'react';
import { ContentCopyOutlined, DeleteOutline, EditOutlined } from '@mui/icons-material';

// third party
import * as yup from 'yup';
import { InvoiceAddUpdateApi, InvoiceCurrencyApi } from 'apis/Invoice';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import useAuth from 'hooks/useAuth';

const validationSchema = yup.object().shape({
    client_id: yup.string().required('Client is required.'),
    invoice_number: yup.string().required('Invoice number is required.'),
    invoice_date: yup.string().required('Invoice date is required.'),
    invoice_due_date: yup.string().required('Invoice due date is required.'),
    discount_type: yup.string().required('Discount type is required.'),
    invoice_currency_id: yup.string().required('Invoice currency is required.'),
    ccr: yup.string().required('Currency conversion rate is required.')
});

const RateParams = {
    currency_id: 0,
    company_id: 0
};

let itemType = 'add';
const AddEditInvoice = ({ value, formId, onSubmit }) => {
    const initValue = value ?? false;
    const initInvoice = initValue?.invoice ?? false;
    const initTaxes = initValue?.invoiceTaxes ?? false;
    const initBanks = initValue?.invoiceBanks ?? false;
    const initItems = initValue?.invoiceItems ?? false;

    const { company } = useAuth();
    const [openItem, setOpenItem] = useState(false);
    const [openEditItem, setOpenEditItem] = useState(false);
    const [callFunction, setCallFunction] = useState(false);
    const [itemData, setItemData] = useState([]);
    const [itemRowData, setItemRowData] = useState({});
    const [fieldSum, setFieldSum] = useState({
        totalTax: 0,
        totalDeduction: 0,
        totalDiscount: 0,
        subTotal: 0,
        grandTotal: 0
    });

    useEffect(() => {
        setFieldSum({
            totalTax: initInvoice ? initInvoice.total_tax_amount : 0,
            totalDeduction: initInvoice ? initInvoice.total_discount : 0,
            totalDiscount: initInvoice ? initInvoice.total_discount : 0,
            subTotal: initInvoice ? initInvoice.subtotal : 0,
            grandTotal: initInvoice ? initInvoice.invoice_currency_total_amount : 0
        });

        const array = [];
        initItems &&
            initItems.map((i, idx) => {
                const obj = {
                    bifurcated_client: i.client_id,
                    id: i.id,
                    item_actual_days: Number(i.actual_days),
                    item_amount: i.total_amount,
                    item_deduction: i.deduction,
                    item_description: i.description,
                    item_discount: i.discount,
                    item_discount_amount: i.discount_amount,
                    item_end_date: i.end_date,
                    item_qty: Number(i.resource_quantity),
                    item_rate: Number(i.rate),
                    item_resource_name: i.resource_name,
                    item_start_date: i.start_date,
                    item_subtotal: i.subtotal,
                    item_tax_amount: i.tax_amount,
                    item_type: i.item_type_id,
                    item_working_days: Number(i.working_days)
                };
                array.push(obj);
            });
        setItemData(array);

        const filterData = initTaxes ? initValue.taxList.filter((a) => initTaxes.some((b) => a.id === b.tax_id)) : [];
        formik.setFieldValue('tax_id', filterData);
        const filterDataBank = initBanks ? initValue.bankList.filter((a) => initBanks.some((b) => a.id === b.company_bank_id)) : [];
        formik.setFieldValue('bank_id', filterDataBank);
    }, []);

    const submitItemHandler = () => {
        setOpenItem((prevState) => !prevState);
    };

    const formik = useFormik({
        initialValues: {
            id: initInvoice ? initInvoice.id : '',
            client_id: initInvoice ? initInvoice.client_id : '',
            invoice_number: initInvoice ? initInvoice.invoice_no : initValue?.invoice_number,

            invoice_date: initInvoice ? initInvoice.invoice_date : moment().format('YYYY-MM-DD'),
            invoice_due_date: initInvoice ? initInvoice.invoice_due_date : moment().add(14, 'days').format('YYYY-MM-DD'),
            is_bifurcated: initInvoice ? initInvoice.is_bifurcated : 'No',
            is_display_company_amount: initInvoice ? initInvoice.is_display_company_amount : 'No',
            discount_type: initInvoice ? initInvoice.discount_type : 'AFTER_TAX_PR',
            invoice_currency_id: initInvoice ? initInvoice.invoice_currency_id : '',
            tax_id: [],
            bank_id: [],
            invoice_note: initInvoice ? initInvoice.invoice_note : '',
            ccr: initInvoice ? initInvoice.currency_conversion_rate : '',
            company_amount: initInvoice ? initInvoice.company_currency_total_amount : 0,
            subscriber_ccr: initInvoice ? initInvoice.subscriber_currency_conversion_rate : '',
            subscriber_currency_amount: initInvoice ? initInvoice.subscriber_currency_total_amount : 0,
            USD_ccr: initInvoice ? initInvoice.USD_currency_conversion_rate : '',
            USD_currency_amount: initInvoice ? initInvoice.USD_currency_total_amount : 0,
            invoice_item: [],
            payment_term_id: initInvoice && initInvoice.term_id != null ? initInvoice.term_id : '',
            formType: initInvoice && initInvoice.id ? 'edit' : 'add',
            subscriber_currency_id: initInvoice ? initInvoice.subscriber_currency_id : initValue?.subscriber_currency_id
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            values.invoice_item = itemData;
            values.total_tax = fieldSum.totalTax;
            values.total_deduction = fieldSum.totalDeduction;
            values.total_discount = fieldSum.totalDiscount;
            values.subtotal = fieldSum.subTotal;
            values.grand_total = fieldSum.grandTotal;

            InvoiceAddUpdateApi(values)
                .then((res) => {
                    if (res.data && res.data.status === 1) {
                        if (onSubmit) onSubmit();
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

    const totalTaxSum = () => {
        let totalTax = 0;
        formik.values.tax_id.map((i) => {
            totalTax += +i.rate;
        });
        return totalTax;
    };

    const addItem = () => {
        // totalTaxSum();
        setOpenItem((prevState) => !prevState);
    };

    // Edit Item
    const editItemHandler = (row, index) => {
        row.index = index;
        setItemRowData(row);
        setOpenEditItem((prevState) => !prevState);
    };
    const updateItemHandler = () => {
        setCallFunction((prevState) => !prevState);
        setOpenEditItem((prevState) => !prevState);
    };

    useMemo(() => {
        let totalTax = 0;
        let totalDeduction = 0;
        let totalDiscount = 0;
        let subtotal = 0;
        let grandTotal = 0;
        let ccr = formik.values.ccr ?? 0;
        let subscriber_ccr = formik.values.subscriber_ccr ?? 0;
        let USD_ccr = formik.values.USD_ccr ?? 0;

        itemData.map((i) => {
            totalTax += +i.item_tax_amount;
            totalDeduction += +i.item_deduction;
            totalDiscount += +i.item_discount_amount;
            subtotal += +i.item_subtotal;
            grandTotal += +i.item_amount;
        });

        setFieldSum({
            totalTax: totalTax.toFixed(2),
            totalDeduction: totalDeduction.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2),
            subTotal: subtotal.toFixed(2),
            grandTotal: grandTotal.toFixed(2)
        });

        formik.setFieldValue('company_amount', (subtotal * ccr).toFixed(2));
        formik.setFieldValue('subscriber_currency_amount', (subtotal * subscriber_ccr).toFixed(2));
        formik.setFieldValue('USD_currency_amount', (subtotal * USD_ccr).toFixed(2));
    }, [itemData, callFunction]);

    const deleteItemHandler = (index) => {
        itemData.splice(index, 1);
        setCallFunction((prevState) => !prevState);
    };

    const copyItemHandler = (index) => {
        const idxData = itemData[index];
        // const currentData = itemData;
        setItemData((prev) => [...prev, idxData]);
    };

    // Currency Rate
    const handleCurrencyRate = (e) => {
        RateParams.currency_id = e.target.value;
        RateParams.company_id = initInvoice ? initInvoice.company_id : company.company_id;
        InvoiceCurrencyApi(RateParams)
            .then((res) => {
                const rates = res.data.data;
                formik.setFieldValue('ccr', rates.company_ccr);
                formik.setFieldValue('subscriber_ccr', rates.subscriber_ccr);
                formik.setFieldValue('USD_ccr', rates.USD_ccr);

                let ccr = rates.company_ccr;
                let subscriber_ccr = rates.subscriber_ccr;
                let USD_ccr = rates.USD_ccr;
                let grandTotal = fieldSum.grandTotal;
                let subTotal = fieldSum.subTotal;
                formik.setFieldValue('company_amount', (subTotal * ccr).toFixed(2));
                formik.setFieldValue('subscriber_currency_amount', (subTotal * subscriber_ccr).toFixed(2));
                formik.setFieldValue('USD_currency_amount', (subTotal * USD_ccr).toFixed(2));
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    /* Change Tax's */
    const taxHandler = (val) => {
        const taxVal = val;
        let totalTaxSum = 0;
        taxVal.map((i) => {
            totalTaxSum += +i.rate;
        });

        itemData.map((i) => {
            let item = i;
            const qty = i.item_qty;
            const rate = i.item_rate;
            const actual_days = i.item_actual_days;
            const working_days = i.item_working_days;
            const deduction = i.item_deduction;
            const discount = i.item_discount;
            const totalRate = qty * rate;

            let totalWorkingDayAmount = (working_days * totalRate) / actual_days - deduction;
            let totalTax = 0;
            let subtotal = 0;
            let totalAmount = 0;

            // Discount Calculation
            const discountType = formik.values.discount_type;
            let discountAmount = 0;

            if (discountType === 'AFTER_TAX_PR' || discountType === 'AFTER_TAX_FLAT') {
                totalTax = (totalWorkingDayAmount * totalTaxSum) / 100;
                discountAmount = discountType === 'AFTER_TAX_PR' ? ((totalWorkingDayAmount + totalTax) * discount) / 100 : discount;
                discountAmount = Number(discountAmount).toFixed(2);
                subtotal = totalWorkingDayAmount;
                totalAmount = totalWorkingDayAmount + totalTax - discountAmount;
            } else if (discountType === 'BEFORE_TAX_PR' || discountType === 'BEFORE_TAX_FLAT') {
                discountAmount =
                    discountType === 'BEFORE_TAX_PR' ? (totalWorkingDayAmount * discount) / 100 : totalWorkingDayAmount + discount;
                totalWorkingDayAmount = totalWorkingDayAmount - discountAmount;
                totalTax = (totalWorkingDayAmount * totalTaxSum) / 100;
                subtotal = totalWorkingDayAmount;
                totalAmount = totalWorkingDayAmount + totalTax;
            } else {
                totalTax = (totalWorkingDayAmount * totalTaxSum) / 100;
                subtotal = totalWorkingDayAmount;
                totalAmount = totalWorkingDayAmount + totalTax;
            }

            item.item_tax_amount = totalTax.toFixed(2);
            item.item_discount_amount = discountAmount;
            item.item_subtotal = subtotal.toFixed(2);
            item.item_amount = totalAmount.toFixed(2);
        });
        setCallFunction((prevState) => !prevState);
    };
    return (
        <>
            <Box>
                <form id={formId} onSubmit={formik.handleSubmit}>
                    <Grid item container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                disableClearable
                                size="small"
                                id="client_id"
                                name="client_id"
                                options={initValue?.clientList ?? []}
                                value={
                                    formik.values.client_id != ''
                                        ? initValue.clientList.filter((a) => a.id == formik.values.client_id)[0]
                                        : null
                                }
                                getOptionLabel={(option) => (option.client_name ? `${option.company_name} - ${option.client_name}` : '')}
                                getOptionDisabled={(option) => option.id === '-'}
                                renderOption={(props, option) => <li {...props}>{`${option.company_name} - ${option.client_name}`}</li>}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        name="client_id"
                                        label={<Required title="Client" />}
                                        error={formik.touched.client_id && Boolean(formik.errors.client_id)}
                                        helperText={formik.touched.client_id && formik.errors.client_id}
                                    />
                                )}
                                onChange={(_, v) => {
                                    formik.setFieldValue(`client_id`, v ? v.id : '');
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                id="invoice_number"
                                name="invoice_number"
                                label={<Required title="Invoice Number" />}
                                value={formik.values.invoice_number}
                                onChange={formik.handleChange}
                                error={formik.touched.invoice_number && Boolean(formik.errors.invoice_number)}
                                helperText={formik.touched.invoice_number && formik.errors.invoice_number}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DesktopDatePicker
                                    id="invoice_date"
                                    name="invoice_date"
                                    label={<Required title="Invoice Date" />}
                                    inputFormat="YYYY-MM-DD"
                                    value={formik.values.invoice_date}
                                    maxDate={moment()}
                                    onChange={(date) => {
                                        formik.setFieldValue('invoice_due_date', moment(date).add(14, 'days').format('YYYY-MM-DD'));
                                        formik.setFieldValue('invoice_date', moment(date).format('YYYY-MM-DD'));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            fullWidth
                                            size="small"
                                            {...params}
                                            error={formik.touched.invoice_date && Boolean(formik.errors.invoice_date)}
                                            helperText={formik.touched.invoice_date && formik.errors.invoice_date}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DesktopDatePicker
                                    id="invoice_due_date"
                                    name="invoice_due_date"
                                    label={<Required title="Invoice Due Date" />}
                                    inputFormat="YYYY-MM-DD"
                                    value={formik.values.invoice_due_date}
                                    // maxDate={moment()}
                                    onChange={(date) => {
                                        formik.setFieldValue('invoice_due_date', moment(date).format('YYYY-MM-DD'));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            fullWidth
                                            size="small"
                                            {...params}
                                            error={formik.touched.invoice_due_date && Boolean(formik.errors.invoice_due_date)}
                                            helperText={formik.touched.invoice_due_date && formik.errors.invoice_due_date}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                size="small"
                                fullWidth
                                error={formik.touched.is_bifurcated && Boolean(formik.errors.is_bifurcated)}
                            >
                                <InputLabel id="isBifurcatedLabel">Is Bifurcated?</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="isBifurcatedLabel"
                                    id="is_bifurcated"
                                    name="is_bifurcated"
                                    label="Is Bifurcated?"
                                    value={formik.values.is_bifurcated}
                                    onChange={formik.handleChange}
                                    disabled={itemData.length > 0 ?? false}
                                >
                                    <MenuItem value={'Yes'} key={0}>
                                        Yes
                                    </MenuItem>
                                    <MenuItem value={'No'} key={1}>
                                        No
                                    </MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.is_bifurcated && formik.errors.is_bifurcated}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                size="small"
                                fullWidth
                                error={formik.touched.is_display_company_amount && Boolean(formik.errors.is_display_company_amount)}
                            >
                                <InputLabel id="discountLabel">Is Display Company Amount?</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="discountLabel"
                                    id="is_display_company_amount"
                                    name="is_display_company_amount"
                                    label="Is Display Company Amount?"
                                    value={formik.values.is_display_company_amount}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value={'Yes'} key={0}>
                                        Yes
                                    </MenuItem>
                                    <MenuItem value={'No'} key={1}>
                                        No
                                    </MenuItem>
                                </Select>
                                <FormHelperText>
                                    {formik.touched.is_display_company_amount && formik.errors.is_display_company_amount}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                size="small"
                                fullWidth
                                error={formik.touched.discount_type && Boolean(formik.errors.discount_type)}
                            >
                                <InputLabel id="discountLabel">
                                    <Required title="Discount Type" />
                                </InputLabel>
                                <Select
                                    fullWidth
                                    labelId="discountLabel"
                                    id="discount_type"
                                    name="discount_type"
                                    label={<Required title="Discount Type" />}
                                    value={formik.values.discount_type}
                                    onChange={formik.handleChange}
                                    disabled={itemData.length > 0 ?? false}
                                >
                                    {initValue.discountType &&
                                        initValue.discountType.map((i, idx) => (
                                            <MenuItem value={i.id} key={idx}>
                                                {i.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                                <FormHelperText>{formik.touched.discount_type && formik.errors.discount_type}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                size="small"
                                fullWidth
                                error={formik.touched.invoice_currency_id && Boolean(formik.errors.invoice_currency_id)}
                            >
                                <InputLabel id="invoiceCurrencyLabel">
                                    <Required title="Invoice Currency" />
                                </InputLabel>
                                <Select
                                    fullWidth
                                    labelId="invoiceCurrencyLabel"
                                    id="invoice_currency_id"
                                    name="invoice_currency_id"
                                    label={<Required title="Invoice Currency" />}
                                    value={formik.values.invoice_currency_id}
                                    onChange={(e) => {
                                        handleCurrencyRate(e);
                                        formik.handleChange(e);
                                    }}
                                >
                                    {initValue &&
                                        initValue?.currencyList.map((i, idx) => (
                                            <MenuItem value={i.id} key={idx}>
                                                {`${i.currency_symbol} - ${i.currency_name}`}
                                            </MenuItem>
                                        ))}
                                </Select>
                                <FormHelperText>{formik.touched.invoice_currency_id && formik.errors.invoice_currency_id}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Autocomplete
                                multiple
                                size="small"
                                id="tax_id"
                                name="tax_id"
                                options={initValue.taxList ?? []}
                                value={formik.values.tax_id}
                                getOptionLabel={(option) =>
                                    option.tax_name ? `${option.tax_name} (${option.rate}${option.is_percentage === 'Yes' && '%'}) ` : ''
                                }
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox checked={selected} value={option.id} />
                                        {`${option.tax_name} (${option.rate}${option.is_percentage === 'Yes' && '%'}) `}
                                    </li>
                                )}
                                renderInput={(params) => <TextField {...params} size="small" name="tax_id" label="TAX's" />}
                                onChange={(_, v) => {
                                    formik.setFieldValue(`tax_id`, v);
                                    taxHandler(v);
                                }}
                                // disabled={itemData.length > 0 ?? false}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                size="small"
                                fullWidth
                                error={formik.touched.payment_term_id && Boolean(formik.errors.payment_term_id)}
                            >
                                <InputLabel id="paymentTermID">Payment Term</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="paymentTermID"
                                    id="payment_term_id"
                                    name="payment_term_id"
                                    label="Payment Term"
                                    value={formik.values.payment_term_id}
                                    onChange={formik.handleChange}
                                >
                                    {initValue.paymentTerms.map((i, idx) => (
                                        <MenuItem value={i.id} key={idx}>
                                            {i.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{formik.touched.payment_term_id && formik.errors.payment_term_id}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                multiple
                                size="small"
                                id="bank_id"
                                name="bank_id"
                                options={initValue.bankList ?? []}
                                value={formik.values.bank_id}
                                getOptionLabel={(option) => (option.bank_detail_name ? option.bank_detail_name : '')}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox checked={selected} value={option.id} />
                                        {option.bank_detail_name}
                                    </li>
                                )}
                                renderInput={(params) => <TextField {...params} size="small" name="bank_id" label="Bank Details" />}
                                onChange={(_, v) => {
                                    formik.setFieldValue(`bank_id`, v);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                size="small"
                                id="invoice_note"
                                name="invoice_note"
                                label="Invoice Note"
                                value={formik.values.invoice_note}
                                onChange={formik.handleChange}
                                // error={formik.touched.item_description && Boolean(formik.errors.item_description)}
                                // helperText={formik.touched.item_description && formik.errors.item_description}
                            />
                        </Grid>

                        {/* Start Invoice Item */}
                        <Grid item xs={12} sm={12}>
                            <Grid container justifyContent="space-between">
                                <Typography variant="body1" align="left">
                                    Invoice Item
                                </Typography>

                                <Link
                                    underline="hover"
                                    onClick={() => {
                                        addItem();
                                    }}
                                    sx={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    Add Item
                                </Link>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Description</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">QTY</TableCell>
                                            <TableCell align="right">Deduction</TableCell>
                                            <TableCell align="right">TAX</TableCell>
                                            <TableCell align="right">Discount</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {itemData.map((i, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    {i.item_resource_name}
                                                    <Typography variant="subtitle2">{i.item_description}</Typography>
                                                </TableCell>
                                                <TableCell align="right">{i.item_rate}</TableCell>
                                                <TableCell align="right">{i.item_qty}</TableCell>
                                                <TableCell align="right">{i.item_deduction}</TableCell>
                                                <TableCell align="right">{i.item_tax_amount}</TableCell>
                                                <TableCell align="right">{i.item_discount_amount}</TableCell>
                                                <TableCell align="right">{i.item_subtotal}</TableCell>
                                                <TableCell align="right">{i.item_amount}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton color="primary" component="label" onClick={() => editItemHandler(i, idx)}>
                                                        <EditOutlined fontSize="small" />
                                                    </IconButton>
                                                    <IconButton color="secondary" component="label" onClick={() => copyItemHandler(idx)}>
                                                        <ContentCopyOutlined fontSize="small" />
                                                    </IconButton>
                                                    <IconButton color="error" component="label" onClick={() => deleteItemHandler(idx)}>
                                                        <DeleteOutline fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {itemData.length == 0 && (
                                            <TableRow>
                                                <TableCell align="center" colSpan={9}>
                                                    No Data Found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        {/* Final Calculation */}
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2} justifyContent="end">
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle1" textAlign="end">
                                        Total Tax
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle">{fieldSum.totalTax}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2} justifyContent="end">
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle1" textAlign="end">
                                        Total Deduction
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle">{fieldSum.totalDeduction}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2} justifyContent="end">
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle1" textAlign="end">
                                        Total Discount
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle">{fieldSum.totalDiscount}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2} justifyContent="end">
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle1" textAlign="end">
                                        Subtotal
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle">{fieldSum.subTotal}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2} justifyContent="end">
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle1" textAlign="end">
                                        Grand Total
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle">{fieldSum.grandTotal}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2} justifyContent="end">
                                <Grid item xs={7} sm={9} textAlign="end">
                                    <Typography variant="subtitle1">Currency Conversion Rate</Typography>
                                </Grid>
                                <Grid item xs={5} sm={3}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        size="small"
                                        id="ccr"
                                        name="ccr"
                                        label={<Required title="CCR" />}
                                        value={formik.values.ccr}
                                        onChange={(e) => {
                                            formik.setFieldValue('company_amount', (fieldSum.grandTotal * e.target.value).toFixed(2));
                                            formik.handleChange(e);
                                        }}
                                        error={formik.touched.ccr && Boolean(formik.errors.ccr)}
                                        helperText={formik.touched.ccr && formik.errors.ccr}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2} justifyContent="end">
                                <Grid item xs={7} sm={9}>
                                    <Typography variant="subtitle1" textAlign="end">
                                        Company Currency Amount
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle">{formik.values.company_amount}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        {formik.values.invoice_currency_id !== formik.values.subscriber_currency_id && (
                            <>
                                <Grid item xs={12}>
                                    <Grid container alignItems="center" spacing={2} justifyContent="end">
                                        <Grid item xs={7} sm={9} textAlign="end">
                                            <Typography variant="subtitle1">Subscriber Currency Conversion Rate</Typography>
                                        </Grid>
                                        <Grid item xs={5} sm={3}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                size="small"
                                                id="subscriber_ccr"
                                                name="subscriber_ccr"
                                                label={<Required title="Subscriber CCR" />}
                                                value={formik.values.subscriber_ccr}
                                                onChange={(e) => {
                                                    formik.setFieldValue(
                                                        'subscriber_currency_amount',
                                                        (fieldSum.grandTotal * e.target.value).toFixed(2)
                                                    );
                                                    formik.handleChange(e);
                                                }}
                                                error={formik.touched.subscriber_ccr && Boolean(formik.errors.subscriber_ccr)}
                                                helperText={formik.touched.subscriber_ccr && formik.errors.subscriber_ccr}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container alignItems="center" spacing={2} justifyContent="end">
                                        <Grid item xs={7} sm={9}>
                                            <Typography variant="subtitle1" textAlign="end">
                                                Subscriber Currency Amount
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={5} sm={3}>
                                            <Typography variant="subtitle">{formik.values.subscriber_currency_amount}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2} justifyContent="end">
                                <Grid item xs={7} sm={9} textAlign="end">
                                    <Typography variant="subtitle1">USD Currency Conversion Rate</Typography>
                                </Grid>
                                <Grid item xs={5} sm={3}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        size="small"
                                        id="USD_ccr"
                                        name="USD_ccr"
                                        label={<Required title="USD CCR" />}
                                        value={formik.values.USD_ccr}
                                        onChange={(e) => {
                                            formik.setFieldValue(
                                                'subscriber_currency_amount',
                                                (fieldSum.grandTotal * e.target.value).toFixed(2)
                                            );
                                            formik.handleChange(e);
                                        }}
                                        error={formik.touched.USD_ccr && Boolean(formik.errors.USD_ccr)}
                                        helperText={formik.touched.USD_ccr && formik.errors.USD_ccr}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2} justifyContent="end">
                                <Grid item xs={7} sm={9}>
                                    <Typography variant="subtitle1" textAlign="end">
                                        USD Currency Amount
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} sm={3}>
                                    <Typography variant="subtitle">{formik.values.USD_currency_amount}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            {openItem && (
                <CenterDialog
                    title={'Add Item'}
                    open={openItem}
                    onClose={() => setOpenItem((prevState) => !prevState)}
                    id="addEditItem"
                    sx={{
                        '&>div:nth-of-type(3)': {
                            '&>div': {
                                minWidth: { md: '50%', xs: '90%' }
                            }
                        }
                    }}
                >
                    <AddEditItem
                        formId="addEditItem"
                        onSubmit={submitItemHandler}
                        initData={formik.values}
                        setItemData={setItemData}
                        itemData={itemData}
                        listingData={{
                            bifurcatedClientList: initValue.bifurcatedClientList,
                            invoiceItemTypeList: initValue.invoiceItemTypeList
                        }}
                    />
                </CenterDialog>
            )}

            {openEditItem && (
                <CenterDialog
                    title={'Edit Item'}
                    open={openEditItem}
                    onClose={() => setOpenEditItem((prevState) => !prevState)}
                    id="addEditItem"
                    sx={{
                        '&>div:nth-of-type(3)': {
                            '&>div': {
                                minWidth: { md: '50%', xs: '90%' }
                            }
                        }
                    }}
                >
                    <AddEditItem
                        value={itemRowData}
                        formId="addEditItem"
                        onSubmit={updateItemHandler}
                        initData={formik.values}
                        setItemData={setItemData}
                        itemData={itemData}
                        listingData={{
                            bifurcatedClientList: initValue.bifurcatedClientList,
                            invoiceItemTypeList: initValue.invoiceItemTypeList
                        }}
                    />
                </CenterDialog>
            )}
        </>
    );
};

AddEditInvoice.propTypes = {
    value: propTypes.object,
    formId: propTypes.string.isRequired,
    onSubmit: propTypes.func
};

export default AddEditInvoice;
