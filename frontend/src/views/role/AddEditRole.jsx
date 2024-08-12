import propTypes from 'prop-types';

import { Autocomplete, Box, Checkbox, Grid, TextField } from '@mui/material';
import { addUpdateRoleApi } from 'apis/Role';
import { useFormik } from 'formik';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';

// third party
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    name: yup.string().required('Role name is required.'),
    permission_group: yup.string().required('Permission group is required.'),
    status: yup.string().required('Role status is required.')
});

const status = [{ label: 'Active' }, { label: 'Inactive' }];

const AddEditRole = ({ RoleValue, formId, onSubmit, permissionGroup }) => {
    const initValue = RoleValue ?? false;
    const can = initValue && initValue.can_delete === 'No' && true;

    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            name: initValue ? initValue.name : '',
            permission_group: initValue ? initValue.group_id : '',
            status: initValue ? initValue.status : '',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            addUpdateRoleApi(values)
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

    const getSelectedPermissionGroup = (groupID) => {
        // const indexID = permissionGroup.findIndex((a) => a.id === formik.values.permission_group);
        const indexID = permissionGroup.findIndex((a) => a.id === groupID);
        return indexID > -1 ? permissionGroup[indexID] : null;
    };

    return (
        <Box>
            <form id={formId} onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            id="name"
                            name="name"
                            label="Role name"
                            defaultValue={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            disabled={can}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={permissionGroup ?? []}
                            getOptionLabel={(option) => (option.name ? option.name : '')}
                            value={getSelectedPermissionGroup(formik.values.permission_group)}
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
                                    id="permission_group"
                                    name="permission_group"
                                    label="Permission group"
                                    error={formik.touched.permission_group && Boolean(formik.errors.permission_group)}
                                    helperText={formik.touched.permission_group && formik.errors.permission_group}
                                />
                            )}
                            onChange={(_, newValue) => {
                                const val = newValue ? newValue.id : '';
                                formik.setFieldValue('permission_group', val);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={status ?? []}
                            getOptionLabel={(option) => (option.label ? option.label : '')}
                            value={formik.values.status !== '' ? status.filter((a) => a.label === formik.values.status)[0] : null}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox checked={selected} value={option.label} />
                                    {option.label}
                                </li>
                            )}
                            disabled={can}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    id="status"
                                    name="status"
                                    label="Role status"
                                    error={formik.touched.status && Boolean(formik.errors.status)}
                                    helperText={formik.touched.status && formik.errors.status}
                                />
                            )}
                            onChange={(_, value) => {
                                const val = value ? value.label : '';
                                formik.setFieldValue('status', val);
                            }}
                        />
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

AddEditRole.propTypes = {
    RoleValue: propTypes.object,
    formId: propTypes.string.isRequired,
    onSubmit: propTypes.func,
    permissionGroup: propTypes.array
};

export default AddEditRole;
