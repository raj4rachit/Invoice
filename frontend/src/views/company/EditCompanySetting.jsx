import propTypes from 'prop-types';
import {
    Box,
    Checkbox,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { useFormik } from 'formik';

import AnimateButton from 'ui-component/extended/AnimateButton';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';
import * as yup from 'yup';
import { updateCompanySettingApi } from 'apis/Company';
import moment from 'moment';

const numberPatternType = [
    { id: '1', name: 'Continuation Pattern' },
    { id: '2', name: 'Optional Pattern' }
];

const validationSchema = yup.object().shape({
    company_code: yup.string().required('company code is required.'),
    invoice_prefix_date_format: yup.string().required('invoice prefix date is required.'),
    company_logo: yup.string().required('company logo is required.')
});

const EditCompanySetting = ({ value, formID, onSubmit, initData }) => {
    const initValue = value ?? false;
    const initSettingValue = value.companySetting ?? false;

    const formik = useFormik({
        initialValues: {
            id: initSettingValue ? initSettingValue.id : '',
            company_id: initValue ? initValue.id : '',
            company_code: initSettingValue ? initSettingValue.company_code : '',
            company_logo: initSettingValue ? initSettingValue.company_logo : '',
            invoice_number_type: initSettingValue ? initSettingValue.invoice_number_type : '1',
            prefix_company_code: initSettingValue ? Number(initSettingValue.prefix_company_code) : 0,
            prefix_company_year: initSettingValue ? Number(initSettingValue.prefix_company_year) : 0,
            prefix_company_month: initSettingValue ? Number(initSettingValue.prefix_company_month) : 0,
            invoice_prefix_date_format: initSettingValue ? initSettingValue.invoice_prefix_date_format : ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            updateCompanySettingApi(values)
                .then((res) => {
                    if (res.data && res.data.status === 1) {
                        if (onSubmit) onSubmit();
                        resetForm();
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

    const selectedPrefixYear = () => {
        const prefixYear = formik.values.invoice_prefix_date_format;

        switch (prefixYear) {
            case 'd-M':
                return moment().format('DD-MMM').toUpperCase();
            case 'M':
                return moment().format('MMM').toUpperCase();
            case 'F':
                return moment().format('MMMM').toUpperCase();
            default:
                break;
        }
    };

    return (
        <form id={formID} onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                type="file"
                                size="small"
                                id="company_logo"
                                name="company_logo"
                                label={<Required title="Company Logo" />}
                                onChange={(e) => {
                                    let image = e.target.files[0];
                                    formik.setFieldValue('company_logo', image);
                                }}
                                error={formik.touched.company_logo && Boolean(formik.errors.company_logo)}
                                helperText={formik.touched.company_logo && formik.errors.company_logo}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    inputProps: {
                                        accept: 'image/*'
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                {initSettingValue.company_logo && (
                    <Grid item xs={12}>
                        <Box component="img" maxWidth={'150px'} src={initSettingValue.company_logo} alt="Paella dish" />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                size="small"
                                id="company_code"
                                name="company_code"
                                label={<Required title="Company code" />}
                                value={formik.values.company_code}
                                onChange={formik.handleChange}
                                error={formik.touched.company_code && Boolean(formik.errors.company_code)}
                                helperText={formik.touched.company_code && formik.errors.company_code}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Invoice Number Pattern Start Here */}
                <Grid item xs={12}>
                    <Divider>
                        <Chip label="Invoice Number Pattern" />
                    </Divider>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <FormControl
                                size="small"
                                fullWidth
                                error={formik.touched.invoice_prefix_date_format && Boolean(formik.errors.invoice_prefix_date_format)}
                            >
                                <InputLabel id="invoice_number_type_label">
                                    <Required title="Invoice Number Pattern Type" />
                                </InputLabel>
                                <Select
                                    fullWidth
                                    labelId="iinvoice_number_type_label"
                                    id="invoice_number_type"
                                    name="invoice_number_type"
                                    label={<Required title="Invoice Number Pattern Type" />}
                                    value={formik.values.invoice_number_type}
                                    onChange={formik.handleChange}
                                >
                                    {numberPatternType.map((item, idx) => (
                                        <MenuItem value={item.id} key={idx}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{formik.touched.invoice_number_type && formik.errors.invoice_number_type}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                {formik.values.invoice_number_type === '2' && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                sx={{ ml: 0 }}
                                control={
                                    <Checkbox
                                        sx={{ paddingLeft: '0' }}
                                        size="medium"
                                        id="prefix_company_code"
                                        name="prefix_company_code"
                                        checked={Boolean(formik.values.prefix_company_code)}
                                        onChange={(e) => {
                                            let val = 0;
                                            if (e.target.checked) {
                                                val = 1;
                                            }
                                            formik.setFieldValue('prefix_company_code', val);
                                        }}
                                    />
                                }
                                label={<Typography variant="subtitle1">Company Code</Typography>}
                            >
                                <Divider variant="middle" />
                            </FormControlLabel>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                sx={{ ml: 0 }}
                                control={
                                    <Checkbox
                                        sx={{ paddingLeft: '0' }}
                                        size="medium"
                                        id="prefix_company_year"
                                        name="prefix_company_year"
                                        checked={Boolean(formik.values.prefix_company_year)}
                                        onChange={(e) => {
                                            let val = 0;
                                            if (e.target.checked) {
                                                val = 1;
                                            }
                                            formik.setFieldValue('prefix_company_year', val);
                                        }}
                                    />
                                }
                                label={<Typography variant="subtitle1">Company Financial Year</Typography>}
                            >
                                <Divider variant="middle" />
                            </FormControlLabel>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center">
                                <Grid item xs={12} sm={4}>
                                    <FormControlLabel
                                        sx={{ ml: 0 }}
                                        control={
                                            <Checkbox
                                                sx={{ paddingLeft: '0' }}
                                                size="medium"
                                                id="prefix_company_month"
                                                name="prefix_company_month"
                                                checked={Boolean(formik.values.prefix_company_month)}
                                                onChange={(e) => {
                                                    let val = 0;
                                                    if (e.target.checked) {
                                                        val = 1;
                                                    }
                                                    formik.setFieldValue('prefix_company_month', val);
                                                }}
                                            />
                                        }
                                        label={<Typography variant="subtitle1">Invoice Month</Typography>}
                                    >
                                        <Divider variant="middle" />
                                    </FormControlLabel>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <FormControl
                                        size="small"
                                        fullWidth
                                        error={
                                            formik.touched.invoice_prefix_date_format && Boolean(formik.errors.invoice_prefix_date_format)
                                        }
                                    >
                                        <InputLabel id="invoice prefix date">
                                            <Required title="invoice prefix date" />
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="invoice_prefix_date_format"
                                            id="invoice_prefix_date_format"
                                            name="invoice_prefix_date_format"
                                            label={<Required title="invoice prefix date" />}
                                            value={formik.values.invoice_prefix_date_format}
                                            onChange={formik.handleChange}
                                            disabled={!Boolean(formik.values.prefix_company_month)}
                                        >
                                            {initData.dateFormat.map((item, idx) => (
                                                <MenuItem value={item.value} key={idx}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {formik.touched.invoice_prefix_date_format && formik.errors.invoice_prefix_date_format}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                )}

                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <Typography>
                                <b>Invoice Number Pattern:</b>
                                {formik.values.invoice_number_type === '2'
                                    ? ` ${Boolean(formik.values.prefix_company_code) ? formik.values.company_code + '/' : ''}${
                                          Boolean(formik.values.prefix_company_year) ? '2023/' : ''
                                      }${Boolean(formik.values.prefix_company_month) ? selectedPrefixYear() + '/' : ''}0001`
                                    : '#0001'}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

EditCompanySetting.propTypes = {
    value: propTypes.object,
    formID: propTypes.string,
    onSubmit: propTypes.func
};

export default EditCompanySetting;
