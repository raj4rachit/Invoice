import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useFormik } from 'formik';
import moment from 'moment';
import { useState } from 'react';
import { useCallback, useEffect } from 'react';
import Required from 'views/utilities/Required';

import * as yup from 'yup';

const validationSchema = yup.object().shape({
    item_type: yup.string().required('Item type is required.'),
    item_resource_name: yup.string().required('Resource name is required.'),
    item_qty: yup.string().required('Resource / Hours is required.')
});

const initFormValue = {
    item_type: 0,
    isDate: false,
    item_resource_name: '',
    item_start_date: moment().format('YYYY-MM-DD'),
    item_end_date: moment().format('YYYY-MM-DD'),
    item_actual_days: 1,
    item_working_days: 1,
    item_qty: 0,
    item_rate: 0,
    item_deduction: 0,
    item_tax_amount: 0,
    item_discount: 0,
    item_discount_amount: 0,
    item_subtotal: 0,
    item_amount: 0
};

export const AddEditItem = ({ value, formId, onSubmit, initData, setItemData, itemData, listingData }) => {
    const initValue = value ?? false;
    const [isDate, setIsDate] = useState(false);

    const totalTaxSum = () => {
        let totalTax = 0;
        initData.tax_id.map((i) => {
            totalTax += +i.rate;
        });
        return totalTax;
    };

    const formik = useFormik({
        initialValues: {
            index: initValue ? initValue.index : '',
            id: initValue ? initValue.id : '',
            bifurcated_client: initValue ? initValue.bifurcated_client : '',
            item_type: initValue ? initValue.item_type : '',
            item_resource_name: initValue ? initValue.item_resource_name : '',
            item_start_date: initValue ? initValue.item_start_date : moment().format('YYYY-MM-DD'),
            item_end_date: initValue ? initValue.item_end_date : moment().format('YYYY-MM-DD'),
            item_actual_days: initValue ? initValue.item_actual_days : '1',
            item_working_days: initValue ? initValue.item_working_days : '1',
            item_qty: initValue ? initValue.item_qty : '0',
            item_rate: initValue ? initValue.item_rate : '0',
            item_deduction: initValue ? initValue.item_deduction : '0',
            item_tax_amount: initValue ? initValue.item_tax_amount : '0',
            item_discount: initValue ? initValue.item_discount : '0',
            item_discount_amount: initValue ? initValue.item_discount_amount : '0',
            item_subtotal: initValue ? initValue.item_subtotal : '0',
            item_amount: initValue ? initValue.item_amount : '0',
            item_description: initValue ? initValue.item_description : ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (values.index !== '') {
                itemData[values.index] = values;
            } else {
                setItemData([...itemData, values]);
            }
            if (onSubmit) onSubmit();
        }
    });

    /********************************************************************************
     * ======================= Calculate Total amount and tax =======================
     ********************************************************************************/
    const changeAmount = useCallback(() => {
        const qty = initFormValue.item_qty;
        const rate = initFormValue.item_rate;
        const actualDays = initFormValue.item_actual_days;
        const workingDays = initFormValue.item_working_days;
        const deduction = initFormValue.item_deduction;
        const discount = initFormValue.item_discount;
        const totalRate = qty * rate;

        let totalWorkingDayAmount = (workingDays * totalRate) / actualDays - deduction;
        let totalTax = 0;
        let subtotal = 0;
        let totalAmount = 0;

        // Discount Calculation
        const discountType = initData.discount_type;
        let discountAmount = 0;

        if (discountType === 'AFTER_TAX_PR' || discountType === 'AFTER_TAX_FLAT') {
            totalTax = (totalWorkingDayAmount * totalTaxSum()) / 100;
            discountAmount = discountType === 'AFTER_TAX_PR' ? ((totalWorkingDayAmount + totalTax) * discount) / 100 : discount;
            discountAmount = Number(discountAmount).toFixed(2);
            subtotal = totalWorkingDayAmount;
            totalAmount = totalWorkingDayAmount + totalTax - discountAmount;
        } else if (discountType === 'BEFORE_TAX_PR' || discountType === 'BEFORE_TAX_FLAT') {
            discountAmount = discountType === 'BEFORE_TAX_PR' ? (totalWorkingDayAmount * discount) / 100 : totalWorkingDayAmount + discount;
            totalWorkingDayAmount = totalWorkingDayAmount - discountAmount;
            totalTax = (totalWorkingDayAmount * totalTaxSum()) / 100;
            subtotal = totalWorkingDayAmount;
            totalAmount = totalWorkingDayAmount + totalTax;
        } else {
            totalTax = (totalWorkingDayAmount * totalTaxSum()) / 100;
            subtotal = totalWorkingDayAmount;
            totalAmount = totalWorkingDayAmount + totalTax;
        }

        initFormValue.item_tax_amount = totalTax.toFixed(2);
        initFormValue.item_discount_amount = discountAmount;
        initFormValue.item_subtotal = subtotal.toFixed(2);
        initFormValue.item_amount = totalAmount.toFixed(2);
        formik.setFieldValue('item_tax_amount', totalTax.toFixed(2));
        formik.setFieldValue('item_discount_amount', discountAmount);
        formik.setFieldValue('item_subtotal', subtotal.toFixed(2));
        formik.setFieldValue('item_amount', totalAmount.toFixed(2));

        const itemTypeId = listingData.invoiceItemTypeList.findIndex((i) => i.id === initFormValue.item_type);
        const itemType = listingData.invoiceItemTypeList[itemTypeId];
        let description = '';
        if (initFormValue.isDate === true) {
            description = `${itemTypeId != -1 ? itemType.item_type_name + ' |' : ''} ${initFormValue.item_start_date} to ${
                initFormValue.item_end_date
            } | Working Days ${initFormValue.item_working_days} Out Of ${initFormValue.item_actual_days} `;
        }
        formik.setFieldValue('item_description', description);
    }, []);

    /*******************************************************************************
     * =============== Calculate Actual and working days on the date ===============
     *******************************************************************************/
    const checkChangeDate = () => {
        const startDate = initFormValue.item_start_date;
        const endDate = initFormValue.item_end_date;
        let start_Date = moment(startDate);
        let end_Date = moment(endDate);
        let actualDays = end_Date.diff(start_Date, 'days') + 1;
        let counter = 0;
        if (actualDays > 0) {
            const date = start_Date;
            for (let i = 0; i < actualDays; i++) {
                let check = date.day();
                if (check == 0 || check == 6) {
                } else {
                    counter++; // It's a weekday so increase the counter
                }
                date.add('1', 'days');
            }
        }

        initFormValue.item_actual_days = actualDays;
        initFormValue.item_working_days = counter;
        formik.setFieldValue('item_actual_days', actualDays);
        formik.setFieldValue('item_working_days', counter);
        changeAmount();
    };

    /********************************************************************************
     * ========================== Item Type Change Handler ==========================
     ********************************************************************************/
    const changeTypeHandler = useCallback(() => {
        const itemTypeId = listingData.invoiceItemTypeList.findIndex((i) => i.id === initFormValue.item_type);
        const itemType = listingData.invoiceItemTypeList[itemTypeId];
        setIsDate(itemType.is_date === 'Yes' ? true : false);
        initFormValue.isDate = itemType.is_date === 'Yes' ? true : false;
        const startDate = initFormValue.item_start_date;
        let endDate = moment(startDate).format('YYYY-MM-DD');
        if (itemType.is_date === 'Yes') {
            endDate = moment(startDate).add(itemType.date_no, itemType.date_type);
            if (itemType.date_type === 'months' || itemType.date_type === 'years') {
                endDate = moment(endDate).subtract('1', 'day');
            }
            endDate = endDate.format('YYYY-MM-DD');
        }

        // Update Formik value
        initFormValue.item_end_date = endDate;
        formik.setFieldValue('item_end_date', endDate);

        let start_Date = moment(startDate);
        let end_Date = moment(endDate);
        let actualDays = end_Date.diff(start_Date, 'days');
        if (itemType.is_date !== 'Yes') {
            actualDays += 1;
        }

        let counter = 0;
        if (actualDays > 0) {
            const date = start_Date;
            for (let i = 0; i < actualDays; i++) {
                let check = date.day();
                if (check == 0 || check == 6) {
                } else {
                    counter++; // It's a weekday so increase the counter
                }
                date.add('1', 'days');
            }
        }

        initFormValue.item_actual_days = actualDays;
        initFormValue.item_working_days = counter;
        formik.setFieldValue('item_actual_days', actualDays);
        formik.setFieldValue('item_working_days', counter);
        changeAmount();
        formik.setFieldValue('item_type', initFormValue.item_type);
    }, []);

    /*******************************************************************************
     * ============================ Date Change Handler ============================
     *******************************************************************************/
    const changeDateHandler = (filedName, value) => {
        formik.setFieldValue(filedName, value);
        // setCheckChange((prevState) => !prevState);
        checkChangeDate();
    };

    useEffect(() => {
        initFormValue.item_type = initValue ? initValue.item_type : 0;
        initFormValue.item_resource_name = initValue ? initValue.item_resource_name : '';
        initFormValue.item_start_date = initValue ? moment(initValue.item_start_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        initFormValue.item_end_date = initValue ? moment(initValue.item_end_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        initFormValue.item_actual_days = initValue ? initValue.item_actual_days : 1;
        initFormValue.item_working_days = initValue ? initValue.item_working_days : 1;
        initFormValue.item_qty = initValue ? initValue.item_qty : 0;
        initFormValue.item_rate = initValue ? initValue.item_rate : 0;
        initFormValue.item_deduction = initValue ? initValue.item_deduction : 0;
        initFormValue.item_tax_amount = initValue ? initValue.item_tax_amount : 0;
        initFormValue.item_discount = initValue ? initValue.item_discount : 0;
        initFormValue.item_discount_amount = initValue ? initValue.item_discount_amount : 0;
        initFormValue.item_subtotal = initValue ? initValue.item_subtotal : 0;
        initFormValue.item_amount = initValue ? initValue.item_amount : 0;

        const itemTypeId = listingData.invoiceItemTypeList.findIndex((i) => i.id === initFormValue.item_type);
        const itemType = listingData.invoiceItemTypeList[itemTypeId];
        initFormValue.isDate = itemType && itemType.is_date === 'Yes' ? true : false;
        setIsDate(itemType && itemType.is_date === 'Yes' ? true : false);
    }, []);

    return (
        <form id={formId} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        {initData.is_bifurcated === 'Yes' && (
                            <Grid item xs={12} sm={12}>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    error={formik.touched.bifurcated_client && Boolean(formik.errors.bifurcated_client)}
                                >
                                    <InputLabel id="itemTypeLabel">Bifurcated Client</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="itemTypeLabel"
                                        id="bifurcated_client"
                                        name="bifurcated_client"
                                        label="Bifurcated Client"
                                        value={formik.values.bifurcated_client}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            const getIndex = listingData.bifurcatedClientList.findIndex((i) => i.id === e.target.value);
                                            const selectedClient = listingData.bifurcatedClientList[getIndex];
                                            formik.setFieldValue('item_resource_name', `${selectedClient.client_name} - `);
                                        }}
                                    >
                                        {listingData.bifurcatedClientList.map((item, idx) => (
                                            <MenuItem value={item.id} key={idx}>
                                                {item.client_name} - {item.company_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{formik.touched.bifurcated_client && formik.errors.bifurcated_client}</FormHelperText>
                                </FormControl>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <FormControl size="small" fullWidth error={formik.touched.item_type && Boolean(formik.errors.item_type)}>
                                <InputLabel id="itemTypeLabel">Item type</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="itemTypeLabel"
                                    id="item_type"
                                    name="item_type"
                                    label="Item type"
                                    value={formik.values.item_type}
                                    onChange={(e) => {
                                        initFormValue.item_type = e.target.value;
                                        changeTypeHandler(e);
                                    }}
                                >
                                    {listingData.invoiceItemTypeList.map((item, idx) => (
                                        <MenuItem value={item.id} key={idx}>
                                            {item.item_type_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{formik.touched.item_type && formik.errors.item_type}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                id="item_resource_name"
                                name="item_resource_name"
                                label={<Required title="Resource name" />}
                                value={formik.values.item_resource_name}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                }}
                                error={formik.touched.item_resource_name && Boolean(formik.errors.item_resource_name)}
                                helperText={formik.touched.item_resource_name && formik.errors.item_resource_name}
                            />
                        </Grid>
                        {isDate && (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DesktopDatePicker
                                            id="item_start_date"
                                            name="item_start_date"
                                            label={<Required title="Start date" />}
                                            inputFormat="YYYY-MM-DD"
                                            value={formik.values.item_start_date}
                                            maxDate={moment()}
                                            onChange={(date) => {
                                                const itemTypeID = formik.values.item_type;
                                                initFormValue.item_type = itemTypeID;
                                                initFormValue.item_start_date = moment(date).format('YYYY-MM-DD');
                                                changeTypeHandler();
                                                changeDateHandler('item_start_date', moment(date).format('YYYY-MM-DD'));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    {...params}
                                                    error={formik.touched.item_start_date && Boolean(formik.errors.item_start_date)}
                                                    helperText={formik.touched.item_start_date && formik.errors.item_start_date}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DesktopDatePicker
                                            id="item_end_date"
                                            name="item_end_date"
                                            label={<Required title="End date" />}
                                            inputFormat="YYYY-MM-DD"
                                            value={formik.values.item_end_date}
                                            minDate={formik.values.item_start_date}
                                            onChange={(date) => {
                                                initFormValue.item_end_date = moment(date).format('YYYY-MM-DD');
                                                changeDateHandler('item_end_date', moment(date).format('YYYY-MM-DD'));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    {...params}
                                                    error={formik.touched.item_end_date && Boolean(formik.errors.item_end_date)}
                                                    helperText={formik.touched.item_end_date && formik.errors.item_end_date}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="item_actual_days"
                                        name="item_actual_days"
                                        label={<Required title="Total Working Days" />}
                                        value={formik.values.item_actual_days}
                                        error={formik.touched.item_actual_days && Boolean(formik.errors.item_actual_days)}
                                        helperText={formik.touched.item_actual_days && formik.errors.item_actual_days}
                                        onChange={(e) => {
                                            initFormValue.item_actual_days = e.target.value;
                                            formik.handleChange(e);
                                            changeAmount();
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="item_working_days"
                                        name="item_working_days"
                                        label={<Required title="Worked Days" />}
                                        value={formik.values.item_working_days}
                                        onChange={(e) => {
                                            initFormValue.item_working_days = e.target.value;
                                            formik.handleChange(e);
                                            changeAmount();
                                        }}
                                        error={formik.touched.item_working_days && Boolean(formik.errors.item_working_days)}
                                        helperText={formik.touched.item_working_days && formik.errors.item_working_days}
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                size="small"
                                id="item_qty"
                                name="item_qty"
                                label={<Required title="Resource / Hours" />}
                                value={formik.values.item_qty}
                                onChange={(e) => {
                                    initFormValue.item_qty = e.target.value;
                                    formik.handleChange(e);
                                    changeAmount();
                                }}
                                error={formik.touched.item_qty && Boolean(formik.errors.item_qty)}
                                helperText={formik.touched.item_qty && formik.errors.item_qty}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                size="small"
                                id="item_rate"
                                name="item_rate"
                                label={<Required title="Rate" />}
                                value={formik.values.item_rate}
                                onChange={(e) => {
                                    initFormValue.item_rate = e.target.value;
                                    changeAmount();
                                    formik.handleChange(e);
                                }}
                                error={formik.touched.item_rate && Boolean(formik.errors.item_rate)}
                                helperText={formik.touched.item_rate && formik.errors.item_rate}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                size="small"
                                id="item_deduction"
                                name="item_deduction"
                                label={<Required title="Deduction" />}
                                value={formik.values.item_deduction}
                                onChange={(e) => {
                                    initFormValue.item_deduction = e.target.value;
                                    changeAmount();
                                    formik.handleChange(e);
                                }}
                                error={formik.touched.item_deduction && Boolean(formik.errors.item_deduction)}
                                helperText={formik.touched.item_deduction && formik.errors.item_deduction}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                id="item_tax_amount"
                                name="item_tax_amount"
                                label={<Required title="Tax Amount" />}
                                value={formik.values.item_tax_amount}
                                onChange={(e) => {
                                    initFormValue.item_tax_amount = e.target.value;
                                    formik.handleChange(e);
                                }}
                                error={formik.touched.item_tax_amount && Boolean(formik.errors.item_tax_amount)}
                                helperText={formik.touched.item_tax_amount && formik.errors.item_tax_amount}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                size="small"
                                id="item_discount"
                                name="item_discount"
                                label={<Required title="Discount" />}
                                value={formik.values.item_discount}
                                onChange={(e) => {
                                    initFormValue.item_discount = e.target.value;
                                    changeAmount();
                                    formik.handleChange(e);
                                }}
                                error={formik.touched.item_discount && Boolean(formik.errors.item_discount)}
                                helperText={formik.touched.item_discount && formik.errors.item_discount}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                id="item_amount"
                                name="item_amount"
                                label={<Required title="Amount" />}
                                value={formik.values.item_amount}
                                onChange={(e) => {
                                    initFormValue.item_amount = e.target.value;
                                    formik.handleChange(e);
                                }}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                size="small"
                                id="item_description"
                                name="item_description"
                                label="Description"
                                value={formik.values.item_description}
                                onChange={formik.handleChange}
                                error={formik.touched.item_description && Boolean(formik.errors.item_description)}
                                helperText={formik.touched.item_description && formik.errors.item_description}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};
