import { Autocomplete, Checkbox, Grid, MenuItem, TextField } from '@mui/material';
import { CompanyFinancialYearListApi } from 'apis/Auth';
import { YOYReportApi } from 'apis/Reports';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import propTypes from 'prop-types';
import { useState } from 'react';
import { useEffect } from 'react';
import { apiErrorSnackBar } from 'utils/SnackBar';
// third party
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    company_id: yup.string().required('Company is required.'),
    financial_years: yup.array().min(1, 'At Least Select 1 Year')
});

const GenerateForm = ({ value, formID, initData, setReportData, onSubmit }) => {
    const { company } = useAuth();
    const [financialYear, setFinancialYear] = useState([]);
    const initialData = initData ?? false;
    const initValue = Object.keys(value).length > 0 ? value : false;

    const formik = useFormik({
        initialValues: {
            // company_id: initValue ? initValue.company_id ?? company.company_id : company.company_id,
            company_id: initValue ? initValue.company_id : '',
            financial_years: []
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            YOYReportApi(values)
                .then((res) => {
                    if (onSubmit) onSubmit();
                    setReportData(res.data.data);
                })
                .catch((err) => {
                    apiErrorSnackBar(err);
                });
        }
    });

    const changeHandler = (id) => {
        formik.setFieldValue('financial_years', []);
        CompanyFinancialYearListApi(id)
            .then((res) => {
                setFinancialYear(res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    useEffect(() => {
        if (formik.values.company_id != '0') {
            const id = formik.values.company_id;
            changeHandler(id);
        }
    }, []);

    return (
        <form id={formID} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        select
                        size="small"
                        label="Company"
                        fullWidth
                        id="company_id"
                        name="company_id"
                        value={formik.values.company_id}
                        onChange={(e) => {
                            changeHandler(e.target.value);
                            formik.handleChange(e);
                        }}
                        error={formik.touched.company_id && Boolean(formik.errors.company_id)}
                        helperText={formik.touched.company_id && formik.errors.company_id}
                    >
                        {initialData &&
                            initialData.companyList.map((i, idx) => (
                                <MenuItem key={idx} value={i.id}>
                                    {i.company_name}
                                </MenuItem>
                            ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        size="small"
                        id="financial_years"
                        name="financial_years"
                        options={financialYear ? financialYear : []}
                        getOptionLabel={(option) => (option.financial_year_name ? option.financial_year_name : '')}
                        value={formik.values.financial_years}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox checked={selected} value={option.id} />
                                {option.financial_year_name}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                id="financial_years"
                                name="financial_years"
                                label="Financial Year"
                                error={formik.touched.financial_years && Boolean(formik.errors.financial_years)}
                                helperText={formik.touched.financial_years && formik.errors.financial_years}
                            />
                        )}
                        onChange={(_, value) => {
                            formik.setFieldValue('financial_years', value);
                        }}
                    />
                </Grid>
            </Grid>
        </form>
    );
};

GenerateForm.propTypes = {
    value: propTypes.object,
    formID: propTypes.string.isRequired,
    initData: propTypes.object,
    setReportData: propTypes.func,
    onSubmit: propTypes.func
};

export default GenerateForm;
