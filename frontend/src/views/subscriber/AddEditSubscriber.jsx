import { Box, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { addUpdateSubscriberApi } from 'apis/Subscriber';
import { useFormik } from 'formik';
import moment from 'moment';
import propTypes from 'prop-types';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';

// third party
import * as yup from 'yup';

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

const validationSchema = yup.object().shape({
    official_name: yup.string().required('Official name is required.'),
    first_name: yup.string().required('First name is required.'),
    last_name: yup.string().required('Last name is required.'),
    email: yup.string().email().required('Email is required.'),
    phone: yup.string().required('Mobile number is required.'),
    address_1: yup.string().required('Address is required.'),
    city: yup.string().required('City is required.'),
    state: yup.string().required('State is required.'),
    zipcode: yup.string().required('Zipcode is required.'),
    country_id: yup.string().required('Country is required.'),
    currency_id: yup.string().required('Currency is required.'),
    start_date: yup.date().required('Financial Year Start date is required.'),
    end_date: yup.date().required('Financial Year End date is required.'),
    logo: yup
        .mixed()
        .nullable()
        .test(2000000, 'File size is too big put under 2 MB', (value) => !value || (value && value.size <= 2000000))
        .test('format', 'Invalid file formate', (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type)))
});

const status = [{ label: 'Active' }, { label: 'Inactive' }];

const AddEditSubscriber = ({ value, formId, onSubmit, subscriberCountryList, subscriberCurrencyList }) => {
    const initValue = value ?? false;
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            official_name: initValue ? initValue.official_name : '',
            first_name: initValue ? initValue.first_name : '',
            last_name: initValue ? initValue.last_name : '',
            email: initValue ? initValue.email : '',
            phone: initValue ? initValue.phone : '',
            logo: '',
            address_1: initValue ? initValue.address_1 : '',
            address_2: initValue ? initValue.address_2 : '',
            city: initValue ? initValue.city : '',
            state: initValue ? initValue.state : '',
            zipcode: initValue ? initValue.zipcode : '',
            country_id: initValue ? initValue.country_id : '',
            currency_id: initValue ? initValue.currency_id : '',
            start_date: initValue ? moment(initValue.financial_start_date) : moment('2023-01-01'),
            end_date: initValue ? moment(initValue.financial_end_date) : moment('2023-12-31'),
            status: initValue ? 'Active' : 'Active',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            values.start_date = moment(values.start_date).startOf('month').format('YYYY-MM-DD');
            values.end_date = moment(values.end_date).endOf('month').format('YYYY-MM-DD');
            addUpdateSubscriberApi(values)
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
                        <TextField
                            fullWidth
                            size="small"
                            id="official_name"
                            name="official_name"
                            label={<Required title="Official Name" />}
                            value={formik.values.official_name}
                            onChange={formik.handleChange}
                            error={formik.touched.official_name && Boolean(formik.errors.official_name)}
                            helperText={formik.touched.official_name && formik.errors.official_name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="first_name"
                                    name="first_name"
                                    label={<Required title="First Name" />}
                                    value={formik.values.first_name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                                    helperText={formik.touched.first_name && formik.errors.first_name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="last_name"
                                    name="last_name"
                                    label={<Required title="Last Name" />}
                                    value={formik.values.last_name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                    helperText={formik.touched.last_name && formik.errors.last_name}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            id="email"
                            name="email"
                            label={<Required title="Email" />}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            id="phone"
                            name="phone"
                            label={<Required title="Mobile Number" />}
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            size="small"
                                            id="address_1"
                                            name="address_1"
                                            label={<Required title="Address 1" />}
                                            value={formik.values.address_1}
                                            onChange={formik.handleChange}
                                            error={formik.touched.address_1 && Boolean(formik.errors.address_1)}
                                            helperText={formik.touched.address_1 && formik.errors.address_1}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            size="small"
                                            id="address_2"
                                            name="address_2"
                                            label="Address 2"
                                            value={formik.values.address_2}
                                            onChange={formik.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            id="city"
                                            name="city"
                                            label={<Required title="City" />}
                                            value={formik.values.city}
                                            onChange={formik.handleChange}
                                            error={formik.touched.city && Boolean(formik.errors.city)}
                                            helperText={formik.touched.city && formik.errors.city}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            id="state"
                                            name="state"
                                            label={<Required title="State" />}
                                            value={formik.values.state}
                                            onChange={formik.handleChange}
                                            error={formik.touched.state && Boolean(formik.errors.state)}
                                            helperText={formik.touched.state && formik.errors.state}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            id="zipcode"
                                            name="zipcode"
                                            label={<Required title="Zipcode" />}
                                            value={formik.values.zipcode}
                                            onChange={formik.handleChange}
                                            error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
                                            helperText={formik.touched.zipcode && formik.errors.zipcode}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl
                                            size="small"
                                            fullWidth
                                            error={formik.touched.country_id && Boolean(formik.errors.country_id)}
                                        >
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
                                                {subscriberCountryList.map((item, idx) => (
                                                    <MenuItem value={item.id} key={idx}>
                                                        {item.country_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>{formik.touched.country_id && formik.errors.country_id}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl size="small" fullWidth error={formik.touched.currency_id && Boolean(formik.errors.currency_id)}>
                            <InputLabel id="currency_id">
                                <Required title="Currency" />
                            </InputLabel>
                            <Select
                                fullWidth
                                labelId="currency_id"
                                id="currency_id"
                                name="currency_id"
                                label={<Required title="Currency" />}
                                value={formik.values.currency_id}
                                onChange={formik.handleChange}
                            >
                                {subscriberCurrencyList.map((item, idx) => (
                                    <MenuItem value={item.id} key={idx}>
                                        {`${item.currency_name} (${item.currency_symbol})`}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formik.touched.currency_id && formik.errors.currency_id}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        views={['year', 'month']}
                                        id="start_date"
                                        name="start_date"
                                        label={<Required title="Financial Year Start Date" />}
                                        value={formik.values.start_date}
                                        onChange={(date) => {
                                            formik.setFieldValue('start_date', moment(date).startOf('month').format('YYYY-MM-DD'));
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
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        views={['year', 'month']}
                                        id="end_date"
                                        name="end_date"
                                        label={<Required title="Financial Year End Date" />}
                                        value={formik.values.end_date}
                                        onChange={(date) => {
                                            formik.setFieldValue('end_date', moment(date).endOf('month').format('YYYY-MM-DD'));
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
                                <TextField
                                    fullWidth
                                    type="file"
                                    size="small"
                                    id="logo"
                                    name="logo"
                                    inputProps={{ accept: 'image/png, image/jpeg, image/jpg' }}
                                    onChange={(event) => {
                                        formik.setFieldValue('logo', event.currentTarget.files[0]);
                                    }}
                                    error={formik.touched.logo && Boolean(formik.errors.logo)}
                                    helperText={formik.touched.logo && formik.errors.logo}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
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
            </form>
        </Box>
    );
};

// ========== PropTypes ========== //

AddEditSubscriber.propTypes = {
    value: propTypes.object,
    subscriberCountryList: propTypes.array,
    subscriberCurrencyList: propTypes.array,
    formId: propTypes.string.isRequired,
    onSubmit: propTypes.func
};

export default AddEditSubscriber;
