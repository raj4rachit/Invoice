import propTypes from 'prop-types';
import { Autocomplete, Box, Checkbox, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Required from 'views/utilities/Required';
import { useFormik } from 'formik';

import * as yup from 'yup';
import { AddUpdateUserApi } from 'apis/User';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import { useState } from 'react';

const status = [{ label: 'Active' }, { label: 'Inactive' }];

const validationSchema = yup.object().shape({
    first_name: yup.string().required('First name is required.'),
    last_name: yup.string().required('Last name is required.'),
    email: yup.string().email().required('Email is required.'),
    password: yup.string().when('formType', { is: 'add', then: yup.string().required('Password is required.') }),
    phone: yup.string().required('Mobile number is required.'),
    role_id: yup.string().required('Role is required.'),
    status: yup.string().required('Status is required.')
});

const AddEditUser = ({ value, formId, onSubmit, roleList, companyList }) => {
    const initValue = value ?? false;
    const [focus, setFocus] = useState(false);

    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            first_name: initValue ? initValue.first_name : '',
            last_name: initValue ? initValue.last_name : '',
            email: initValue ? initValue.email : '',
            phone: initValue ? initValue.phone : '',
            password: '',
            role_id: initValue ? initValue.role_id : '',
            company_id: initValue ? initValue.selectedCompany : [],
            is_default: initValue ? initValue.company_id : '',
            status: initValue ? 'Active' : 'Active',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            AddUpdateUserApi(values)
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
                <Grid container justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
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
                    {formik.values.formType === 'add' && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                type="password"
                                id="password"
                                name="password"
                                label={<Required title="Password" />}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                inputProps={{
                                    form: {
                                        autocomplete: 'off'
                                    }
                                }}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <FormControl size="small" fullWidth error={formik.touched.role_id && Boolean(formik.errors.role_id)}>
                            <InputLabel id="role_id">
                                <Required title="Role" />
                            </InputLabel>
                            <Select
                                fullWidth
                                labelId="role_id"
                                id="role_id"
                                name="role_id"
                                label={<Required title="Role" />}
                                value={formik.values.role_id}
                                onChange={formik.handleChange}
                            >
                                {roleList.map((item, idx) => (
                                    <MenuItem value={item.id} key={idx}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formik.touched.role_id && formik.errors.role_id}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            label="Company"
                            id="company_id"
                            name="company_id"
                            options={companyList ?? []}
                            getOptionLabel={(option) => (option.company_name ? option.company_name : '')}
                            value={
                                formik.values.company_id !== ''
                                    ? companyList.filter((a) => formik.values.company_id.some((b) => b.id === a.id))
                                    : null
                            }
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox checked={selected} value={option.id} />
                                    {option.company_name}
                                </li>
                            )}
                            renderInput={(params) => <TextField {...params} size="small" name="company_id" label="Company" />}
                            onChange={(_, v) => {
                                formik.setFieldValue('company_id', v);
                                setFocus(false);
                                const filterData = v.filter((a) => a.id === formik.values.is_default);
                                if (v.length === 0 || filterData.length === 0) {
                                    formik.setFieldValue('is_default', '');
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl
                            size="small"
                            fullWidth
                            focused={focus}
                            disabled={formik.values.company_id.length > 0 ? false : true}
                            error={formik.touched.is_default && Boolean(formik.errors.is_default)}
                        >
                            <InputLabel id="is_default">Default Company</InputLabel>
                            <Select
                                fullWidth
                                labelId="is_default"
                                id="is_default"
                                name="is_default"
                                label="Default company"
                                value={
                                    formik.values.company_id.some((el) => el.id === formik.values.is_default)
                                        ? formik.values.is_default
                                        : ''
                                }
                                onChange={formik.handleChange}
                            >
                                {formik.values.company_id.map((item, idx) => (
                                    <MenuItem value={item.id} key={idx}>
                                        {item.company_name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formik.touched.is_default && formik.errors.is_default}</FormHelperText>
                        </FormControl>
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
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    id="status"
                                    name="status"
                                    label="Status"
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

AddEditUser.propTypes = {
    value: propTypes.object,
    formId: propTypes.string.isRequired,
    onSubmit: propTypes.func,
    roleList: propTypes.array,
    companyList: propTypes.array
};

export default AddEditUser;
