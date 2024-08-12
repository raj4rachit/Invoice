import { Grid, MenuItem, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AddUpdateExpensesApi, SubcategoryListApi } from 'apis/Expenses';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import moment from 'moment';
import propTypes from 'prop-types';
import { useState } from 'react';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';

// third party
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    company_id: yup.string().required('Company is required.'),
    category_id: yup.string().required('Category is required.'),
    subcategory_id: yup.string().required('Subcategory is required.'),
    expenses_title: yup.string().required('Title is required.'),
    date: yup.date().required('Date is required.'),
    amount: yup.string().required('Amount is required.')
});

const AddEditExpenses = ({ value, formID, onSubmit, initData }) => {
    const { company } = useAuth();
    const initValue = value ?? false;
    const [subcategory, setSubcategory] = useState(initValue ? initValue.subcategories : []);
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            company_id: initValue ? initValue.company_id : company.company_id !== '0' ? company.company_id : '',
            category_id: initValue ? initValue.category_id : '',
            subcategory_id: initValue ? initValue.subcategory_id : '',
            expenses_title: initValue ? initValue.title : '',
            date: initValue ? moment(initValue.date) : moment(),
            amount: initValue ? initValue.amount : '',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            values.date = moment(values.date).format('YYYY-MM-DD');
            AddUpdateExpensesApi(values)
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

    const subcategoryHandler = (category_id) => {
        SubcategoryListApi({ category_id: category_id })
            .then((res) => {
                setSubcategory(res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    return (
        <form id={formID} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
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
                        <Grid item xs={12} sm={12}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DesktopDatePicker
                                    id="date"
                                    name="date"
                                    label={<Required title="Enroll date" />}
                                    inputFormat="YYYY-MM-DD"
                                    value={formik.values.date}
                                    maxDate={moment()}
                                    onChange={(date) => {
                                        formik.setFieldValue('date', moment(date));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            fullWidth
                                            size="small"
                                            {...params}
                                            error={formik.touched.date && Boolean(formik.errors.date)}
                                            helperText={formik.touched.date && formik.errors.date}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                id="category_id"
                                name="category_id"
                                label={<Required title="Category" />}
                                value={formik.values.category_id}
                                onChange={(e) => {
                                    subcategoryHandler(e.target.value);
                                    formik.handleChange(e);
                                }}
                                error={formik.touched.category_id && Boolean(formik.errors.category_id)}
                                helperText={formik.touched.category_id && formik.errors.category_id}
                            >
                                {initData.categoryList.map((val, idx) => (
                                    <MenuItem key={idx} value={val.id}>
                                        {val.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                id="subcategory_id"
                                name="subcategory_id"
                                label={<Required title="Subcategory" />}
                                value={formik.values.subcategory_id}
                                onChange={formik.handleChange}
                                error={formik.touched.subcategory_id && Boolean(formik.errors.subcategory_id)}
                                helperText={formik.touched.subcategory_id && formik.errors.subcategory_id}
                            >
                                {subcategory.map((val, idx) => (
                                    <MenuItem key={idx} value={val.id}>
                                        {val.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                size="small"
                                id="expenses_title"
                                name="expenses_title"
                                label={<Required title="Expenses Title" />}
                                value={formik.values.expenses_title}
                                onChange={formik.handleChange}
                                error={formik.touched.expenses_title && Boolean(formik.errors.expenses_title)}
                                helperText={formik.touched.expenses_title && formik.errors.expenses_title}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                size="small"
                                id="amount"
                                name="amount"
                                label={<Required title="Amount" />}
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                                helperText={formik.touched.amount && formik.errors.amount}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

// ========== PropTypes ========== //

AddEditExpenses.propTypes = {
    value: propTypes.object,
    formID: propTypes.string,
    onSubmit: propTypes.func,
    initData: propTypes.object
};

export default AddEditExpenses;
