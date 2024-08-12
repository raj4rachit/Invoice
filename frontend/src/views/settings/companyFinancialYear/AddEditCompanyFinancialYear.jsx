import { Box, Button, DialogActions, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { addUpdateCompanyFinancialYearApi } from 'apis/CompanyFinancialYear';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import moment from 'moment';
import propTypes from 'prop-types';
import { useEffect } from 'react';
import { useCallback } from 'react';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';

// third party
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    company_id: yup.string().required('Company name is required.'),
    financial_year_name: yup.string().required('name is required.'),
    start_date: yup.string().required('Start date is required.'),
    end_date: yup.string().required('End date is required.'),
    is_default: yup.string().required('Is default is required.')
});

const AddEditCompanyFinancialYear = ({ value, formId, onSubmit, companyList, callApi }) => {
    const { company, recall } = useAuth();
    const initValue = value ?? false;
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            company_id: initValue ? initValue.company_id : '',
            financial_year_name: initValue ? initValue.financial_year_name : '',
            start_date: initValue ? initValue.start_date : '',
            end_date: initValue ? initValue.end_date : '',
            is_default: initValue ? initValue?.is_default : 'No',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            addUpdateCompanyFinancialYearApi(values)
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

    useEffect(() => {
        formik.setFieldValue('company_id', initValue ? initValue.company_id : company.company_id !== '0' ? company.company_id : '');
    }, [recall]);

    return (
        <Box>
            <form id={formId} onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <FormControl size="small" fullWidth error={formik.touched.company_id && Boolean(formik.errors.company_id)}>
                                    <InputLabel id="company">{<Required title="Company" />}</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="company"
                                        id="company_id"
                                        name="company_id"
                                        label={<Required title="Company" />}
                                        value={formik.values.company_id}
                                        onChange={formik.handleChange}
                                    >
                                        {companyList.map((item) => (
                                            <MenuItem value={item.id} key={item.id}>
                                                {item.company_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{formik.touched.company_id && formik.errors.company_id}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="financial_year_name"
                                    name="financial_year_name"
                                    label={<Required title="Name" />}
                                    value={formik.values.financial_year_name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.financial_year_name && Boolean(formik.errors.financial_year_name)}
                                    helperText={formik.touched.financial_year_name && formik.errors.financial_year_name}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DesktopDatePicker
                                        id="start_date"
                                        name="start_date"
                                        label={<Required title="Start date" />}
                                        inputFormat="YYYY-MM-DD"
                                        value={formik.values.start_date}
                                        maxDate={moment()}
                                        onChange={(date) => {
                                            formik.setFieldValue('start_date', moment(date).format('YYYY-MM-DD'));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                {...params}
                                                error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                                                helperText={formik.touched.start_date && formik.errors.start_date}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DesktopDatePicker
                                        id="end_date"
                                        name="end_date"
                                        label={<Required title="End date" />}
                                        inputFormat="YYYY-MM-DD"
                                        value={formik.values.end_date}
                                        minDate={moment(formik.values.start_date)}
                                        disabled={!formik.values.start_date}
                                        onChange={(date) => {
                                            formik.setFieldValue('end_date', moment(date).format('YYYY-MM-DD'));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                {...params}
                                                error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                                                helperText={formik.touched.end_date && formik.errors.end_date}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <FormControl size="small" fullWidth error={formik.touched.is_default && Boolean(formik.errors.is_default)}>
                                    <InputLabel id="IsDefault_label">
                                        <Required title="Is Default ?" />
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="IsDefault_label"
                                        id="is_default"
                                        name="is_default"
                                        label={<Required title="Is Default ?" />}
                                        value={formik.values.is_default}
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value={'Yes'} key={0}>
                                            Yes
                                        </MenuItem>
                                        <MenuItem value={'No'} key={1}>
                                            No
                                        </MenuItem>
                                    </Select>
                                    <FormHelperText>{formik.touched.is_default && formik.errors.is_default}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    {formik.values.formType === 'add' && (
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2} justifyContent="flex-end">
                                <Grid item xs={12}>
                                    <DialogActions>
                                        <AnimateButton>
                                            <Button variant="contained" color="primary" type="submit">
                                                save
                                            </Button>
                                        </AnimateButton>
                                        <Button variant="text" color="error" onClick={() => formik.resetForm()}>
                                            clear
                                        </Button>
                                    </DialogActions>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </form>
        </Box>
    );
};

// ========== PropTypes ========== //

AddEditCompanyFinancialYear.propTypes = {
    value: propTypes.object,
    formId: propTypes.string,
    onSubmit: propTypes.func
};

export default AddEditCompanyFinancialYear;
