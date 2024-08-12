import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { addUpdateInvoiceTermApi } from 'apis/Settings';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import propTypes from 'prop-types';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { RHFEditor } from 'ui-component/hook-form';

const status = [{ label: 'Active' }, { label: 'Inactive' }];

const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required.'),
    company_id: yup.string().required('Company is required.'),
    description: yup.string().required('Description is required.'),
    status: yup.string().required('Status is required.')
});
const AddEditInvoiceTerm = ({ value, formID, onSubmit, companyList }) => {
    const { company } = useAuth();
    const initValue = value ?? false;
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            name: initValue ? initValue.title : '',
            company_id: initValue ? initValue.company_id : company.company_id !== '0' ? company.company_id : '',
            description: initValue ? initValue.description : '',
            status: initValue ? initValue.status : 'Active',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            addUpdateInvoiceTermApi(values)
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

    const methods = useForm();

    return (
        <FormProvider {...methods}>
            <form id={formID} onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Name" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="name"
                                    name="name"
                                    label={<Required title="Name" />}
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Company" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControl size="small" fullWidth error={formik.touched.company_id && Boolean(formik.errors.company_id)}>
                                    <InputLabel id="company_id">
                                        <Required title="Company" />
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="company_id"
                                        id="company_id"
                                        name="company_id"
                                        label={<Required title="Company" />}
                                        value={formik.values.company_id}
                                        onChange={formik.handleChange}
                                    >
                                        {companyList.map((item, idx) => (
                                            <MenuItem value={item.id} key={idx}>
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
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Description" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <RHFEditor
                                    simple
                                    name="description"
                                    value={formik.values.description}
                                    onChange={(e) => {
                                        formik.setFieldValue('description', e);
                                    }}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                                {/* <TextField
                                    fullWidth
                                    multiline
                                    size="small"
                                    id="description"
                                    name="description"
                                    label={<Required title="Description" />}
                                    rows={5}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                /> */}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Status" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel id="status">Status</InputLabel>
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
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </FormProvider>
    );
};

AddEditInvoiceTerm.propTypes = {
    value: propTypes.object,
    formID: propTypes.string,
    onSubmit: propTypes.func,
    companyList: propTypes.array
};

export default AddEditInvoiceTerm;
