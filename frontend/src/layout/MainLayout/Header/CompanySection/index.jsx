import propTypes from 'prop-types';
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { ChangeCompanyApi, CompanyFinancialYearListApi } from 'apis/Auth';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN, OPEN_COMPANY } from 'store/actions';
import Required from 'views/utilities/Required';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

// third party
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    company_id: yup.string().required('Company is required.'),
    financial_year: yup.string().when('company_id', { is: (val) => val != '0', then: yup.string().required('Start date is required.') }),
    start_date: yup.string().when('company_id', { is: '0', then: yup.string().required('Start date is required.') }),
    end_date: yup.string().when('company_id', { is: '0', then: yup.string().required('End date is required.') })
});

const CompanySection = ({ value, formID, isOpen }) => {
    const initValue = value ?? false;
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.account);
    const companyData = cart.company;
    const { recallComponent } = useAuth();
    const [financialYear, setFinancialYear] = useState([]);
    const [companyList1, setCompanyList1] = useState([]);

    const formik = useFormik({
        initialValues: {
            company_id: initValue && initValue.company_id ? initValue.company_id : '0',
            financial_year: initValue && initValue.year_id ? initValue.year_id : '',
            start_date: initValue && initValue.year_id ? initValue.year_id : moment(companyData.start_date).format('YYYY-MM-DD'),
            end_date: initValue && initValue.year_id ? initValue.year_id : moment(companyData.end_date).format('YYYY-MM-DD')
        },
        validationSchema: validationSchema,
        onSubmit: (value) => {
            if (value.company_id === '0') {
                const financialYearData = value.financial_year ? financialYear.filter((a) => a.year_id === value.financial_year)[0] : '';
                dispatch({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user: cart.user,
                        access: cart.access,
                        company: {
                            company_id: '0',
                            start_date: value.start_date,
                            end_date: value.end_date,
                            ...financialYearData
                        }
                    }
                });
                localStorage.setItem(
                    'companyData',
                    JSON.stringify({
                        company_id: '0',
                        start_date: value.start_date,
                        end_date: value.end_date,
                        ...financialYearData
                    })
                );
            } else {
                const companyData = companyList1.filter((a) => a.company_id === value.company_id)[0];
                const financialYearData = financialYear.filter((a) => a.year_id === value.financial_year)[0];

                const yearData = financialYearData ? financialYearData : {};
                dispatch({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user: cart.user,
                        access: cart.access,
                        company: {
                            ...companyData,
                            ...yearData
                        }
                    }
                });
                localStorage.setItem(
                    'companyData',
                    JSON.stringify({
                        ...companyData,
                        ...yearData
                    })
                );
            }

            dispatch({
                type: OPEN_COMPANY,
                isOpen: false
            });
            recallComponent();
        }
    });

    const changeHandler = async (id) => {
        formik.setFieldValue('financial_year', '');
        await CompanyFinancialYearListApi(id)
            .then((res) => {
                setFinancialYear(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (isOpen) {
            if (initValue.company_id && initValue.company_id != '0') {
                changeHandler(initValue.company_id);
            }

            ChangeCompanyApi()
                .then((res) => {
                    setCompanyList1(res.data.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [isOpen, initValue]);

    return (
        <form id={formID} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <FormControl size="small" fullWidth error={formik.touched.company_id && Boolean(formik.errors.company_id)}>
                                <InputLabel id="companyLabel">
                                    <Required title="Company" />
                                </InputLabel>
                                <Select
                                    fullWidth
                                    labelId="companyLabel"
                                    id="company_id"
                                    name="company_id"
                                    label={<Required title="Company" />}
                                    value={formik.values.company_id}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        changeHandler(e.target.value);
                                    }}
                                >
                                    <MenuItem value={'0'} key={'-1'}>
                                        All company
                                    </MenuItem>
                                    {companyList1.length > 0 &&
                                        companyList1.map((item, idx) => (
                                            <MenuItem value={item.company_id} key={idx}>
                                                {item.company_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                                <FormHelperText>{formik.touched.invoice_currency_id && formik.errors.invoice_currency_id}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                {formik.values.company_id === '0' ? (
                    <>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <DesktopDatePicker
                                            id="start_date"
                                            name="start_date"
                                            label={<Required title="Start Date" />}
                                            inputFormat="YYYY-MM-DD"
                                            value={formik.values.start_date}
                                            // maxDate={moment()}
                                            onChange={(date) => {
                                                if (date != null) {
                                                    if (date.isValid()) {
                                                        formik.setFieldValue('start_date', moment(date).format('YYYY-MM-DD'));
                                                    } else {
                                                        formik.setFieldValue('start_date', '');
                                                    }
                                                } else {
                                                    formik.setFieldValue('start_date', '');
                                                }
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
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <DesktopDatePicker
                                            id="end_date"
                                            name="end_date"
                                            label={<Required title="End Date" />}
                                            inputFormat="YYYY-MM-DD"
                                            value={formik.values.end_date}
                                            // maxDate={moment()}
                                            onChange={(date) => {
                                                if (date != null) {
                                                    if (date.isValid()) {
                                                        formik.setFieldValue('end_date', moment(date).format('YYYY-MM-DD'));
                                                    } else {
                                                        formik.setFieldValue('end_date', '');
                                                    }
                                                } else {
                                                    formik.setFieldValue('end_date', '');
                                                }
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
                                    </Grid>
                                </Grid>
                            </Grid>
                        </LocalizationProvider>
                    </>
                ) : (
                    <>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl
                                        size="small"
                                        fullWidth
                                        error={formik.touched.financial_year && Boolean(formik.errors.financial_year)}
                                    >
                                        <InputLabel id="financial_year">
                                            <Required title="Financial year" />
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="financial_year"
                                            id="financial_year"
                                            name="financial_year"
                                            label={<Required title="Financial year" />}
                                            value={formik.values.financial_year}
                                            onChange={formik.handleChange}
                                        >
                                            {financialYear.map((item, idx) => (
                                                <MenuItem value={item.year_id} key={idx}>
                                                    {item.financial_year_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{formik.touched.financial_year && formik.errors.financial_year}</FormHelperText>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
        </form>
    );
};

CompanySection.propTypes = {
    value: propTypes.object,
    formID: propTypes.string.isRequired,
    isOpen: propTypes.bool
};

export default CompanySection;
