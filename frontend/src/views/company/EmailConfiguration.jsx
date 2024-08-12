import propTypes from 'prop-types';
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';

import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';
import * as yup from 'yup';
import { updateCompanySettingApi, updateEmailConfigurationApi } from 'apis/Company';

const validationSchema = yup.object().shape({
    host: yup.string().required('Host is required.'),
    port: yup.string().required('Port is required.'),
    auth: yup.string().required('Auth is required.'),
    authType: yup.string().required('Auth Type is required.'),
    userName: yup.string().required('User Name is required.'),
    password: yup.string().required('Password is required.'),
    senderEmail: yup.string().required('Sender Email is required.')
});

const auths = [{ label: 'TRUE' }, { label: 'FALSE' }];
const authType = [{ label: 'NONE' }, { label: 'TLS' }, { label: 'SSL' }];

const EmailConfiguration = ({ value, formID, onSubmit, initData }) => {
    const initValue = value ?? false;
    const initConfigValue = value.emailConfigration ?? false;

    const formik = useFormik({
        initialValues: {
            id: initConfigValue ? initConfigValue.id : '',
            company_id: initValue ? initValue.id : '',
            host: initConfigValue ? initConfigValue.host : '',
            port: initConfigValue ? initConfigValue.port : '',
            auth: initConfigValue ? initConfigValue.auth : '',
            authType: initConfigValue ? initConfigValue.encryption : '',
            userName: initConfigValue ? initConfigValue.username : '',
            password: initConfigValue ? initConfigValue.password : '',
            senderEmail: initConfigValue ? initConfigValue.sender_email : ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            updateEmailConfigurationApi(values)
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
    return (
        <form id={formID} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={7}>
                            <TextField
                                fullWidth
                                size="small"
                                id="host"
                                name="host"
                                label={<Required title="Host" />}
                                value={formik.values.host}
                                onChange={formik.handleChange}
                                error={formik.touched.host && Boolean(formik.errors.host)}
                                helperText={formik.touched.host && formik.errors.host}
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                fullWidth
                                size="small"
                                id="port"
                                name="port"
                                label={<Required title="Port" />}
                                value={formik.values.port}
                                onChange={formik.handleChange}
                                error={formik.touched.port && Boolean(formik.errors.port)}
                                helperText={formik.touched.port && formik.errors.port}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={7}>
                            <FormControl size="small" fullWidth error={formik.touched.auth && Boolean(formik.errors.auth)}>
                                <InputLabel id="Auth">
                                    <Required title="Auth" />
                                </InputLabel>
                                <Select
                                    fullWidth
                                    labelId="auth"
                                    id="auth"
                                    name="auth"
                                    label={<Required title="Auth" />}
                                    value={formik.values.auth}
                                    onChange={formik.handleChange}
                                >
                                    {auths.map((item, idx) => (
                                        <MenuItem value={item.label} key={idx}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{formik.touched.auth && formik.errors.auth}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <FormControl size="small" fullWidth error={formik.touched.authType && Boolean(formik.errors.authType)}>
                                <InputLabel id="Auth Type">
                                    <Required title="Auth Type" />
                                </InputLabel>
                                <Select
                                    fullWidth
                                    labelId="authType"
                                    id="authType"
                                    name="authType"
                                    label={<Required title="Auth Type" />}
                                    value={formik.values.authType}
                                    onChange={formik.handleChange}
                                >
                                    {authType.map((item, idx) => (
                                        <MenuItem value={item.label} key={idx}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{formik.touched.authType && formik.errors.authType}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                size="small"
                                id="userName"
                                name="userName"
                                label={<Required title="User Name" />}
                                value={formik.values.userName}
                                onChange={formik.handleChange}
                                error={formik.touched.userName && Boolean(formik.errors.userName)}
                                helperText={formik.touched.userName && formik.errors.userName}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
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
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                size="small"
                                type="senderEmail"
                                id="senderEmail"
                                name="senderEmail"
                                label={<Required title="Sender Email" />}
                                value={formik.values.senderEmail}
                                onChange={formik.handleChange}
                                error={formik.touched.senderEmail && Boolean(formik.errors.senderEmail)}
                                helperText={formik.touched.senderEmail && formik.errors.senderEmail}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

EmailConfiguration.propTypes = {
    value: propTypes.object,
    formID: propTypes.string,
    onSubmit: propTypes.func
};

export default EmailConfiguration;
