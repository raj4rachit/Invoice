import { Box, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { addUpdateCountryTaxApi } from 'apis/Settings';
import { useFormik } from 'formik';
import propTypes from 'prop-types';
import { forwardRef } from 'react';
import { NumericFormat } from 'react-number-format';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';

// third party
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    tax_name: yup.string().required('Tax name is required.'),
    rate: yup.string().required('Rate is required.'),
    is_percentage: yup.string().required('Percentage is required.'),
    country_id: yup.string().required('Country is required.'),
    status: yup.string().required('Status is required.')
});

const status = [{ label: 'Active' }, { label: 'Inactive' }];

const Percentage = [
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' }
];

const RateFormate = forwardRef(function RateFormate(props, ref) {
    const { onChange, ...other } = props;
    return (
        <NumericFormat
            {...other}
            decimalScale={2}
            suffix={'%'}
            getInputRef={(inputRef) => {
                ref = inputRef;
            }}
            isAllowed={(values, sourceInfo) => {
                const { value } = values;
                return value <= 100;
            }}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value
                    }
                });
            }}
            type="input"
        />
    );
});

const AddEditCountryTax = ({ value, formId, onSubmit, countryList }) => {
    const initValue = value ?? false;
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            tax_name: initValue ? initValue.tax_name : '',
            rate: initValue ? initValue.rate : '',
            is_percentage: initValue ? initValue.is_percentage : 'Yes',
            country_id: initValue ? initValue.country_id : '',
            status: initValue ? 'Active' : 'Active',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            addUpdateCountryTaxApi(values)
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
    return (
        <Box>
            <form id={formId} onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Country" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControl size="small" fullWidth error={formik.touched.country_id && Boolean(formik.errors.country_id)}>
                                    <InputLabel id="country_id">
                                        <Required title="Country" />
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="country_id"
                                        id="country_id"
                                        name="country_id"
                                        label={<Required title="Country" />}
                                        value={formik.values.country_id}
                                        onChange={formik.handleChange}
                                    >
                                        {countryList.map((item) => (
                                            <MenuItem value={item.id} key={item.id}>
                                                {item.country_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{formik.touched.country_id && formik.errors.country_id}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Tax name" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="tax_name"
                                    name="tax_name"
                                    label={<Required title="Tax name" />}
                                    value={formik.values.tax_name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.tax_name && Boolean(formik.errors.tax_name)}
                                    helperText={formik.touched.tax_name && formik.errors.tax_name}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Rate" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="rate"
                                    name="rate"
                                    placeholder="Rate"
                                    defaultValue={formik.values.rate}
                                    onChange={(e) => {
                                        formik.setFieldValue('rate', e.target.value);
                                    }}
                                    InputProps={{
                                        inputComponent: RateFormate
                                    }}
                                    error={formik.touched.rate && Boolean(formik.errors.rate)}
                                    helperText={formik.touched.rate && formik.errors.rate}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Percentage" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    error={formik.touched.is_percentage && Boolean(formik.errors.is_percentage)}
                                >
                                    <InputLabel id="is_percentage">
                                        <Required title="Percentage" />
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="is_percentage"
                                        id="is_percentage"
                                        name="is_percentage"
                                        label={<Required title="Percentage" />}
                                        value={formik.values.is_percentage}
                                        onChange={formik.handleChange}
                                        disabled
                                    >
                                        {Percentage.map((item) => (
                                            <MenuItem value={item.name} key={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{formik.touched.is_percentage && formik.errors.is_percentage}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">Status</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControl size="small" fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                                    <InputLabel id="status">Status</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="status"
                                        id="status"
                                        name="status"
                                        label="Status"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                    >
                                        {status.map((item, idx) => (
                                            <MenuItem value={item.label} key={idx}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

// ========== PropTypes ========== //

AddEditCountryTax.propTypes = {
    value: propTypes.object,
    formId: propTypes.string.isRequired,
    onSubmit: propTypes.func
};

export default AddEditCountryTax;
