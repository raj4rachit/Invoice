import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { RegisterApi } from 'apis/Auth';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = ({ ...others }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const customization = useSelector((state) => state.customization);
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(true);

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();

    const googleHandler = async () => {
        console.error('Register');
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sign up with Email address</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    username: '',
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    mobile_number: '',
                    gender: 'Male',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().max(255).required('Username is required'),
                    first_name: Yup.string().max(255).required('First name is required'),
                    last_name: Yup.string().max(255).required('Last name is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required'),
                    mobile_number: Yup.string().max(20).required('Mobile Number is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    // RegisterApi(values)
                    //     .then((res) => {
                    //         if (res.data && res.data.status === 1) {
                    //             apiSuccessSnackBar(res);
                    //             navigate('/login', { replace: true });
                    //         } else {
                    //             apiValidationSnackBar(res);
                    //         }
                    //     })
                    //     .catch((err) => {
                    //         apiErrorSnackBar(err);
                    //     });
                    // try {
                    //     if (scriptedRef.current) {
                    //         setStatus({ success: true });
                    //         setSubmitting(false);
                    //     }
                    // } catch (err) {
                    //     console.error(err);
                    //     if (scriptedRef.current) {
                    //         setStatus({ success: false });
                    //         setErrors({ submit: err.message });
                    //         setSubmitting(false);
                    //     }
                    // }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl
                            fullWidth
                            error={Boolean(touched.username && errors.username)}
                            sx={{ ...theme.typography.customRegisterInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-username-register">Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-username-register"
                                type="text"
                                value={values.username}
                                name="username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.username && errors.username && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.username}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Grid container spacing={matchDownSM ? 0 : 1}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.first_name && errors.first_name)}
                                    sx={{ ...theme.typography.customRegisterInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-first-name-register">First Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-first-name-register"
                                        type="text"
                                        value={values.first_name}
                                        name="first_name"
                                        label="First Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.first_name && errors.first_name && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.first_name}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.last_name && errors.last_name)}
                                    sx={{ ...theme.typography.customRegisterInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-first-name-register">Last Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-first-name-register"
                                        type="text"
                                        value={values.last_name}
                                        name="last_name"
                                        label="Last Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.last_name && errors.last_name && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.last_name}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.email && errors.email)}
                            sx={{ ...theme.typography.customRegisterInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customRegisterInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
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
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mt: 0 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}

                        <FormControl
                            fullWidth
                            error={Boolean(touched.mobile_number && errors.mobile_number)}
                            sx={{ ...theme.typography.customRegisterInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-mobile-number-register">Mobile Number</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-mobile-number-register"
                                type="text"
                                value={values.mobile_number}
                                name="mobile_number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.mobile_number && errors.mobile_number && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.mobile_number}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl>
                            <FormLabel id="controlled-gender-group">Gender</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="controlled-gender-group"
                                name="gender"
                                value={values.gender}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                            </RadioGroup>
                        </FormControl>

                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(event) => setChecked(event.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="subtitle1">
                                            Agree with &nbsp;
                                            <Typography variant="subtitle1" component={Link} to="#">
                                                Terms & Condition.
                                            </Typography>
                                        </Typography>
                                    }
                                />
                            </Grid>
                        </Grid>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button fullWidth size="large" type="submit" variant="contained" color="secondary">
                                    Sign up
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseRegister;
