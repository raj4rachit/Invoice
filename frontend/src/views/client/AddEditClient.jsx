import { Autocomplete, Box, Checkbox, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { addUpdateClientApi } from 'apis/Client';
import { useFormik } from 'formik';
import moment from 'moment';
import propTypes from 'prop-types';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';

// third party
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    client_name: yup.string().required('Client name is required.'),
    company_name: yup.string().required('Company name is required.'),
    email: yup.string().email().required('Email is required.'),
    phone: yup.string().required('Mobile number is required.'),
    enroll_date: yup.string().required('Enroll date is required.'),
    client_group_id: yup.string().required('Client group is required.'),
    source_by: yup.string().required('Source by is required.'),
    source_from: yup.string().required('Source from is required.'),
    address_1: yup.string().required('Address is required.'),
    city: yup.string().required('City is required.'),
    // state: yup.string().required('State is required.'),
    zip_code: yup.string().required('Zipcode is required.'),
    country_id: yup.string().required('Country is required.')
});

const status = [{ label: 'Active' }, { label: 'Inactive' }];

const AddEditClient = ({ value, formId, onSubmit, initData }) => {
    const initValue = value ?? false;

    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            client_name: initValue ? initValue.client_name : '',
            company_name: initValue ? initValue.company_name : '',
            email: initValue ? initValue.email : '',
            phone: initValue ? initValue.phone : '',
            enroll_date: initValue ? initValue.enroll_date : '',
            tax_no: initValue ? initValue.tax_no : '',
            gst_vat_no: initValue ? initValue.gst_vat_no : '',
            address_1: initValue ? initValue.address_1 : '',
            address_2: initValue ? initValue.address_2 : '',
            city: initValue ? initValue.city : '',
            state: initValue ? initValue.state : '',
            zip_code: initValue ? initValue.zip_code : '',
            country_id: initValue ? initValue.country_id : '',
            is_bifurcated: initValue ? initValue?.is_bifurcated : 'No',
            client_group_id: initValue ? initValue.client_group_id : '',
            source_by: initValue ? initValue.source_by : '',
            source_from: initValue ? initValue.source_from : '',
            contribute_by: initValue ? initValue.contribute_by : [],
            client_companies: initValue ? initValue.client_companies : [],
            status: initValue ? initValue.status : 'Active',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            addUpdateClientApi(values)
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
                            id="client_name"
                            name="client_name"
                            label={<Required title="Client Name" />}
                            value={formik.values.client_name}
                            onChange={formik.handleChange}
                            error={formik.touched.client_name && Boolean(formik.errors.client_name)}
                            helperText={formik.touched.client_name && formik.errors.client_name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            id="company_name"
                            name="company_name"
                            label={<Required title="Company Name" />}
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
                            label={<Required title="Phone Number" />}
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DesktopDatePicker
                                id="enroll_date"
                                name="enroll_date"
                                label={<Required title="Enroll Date" />}
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
                            label="Tax No."
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
                            label="GST/VAT no."
                            value={formik.values.gst_vat_no}
                            onChange={formik.handleChange}
                            error={formik.touched.gst_vat_no && Boolean(formik.errors.gst_vat_no)}
                            helperText={formik.touched.gst_vat_no && formik.errors.gst_vat_no}
                        />
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
                                    label={'State'}
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
                        <FormControl size="small" fullWidth error={formik.touched.source_from && Boolean(formik.errors.source_from)}>
                            <InputLabel id="bifurcated_label">Is Bifurcated ?</InputLabel>
                            <Select
                                fullWidth
                                labelId="bifurcated_label"
                                id="is_bifurcated"
                                name="is_bifurcated"
                                label="Is Bifurcated ?"
                                value={formik.values.is_bifurcated}
                                onChange={formik.handleChange}
                            >
                                <MenuItem value={'Yes'} key={0}>
                                    Yes
                                </MenuItem>
                                <MenuItem value={'No'} key={1}>
                                    No
                                </MenuItem>
                            </Select>
                            <FormHelperText>{formik.touched.is_bifurcated && formik.errors.is_bifurcated}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl
                            size="small"
                            fullWidth
                            error={formik.touched.client_group_id && Boolean(formik.errors.client_group_id)}
                        >
                            <InputLabel id="group_label">
                                <Required title="Client Group" />
                            </InputLabel>
                            <Select
                                fullWidth
                                labelId="group_label"
                                id="client_group_id"
                                name="client_group_id"
                                label={<Required title="Client Group" />}
                                value={formik.values.client_group_id}
                                onChange={formik.handleChange}
                            >
                                {initData?.group.map((item, idx) => (
                                    <MenuItem value={item.id} key={idx}>
                                        {item.group_name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formik.touched.client_group_id && formik.errors.client_group_id}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl size="small" fullWidth error={formik.touched.source_by && Boolean(formik.errors.source_by)}>
                            <InputLabel id="group_label">
                                <Required title="Source By" />
                            </InputLabel>
                            <Select
                                fullWidth
                                labelId="group_label"
                                id="source_by"
                                name="source_by"
                                label={<Required title="Source By" />}
                                value={formik.values.source_by}
                                onChange={formik.handleChange}
                            >
                                {initData?.sourceBy.map((item, idx) => (
                                    <MenuItem value={item.id} key={idx}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formik.touched.source_by && formik.errors.source_by}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl size="small" fullWidth error={formik.touched.source_from && Boolean(formik.errors.source_from)}>
                            <InputLabel id="group_label">
                                <Required title="Source From" />
                            </InputLabel>
                            <Select
                                fullWidth
                                labelId="group_label"
                                id="source_from"
                                name="source_from"
                                label="Source From"
                                value={formik.values.source_from}
                                onChange={formik.handleChange}
                            >
                                {initData?.sourcePlatform.map((item, idx) => (
                                    <MenuItem value={item.id} key={idx}>
                                        {item.platform_name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formik.touched.source_from && formik.errors.source_from}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            size="small"
                            id="contribute_by"
                            name="contribute_by"
                            options={initData?.sourceBy ?? []}
                            getOptionLabel={(option) => (option.name ? option.name : '')}
                            value={
                                initData?.sourceBy
                                    ? initData.sourceBy.filter((a) => formik.values.contribute_by.some((b) => a.id === b))
                                    : []
                            }
                            // isOptionEqualToValue={(option, value) => option.id === value}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox checked={selected} value={option.id} />
                                    {option.name}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} size="small" id="contribute_by" name="contribute_by" label="Contribute By" />
                            )}
                            onChange={(_, v) => {
                                let newArray = [];
                                v.map((i) => {
                                    newArray.push(i.id);
                                });
                                formik.setFieldValue(`contribute_by`, newArray);
                            }}
                        />
                    </Grid>
                    {/* Select client companies start*/}
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            size="small"
                            id="client_companies"
                            name="client_companies"
                            options={initData?.companies ?? []}
                            getOptionLabel={(option) => (option.company_name ? option.company_name : '')}
                            value={
                                initData?.companies
                                    ? initData.companies.filter((a) => formik.values.client_companies?.some((b) => a.id === b))
                                    : []
                            }
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox checked={selected} value={option.id} />
                                    {option.company_name}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    id="client_companies"
                                    name="client_companies"
                                    label="Client Companies"
                                />
                            )}
                            onChange={(_, v) => {
                                let newArray = [];
                                v.map((i) => {
                                    newArray.push(i.id);
                                });
                                formik.setFieldValue(`client_companies`, newArray);
                            }}
                        />
                    </Grid>
                    {/* Select client companies end*/}
                    <Grid item xs={12}>
                        <FormControl size="small" fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                            <InputLabel id="status">Status</InputLabel>
                            <Select
                                fullWidth
                                labelId="Status"
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

AddEditClient.propTypes = {
    value: propTypes.object,
    formId: propTypes.string.isRequired,
    onSubmit: propTypes.func,
    initData: propTypes.object
};

export default AddEditClient;
