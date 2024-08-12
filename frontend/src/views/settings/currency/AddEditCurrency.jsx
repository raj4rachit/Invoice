import propTypes from 'prop-types';

import { Box, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';

// third party
import * as yup from 'yup';
import { AddUpdateCurrencyApi } from 'apis/Settings';

const validationSchema = yup.object().shape({
    currency_name: yup.string().required('Currency name is required.'),
    currency_symbol: yup.string().required('Currency symbol is required.'),
    short_code: yup.string().min(3, 'Short code must be at least 3 Character ').required('Short code is required.'),
    locale: yup.string().required('Locale is required.'),
    status: yup.string().required('Currency status is required.')
});

const status = [{ label: 'Active' }, { label: 'Inactive' }];

const AddEditCurrency = ({ value, formId, onSubmit, currencyLocale }) => {
    const initValue = value ?? false;

    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            currency_name: initValue ? initValue.currency_name : '',
            currency_symbol: initValue ? initValue.currency_symbol : '',
            short_code: initValue ? initValue.short_code : '',
            locale: initValue ? initValue.locale : '',
            status: initValue ? initValue.status : 'Active',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            AddUpdateCurrencyApi(values)
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
                                    <Required title="Currency Name" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="currency_name"
                                    name="currency_name"
                                    label={<Required title="Currency name" />}
                                    defaultValue={formik.values.currency_name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.currency_name && Boolean(formik.errors.currency_name)}
                                    helperText={formik.touched.currency_name && formik.errors.currency_name}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Currency Symbol" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="currency_symbol"
                                    name="currency_symbol"
                                    label={<Required title="Currency symbol" />}
                                    inputProps={{ maxLength: 3 }}
                                    defaultValue={formik.values.currency_symbol}
                                    onChange={formik.handleChange}
                                    error={formik.touched.currency_symbol && Boolean(formik.errors.currency_symbol)}
                                    helperText={formik.touched.currency_symbol && formik.errors.currency_symbol}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Short Code " />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="short_code"
                                    name="short_code"
                                    label={<Required title="Short code" />}
                                    inputProps={{ maxLength: 3 }}
                                    value={formik.values.short_code}
                                    onChange={(e) => {
                                        formik.setFieldValue('short_code', e.target.value.toUpperCase());
                                    }}
                                    error={formik.touched.short_code && Boolean(formik.errors.short_code)}
                                    helperText={formik.touched.short_code && formik.errors.short_code}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Locale" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControl size="small" fullWidth error={formik.touched.locale && Boolean(formik.errors.locale)}>
                                    <InputLabel id="locale">
                                        <Required title="Locale" />
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="locale"
                                        id="locale"
                                        name="locale"
                                        label={<Required title="Locale" />}
                                        value={formik.values.locale}
                                        onChange={formik.handleChange}
                                    >
                                        {currencyLocale.map((item, idx) => (
                                            <MenuItem value={item} key={idx}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{formik.touched.locale && formik.errors.locale}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">Currency Status</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControl size="small" fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                                    <InputLabel id="status">Currency Status</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="status"
                                        id="status"
                                        name="status"
                                        label="Currency Status"
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
AddEditCurrency.propTypes = {
    value: propTypes.object,
    formId: propTypes.string.isRequired,
    onSubmit: propTypes.func
};

export default AddEditCurrency;
