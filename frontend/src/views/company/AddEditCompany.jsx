import { Autocomplete, Box, Checkbox, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { addUpdateCompanyApi } from 'apis/Company';
import { useFormik } from 'formik';
import moment from 'moment';
import propTypes from 'prop-types';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';

// third party
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    company_name: yup.string().required('Company name is required.'),
    trading_name: yup.string().required('Trading name is required.'),
    email: yup.string().email().required('Email is required.'),
    contact_number: yup.string().required('Phone no. is required.'),
    website: yup.string().required('Email is required.'),
    enroll_date: yup.string().required('Enroll date is required.'),
    tax_no: yup.string().required('TAX no. is required.'),
    gst_vat_no: yup.string().required('GST/VAT no. is required.'),
    currency_id: yup.string().required('Currency is required.'),
    address_1: yup.string().required('Address is required.'),
    city: yup.string().required('City is required.'),
    state: yup.string().required('State is required.'),
    zip_code: yup.string().required('Zip code is required.'),
    country_id: yup.string().required('Country is required.'),
    status: yup.string().required('Status is required.')
});

const status = [{ label: 'Active' }, { label: 'Inactive' }];

const AddEditCompany = ({ value, formId, onSubmit, initData }) => {
    const initValue = value ?? false;
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            company_name: initValue ? initValue.company_name : '',
            trading_name: initValue ? initValue.trading_name : '',
            email: initValue ? initValue.email : '',
            contact_number: initValue ? initValue.contact_number : '',
            website: initValue ? initValue.website : '',
            registration_no: initValue ? initValue.registration_no : '',
            enroll_date: initValue ? initValue.enroll_date : '',
            tax_no: initValue ? initValue.tax_no : '',
            gst_vat_no: initValue ? initValue.gst_vat_no : '',
            currency_id: initValue ? initValue.currency_id : '',
            address_1: initValue ? initValue.address_1 : '',
            address_2: initValue ? initValue.address_2 : '',
            city: initValue ? initValue.city : '',
            state: initValue ? initValue.state : '',
            zip_code: initValue ? initValue.zip_code : '',
            country_id: initValue ? initValue.country_id : '',
            client_id: initValue ? initValue.selectedClient : [],
            status: initValue ? initValue.status : 'Active',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            addUpdateCompanyApi(values)
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
                            id="company_name"
                            name="company_name"
                            label={<Required title="Company name" />}
                            value={formik.values.company_name}
                            onChange={formik.handleChange}
                            error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                            helperText={formik.touched.company_name && formik.errors.company_name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            id="trading_name"
                            name="trading_name"
                            label={<Required title="Trading name" />}
                            value={formik.values.trading_name}
                            onChange={formik.handleChange}
                            error={formik.touched.trading_name && Boolean(formik.errors.trading_name)}
                            helperText={formik.touched.trading_name && formik.errors.trading_name}
                        />
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
                            id="contact_number"
                            name="contact_number"
                            label={<Required title="Phone no." />}
                            value={formik.values.contact_number}
                            onChange={formik.handleChange}
                            error={formik.touched.contact_number && Boolean(formik.errors.contact_number)}
                            helperText={formik.touched.contact_number && formik.errors.contact_number}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            id="website"
                            name="website"
                            label={<Required title="Website" />}
                            value={formik.values.website}
                            onChange={formik.handleChange}
                            error={formik.touched.website && Boolean(formik.errors.website)}
                            helperText={formik.touched.website && formik.errors.website}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            id="registration_no"
                            name="registration_no"
                            label="Registration no."
                            value={formik.values.registration_no}
                            onChange={formik.handleChange}
                            error={formik.touched.registration_no && Boolean(formik.errors.registration_no)}
                            helperText={formik.touched.registration_no && formik.errors.registration_no}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DesktopDatePicker
                                id="enroll_date"
                                name="enroll_date"
                                label={<Required title="Enroll date" />}
                                inputFormat="YYYY-MM-DD"
                                value={formik.values.enroll_date}
                                maxDate={moment()}
                                onChange={(date) => {
                                    formik.setFieldValue('enroll_date', moment(date).format('YYYY-MM-DD'));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        {...params}
                                        error={formik.touched.enroll_date && Boolean(formik.errors.enroll_date)}
                                        helperText={formik.touched.enroll_date && formik.errors.enroll_date}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            id="tax_no"
                            name="tax_no"
                            label={<Required title="TAX no." />}
                            value={formik.values.tax_no}
                            onChange={formik.handleChange}
                            error={formik.touched.tax_no && Boolean(formik.errors.tax_no)}
                            helperText={formik.touched.tax_no && formik.errors.tax_no}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            id="gst_vat_no"
                            name="gst_vat_no"
                            label={<Required title="GST/VAT no." />}
                            value={formik.values.gst_vat_no}
                            onChange={formik.handleChange}
                            error={formik.touched.gst_vat_no && Boolean(formik.errors.gst_vat_no)}
                            helperText={formik.touched.gst_vat_no && formik.errors.gst_vat_no}
                        />
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
                                {initData?.currencies.map((item, idx) => (
                                    <MenuItem value={item.id} key={idx}>
                                        {item.currency_name} ({item.currency_symbol})
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formik.touched.currency_id && formik.errors.currency_id}</FormHelperText>
                        </FormControl>
                    </Grid>
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
                                    id="zip_code"
                                    name="zip_code"
                                    label={<Required title="Zipcode" />}
                                    value={formik.values.zip_code}
                                    onChange={formik.handleChange}
                                    error={formik.touched.zip_code && Boolean(formik.errors.zip_code)}
                                    helperText={formik.touched.zip_code && formik.errors.zip_code}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                                        {initData?.countries.map((item, idx) => (
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
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            label="Client"
                            id="client_id"
                            name="client_id"
                            options={initData.clients ?? []}
                            getOptionLabel={(option) => (option.client_name ? option.client_name : '')}
                            value={
                                formik.values.client_id !== ''
                                    ? initData.clients.filter((a) => formik.values.client_id.some((b) => b.id === a.id))
                                    : null
                            }
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox checked={selected} value={option.id} />
                                    {`${option.company_name} - ${option.client_name}`}
                                </li>
                            )}
                            renderInput={(params) => <TextField {...params} size="small" name="client_id" label="Client" />}
                            onChange={(_, v) => {
                                formik.setFieldValue('client_id', v);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl size="small" fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                            <InputLabel id="status">status</InputLabel>
                            <Select
                                fullWidth
                                labelId="status"
                                id="status"
                                name="status"
                                label="status"
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

AddEditCompany.propTypes = {
    value: propTypes.object,
    formId: propTypes.string.isRequired,
    onSubmit: propTypes.func,
    initData: propTypes.object
};

export default AddEditCompany;
