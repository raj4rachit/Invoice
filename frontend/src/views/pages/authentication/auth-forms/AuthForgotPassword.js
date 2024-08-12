// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Typography } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import { ForgotPasswordApi } from 'apis/Auth';

const AuthForgotPassword = ({ ...others }) => {
    const theme = useTheme();
    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Forgot Password with Email address</Typography>
                    </Box>
                </Grid>
            </Grid>
            <Formik
                initialValues={{
                    email: ''
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
                })}
                onSubmit={async (values, { resetForm }) => {
                    try {
                        await ForgotPasswordApi(values)
                            .then((res) => {
                                if (res.data && res.data.status === 1) {
                                    apiSuccessSnackBar(res);
                                    resetForm();
                                } else {
                                    apiValidationSnackBar(res);
                                }
                            })
                            .catch((err) => {
                                apiErrorSnackBar(err);
                            });
                    } catch (err) {
                        console.error(err);
                        apiErrorSnackBar(err);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
                                    Submit
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthForgotPassword;
