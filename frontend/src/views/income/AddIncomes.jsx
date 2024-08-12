import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// third party
import * as yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Divider, Grid, IconButton, InputAdornment, MenuItem, TextField } from '@mui/material';
import Required from 'views/utilities/Required';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AddCircleOutlineOutlined, DeleteOutline } from '@mui/icons-material';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import { AddIncomesApi, SubcategoryListApi } from 'apis/Incomes';

const validationSchema = yup.object().shape({
    company_id: yup.string().required('Company is required.'),
    month_year: yup.string().required('Month / Year is required.'),
    incomes: yup.array().of(
        yup.object().shape({
            category_id: yup.string().required('Category type is required.'),
            subcategory_id: yup.string().required('Subcategory is required.'),
            incomes_title: yup.string().required('Incomes title is required.'),
            date: yup.string().required('Date is required.'),
            amount: yup.number().min(0, 'Amount must be more than 0').required('Amount is required.')
        })
    )
});

const AddIncomes = ({ formID, onSubmit, initData }) => {
    const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM-DD'));

    const initIncomes = {
        category_id: '',
        subcategory_id: '',
        subcategory_list: [],
        incomes_title: '',
        date: moment(selectedMonth).endOf('month').format('YYYY-MM-DD'),
        amount: ''
    };

    const formik = useFormik({
        initialValues: {
            id: '',
            company_id: '',
            month_year: moment().format('YYYY-MM-DD'),
            incomes: [initIncomes],
            formType: 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            AddIncomesApi(values)
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

    const subcategoryHandler = (category_id, rowID) => {
        SubcategoryListApi({ category_id: category_id })
            .then((res) => {
                formik.setFieldValue(`incomes.${rowID}.subcategory_list`, res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    // CheckTouchValidation
    const checkTouchValidation = (filedName, index, columnName) => {
        if (formik.touched[filedName] && formik.touched[filedName][index] && formik.touched[filedName][index][columnName]) {
            if (formik.errors[filedName] && formik.errors[filedName][index] && formik.errors[filedName][index][columnName]) {
                return formik.touched[filedName][index][columnName] && Boolean(formik.errors[filedName][index][columnName]);
            }
            return false;
        }
        return false;
    };

    const checkErrorValidation = (filedName, index, columnName) => {
        if (formik.touched[filedName] && formik.touched[filedName][index] && formik.touched[filedName][index][columnName]) {
            if (formik.errors[filedName] && formik.errors[filedName][index] && formik.errors[filedName][index][columnName]) {
                return formik.touched[filedName][index][columnName] && formik.errors[filedName][index][columnName];
            }
            return '';
        }
        return '';
    };

    const titleHandler = (index, val, type) => {
        const values = formik.values.incomes[index];
        const date = type === 'enroll' ? val : values.date;
        const formatDate = moment(date).format('MMM YYYY');

        const subVal = type === 'sub' ? val : values.subcategory_id;
        const findIndex = values.subcategory_list.findIndex((a) => a.id == subVal);

        let subtitle = '';
        if (findIndex > -1) subtitle = values.subcategory_list[findIndex].name + ' | ';
        const title = subtitle + formatDate;
        formik.setFieldValue(`incomes.${index}.incomes_title`, title.toString());
    };

    useEffect(() => {
        titleHandler(0, moment().endOf('month').format('YYYY-MM-DD'), 'enroll');
    }, []);

    return (
        <form id={formID} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                id="company_id"
                                name="company_id"
                                label={<Required title="Company" />}
                                value={formik.values.company_id}
                                onChange={formik.handleChange}
                                error={formik.touched.company_id && Boolean(formik.errors.company_id)}
                                helperText={formik.touched.company_id && formik.errors.company_id}
                            >
                                {initData.companyList.map((val, idx) => (
                                    <MenuItem key={idx} value={val.id}>
                                        {val.company_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DesktopDatePicker
                                    id="date"
                                    name="date"
                                    views={['year', 'month']}
                                    label={<Required title="Month / Year" />}
                                    // inputFormat="YYYY-MM"
                                    value={selectedMonth}
                                    onChange={(date) => {
                                        formik.setFieldValue(`month_year`, moment(date).format('YYYY-MM-DD'));
                                        setSelectedMonth(moment(date).format('YYYY-MM-DD'));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            fullWidth
                                            size="small"
                                            {...params}
                                            error={formik.touched.month_year && Boolean(formik.errors.month_year)}
                                            helperText={formik.touched.month_year && formik.errors.month_year}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}></Grid>
                {formik.values.incomes.map((i, idx) => (
                    <Grid item xs={12} key={idx}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DesktopDatePicker
                                        id="date"
                                        name="date"
                                        label={<Required title="Enroll date" />}
                                        inputFormat="YYYY-MM-DD"
                                        value={formik.values.incomes[idx]['date']}
                                        maxDate={moment()}
                                        onChange={(date) => {
                                            formik.setFieldValue(`incomes.${idx}.date`, moment(date).format('YYYY-MM-DD'));
                                            titleHandler(idx, date, 'enroll');
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                {...params}
                                                error={checkTouchValidation('incomes', idx, 'date')}
                                                helperText={checkErrorValidation('incomes', idx, 'date')}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    select
                                    size="small"
                                    id={`incomes.${idx}.category_id`}
                                    name={`incomes.${idx}.category_id`}
                                    label={<Required title="Category" />}
                                    value={formik.values.incomes[idx]['category_id']}
                                    onChange={(e) => {
                                        subcategoryHandler(e.target.value, idx);
                                        formik.handleChange(e);
                                    }}
                                    error={checkTouchValidation('incomes', idx, 'category_id')}
                                    helperText={checkErrorValidation('incomes', idx, 'category_id')}
                                >
                                    {initData.categoryList.map((val, idx) => (
                                        <MenuItem key={idx} value={val.id}>
                                            {val.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    select
                                    size="small"
                                    id={`incomes.${idx}.subcategory_id`}
                                    name={`incomes.${idx}.subcategory_id`}
                                    label={<Required title="Subcategory" />}
                                    value={formik.values.incomes[idx]['subcategory_id']}
                                    onChange={(e) => {
                                        titleHandler(idx, e.target.value, 'sub');
                                        formik.handleChange(e);
                                    }}
                                    error={checkTouchValidation('incomes', idx, 'subcategory_id')}
                                    helperText={checkErrorValidation('incomes', idx, 'subcategory_id')}
                                >
                                    {formik.values.incomes[idx]['subcategory_list'].map((val, idx) => (
                                        <MenuItem key={idx} value={val.id}>
                                            {val.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label={<Required title="Incomes Title" />}
                                    id={`incomes.${idx}.incomes_title`}
                                    name={`incomes.${idx}.incomes_title`}
                                    value={formik.values.incomes[idx]['incomes_title']}
                                    onChange={formik.handleChange}
                                    error={checkTouchValidation('incomes', idx, 'incomes_title')}
                                    helperText={checkErrorValidation('incomes', idx, 'incomes_title')}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    // type={'number'}
                                    label={<Required title="Amount" />}
                                    id={`incomes.${idx}.amount`}
                                    name={`incomes.${idx}.amount`}
                                    value={formik.values.incomes[idx]['amount']}
                                    onChange={formik.handleChange}
                                    error={checkTouchValidation('incomes', idx, 'amount')}
                                    helperText={checkErrorValidation('incomes', idx, 'amount')}
                                    InputProps={{
                                        endAdornment:
                                            idx < 1 ? (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        edge="end"
                                                        color="primary"
                                                        component="label"
                                                        onClick={() => {
                                                            const currentExp = formik.values.incomes;
                                                            formik.setFieldValue('incomes', [...currentExp, initIncomes]);
                                                        }}
                                                    >
                                                        <AddCircleOutlineOutlined fontSize="medium" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        edge="end"
                                                        color="error"
                                                        component="label"
                                                        onClick={() => {
                                                            const currentExp = formik.values.incomes;
                                                            formik.setFieldValue(
                                                                'incomes',
                                                                currentExp.filter((i, ck) => ck !== idx)
                                                            );
                                                        }}
                                                    >
                                                        <DeleteOutline fontSize="medium" />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Divider sx={{ bgcolor: 'secondary' }} />
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </form>
    );
};

AddIncomes.propTypes = {
    formID: PropTypes.string,
    onSubmit: PropTypes.func,
    initData: PropTypes.object
};

export default AddIncomes;
