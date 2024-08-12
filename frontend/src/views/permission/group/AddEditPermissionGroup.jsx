import propTypes from 'prop-types';

import { Autocomplete, Box, Checkbox, Divider, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import Required from 'views/utilities/Required';

// third party
import * as yup from 'yup';
import { addUpdatePermissionGroupApi } from 'apis/Permission';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';

const validationSchema = yup.object().shape({
    name: yup.string().required('Group name is required.'),
    description: yup.string().required('Group description is required.')
});

const AddEditPermissionGroup = ({ value, formId, onSubmit, permissions }) => {
    const initValue = value ?? false;
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            name: initValue ? initValue.name : '',
            description: initValue ? initValue.description : '',
            permissions: initValue ? initValue.permissions : [],
            restrictions: initValue ? initValue.permissionList : [],
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            addUpdatePermissionGroupApi(values)
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

    const checkValue = (row) => {
        if (row.is_default === 'Yes') {
            return false;
        }
        return formik.values.permissions.filter((p) => p === row.id).length === 0 && true;
    };

    const checkPermission = (row) => {
        if (row.is_default === 'Yes') {
            const checkLength = formik.values.permissions.filter((a) => a === row.id).length === 1;
            if (!checkLength && row.id) {
                const newValue = [...formik.values.permissions, row.id];
                formik.setFieldValue(`permissions`, newValue);
            }
            return false;
        }
        return formik.values.permissions.filter((p) => Number(p) === Number(row.id)).length === 0 && true;
    };

    const checkRestriction = (row) => {
        const findKey = formik.values.restrictions.findIndex(function (item) {
            return item.id === row.id;
        });
        const selectedData = findKey > -1 ? formik.values.restrictions[findKey].restriction : [];
        const newData = row.restrictions.filter((a) => selectedData.some((b) => Number(b.id) === Number(a.id)));
        return newData;
    };

    return (
        <Box>
            <form id={formId} onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    <Required title="Group Name" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="name"
                                    name="name"
                                    label="Group Name"
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
                                    <Required title="Group Description" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    size="small"
                                    id="description"
                                    name="description"
                                    label="Group Description"
                                    defaultValue={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider variant="fullWidth" flexItem />
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4"> Permission </Typography>
                            </Grid>
                            {permissions.map((np, idx) => (
                                <Grid item xs={12} key={idx}>
                                    <Grid container alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <FormControlLabel
                                                sx={{ ml: 0 }}
                                                control={
                                                    <Checkbox
                                                        sx={{ paddingLeft: '0' }}
                                                        size="medium"
                                                        name="permissions"
                                                        value={np.id}
                                                        checked={!checkPermission(np)}
                                                        onChange={(e) => {
                                                            if (!e.target.checked) {
                                                                const removeRe = formik.values.restrictions.filter((a) => a.id !== np.id);
                                                                formik.setFieldValue(`restrictions`, removeRe);
                                                            }
                                                            formik.handleChange(e);
                                                        }}
                                                    />
                                                }
                                                label={<Typography variant="subtitle1">{np.name}</Typography>}
                                            >
                                                <Divider variant="middle" />
                                            </FormControlLabel>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <Autocomplete
                                                multiple
                                                options={np.restrictions ?? []}
                                                getOptionLabel={(option) => (option.name ? option.name : '')}
                                                value={checkRestriction(np)}
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
                                                        name={`restrictions.${np.id}`}
                                                        label={`${np.name} restrictions`}
                                                    />
                                                )}
                                                // disabled={checkValue(np) && true}
                                                disabled={checkValue(np)}
                                                onChange={(_, v) => {
                                                    const a = formik.values.restrictions;
                                                    const getIndex = a.findIndex(function (i) {
                                                        return i.id === np.id;
                                                    });

                                                    if (getIndex > -1) {
                                                        formik.setFieldValue(`restrictions.${getIndex}.restriction`, v);
                                                    } else {
                                                        const val = {
                                                            id: np.id,
                                                            name: np.name,
                                                            restriction: v
                                                        };
                                                        const newValue = [...a, val];
                                                        formik.setFieldValue(`restrictions`, newValue);
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

AddEditPermissionGroup.propTypes = {
    value: propTypes.object,
    formId: propTypes.string.isRequired,
    onSubmit: propTypes.func,
    permissions: propTypes.array
};

export default AddEditPermissionGroup;
