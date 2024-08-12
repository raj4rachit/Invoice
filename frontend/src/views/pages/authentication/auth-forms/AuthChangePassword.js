// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import { ChangePasswordApi } from 'apis/Auth';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AuthChangePassword = ({ ...others }) => {
    const theme = useTheme();
    const params = useParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Formik
                initialValues={{
                    token: params.id,
                    new_password: '',
                    confirm_password: ''
                }}
                validationSchema={Yup.object().shape({
                    new_password: Yup.string().required('New password is required.'),
                    confirm_password: Yup.string()
                        .required('Confirm password is required.')
                        .oneOf([Yup.ref('new_password'), null], 'New password and confirm password not match.')
                })}
                onSubmit={async (values) => {
                    try {
                        await ChangePasswordApi(values)
                            .then((res) => {
                                if (res.data && res.data.status === 1) {
                                    apiSuccessSnackBar(res);
                                    navigate('/login');
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
                        <FormControl
                            fullWidth
                            error={Boolean(touched.new_password && errors.new_password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">New Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.new_password}
                                name="new_password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="New Password"
                                inputProps={{}}
                                autoComplete="off"
                            />
                            {touched.new_password && errors.new_password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.new_password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl
                            fullWidth
                            error={Boolean(touched.confirm_password && errors.confirm_password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-confirm-password-login">Confirm Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-confirm-password-login"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={values.confirm_password}
                                name="confirm_password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownConfirmPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Confirm Password"
                                inputProps={{}}
                                autoComplete="off"
                            />
                            {touched.confirm_password && errors.confirm_password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.confirm_password}
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

export default AuthChangePassword;
