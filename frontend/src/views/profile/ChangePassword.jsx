import { Button, DialogActions, Grid, TextField, Typography } from '@mui/material';
import { changePasswordApi } from 'apis/Profile';
import { useFormik } from 'formik';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';

import * as yup from 'yup';

const validationSchema = yup.object().shape({
    current_password: yup.string().required('Current password is required.'),
    new_password: yup.string().required('New password is required.'),
    confirm_password: yup
        .string()
        .required('Confirm password is required.')
        .oneOf([yup.ref('new_password'), null], 'New password and confirm password not match.')
});

const ChangePassword = () => {
    const formik = useFormik({
        initialValues: {
            current_password: '',
            new_password: '',
            confirm_password: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            changePasswordApi(values)
                .then((res) => {
                    if (res.data && res.data.status === 1) {
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
        <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
                <MainCard title={<Typography variant="subtitle1">Change Password</Typography>}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            id="current_password"
                                            name="current_password"
                                            label="Current Password"
                                            value={formik.values.current_password}
                                            onChange={formik.handleChange}
                                            error={formik.touched.current_password && Boolean(formik.errors.current_password)}
                                            helperText={formik.touched.current_password && formik.errors.current_password}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            id="new_password"
                                            name="new_password"
                                            label="New Password"
                                            value={formik.values.new_password}
                                            onChange={formik.handleChange}
                                            error={formik.touched.new_password && Boolean(formik.errors.new_password)}
                                            helperText={formik.touched.new_password && formik.errors.new_password}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            id="confirm_password"
                                            name="confirm_password"
                                            label="Confirm Password"
                                            value={formik.values.confirm_password}
                                            onChange={formik.handleChange}
                                            error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
                                            helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2} justifyContent="flex-end">
                                    <Grid item xs={12}>
                                        <DialogActions>
                                            <AnimateButton>
                                                <Button variant="contained" color="primary" type="submit">
                                                    Change Password
                                                </Button>
                                            </AnimateButton>
                                            <Button variant="text" color="error" onClick={() => formik.resetForm()}>
                                                Close
                                            </Button>
                                        </DialogActions>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default ChangePassword;
