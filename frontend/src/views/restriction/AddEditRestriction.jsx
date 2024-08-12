import { Autocomplete, Box, Checkbox, Grid, TextField, Typography } from '@mui/material';
import { addUpdateRestrictionApi } from 'apis/Restriction';
import { useFormik } from 'formik';
import propTypes from 'prop-types';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';

// third party
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    name: yup.string().required('Restriction name is required.'),
    slug: yup.string().required('Restriction slug is required.'),
    description: yup.string().required('Restriction description is required.'),
    // permission: yup.object().required('Permission is required.')
    permission_id: yup.string().required('Permission is required.')
});

const AddEditRestriction = ({ value, formId, onSubmit, permissions }) => {
    const initValue = value ?? false;
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            name: initValue ? initValue.name : '',
            slug: initValue ? initValue.slug : '',
            description: initValue ? initValue.description : '',
            permission_id: initValue ? initValue.permission_id : '',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            addUpdateRestrictionApi(values)
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
                                    <Required title="Restriction Name" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="name"
                                    name="name"
                                    label="Restriction Name"
                                    defaultValue={formik.values.name}
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
                                    <Required title="Restriction Slug" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="slug"
                                    name="slug"
                                    label="Restriction Slug"
                                    defaultValue={formik.values.slug}
                                    onChange={formik.handleChange}
                                    error={formik.touched.slug && Boolean(formik.errors.slug)}
                                    helperText={formik.touched.slug && formik.errors.slug}
                                />
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
                                <TextField
                                    fullWidth
                                    multiline
                                    size="small"
                                    rows={4}
                                    label="Restriction Description"
                                    id="description"
                                    name="description"
                                    defaultValue={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Permissions" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Autocomplete
                                    options={permissions ?? []}
                                    getOptionLabel={(option) => (option.name ? option.name : '')}
                                    value={
                                        formik.values.permission_id
                                            ? permissions.filter((pr) => pr.id === formik.values.permission_id)[0]
                                            : null
                                    }
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox checked={selected} value={option.id} />
                                            {option.name}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            id="permission_id"
                                            name="permission_id"
                                            label="Permissions"
                                            error={formik.touched.permission_id && Boolean(formik.errors.permission_id)}
                                            helperText={formik.touched.permission_id && formik.errors.permission_id}
                                        />
                                    )}
                                    onChange={(_, value) => {
                                        const id = value ? value.id : '';
                                        formik.setFieldValue('permission_id', id);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

AddEditRestriction.propTypes = {
    value: propTypes.object,
    formId: propTypes.string.isRequired,
    onSubmit: propTypes.func,
    permissions: propTypes.array.isRequired
};

export default AddEditRestriction;
