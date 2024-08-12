import {
    Button,
    Chip,
    DialogActions,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Required from 'views/utilities/Required';
import AnimateButton from 'ui-component/extended/AnimateButton';

const NewOne = {
    official_name: 'TBS',
    first_name: 'Bhavik',
    last_name: 'shah',
    email: 'BhavikShah123@gmail.com',
    number: 1472583690,
    address_1: 'sky city-149',
    address_2: 'Cyberpunk',
    city: 'NewYork city',
    state: 'NewYork',
    zip_code: 152645,
    country_name: 'Manhattan',
    status: 'Active'
};
const subscriberCountryList = ['TBS', 'Bhavik', 'Dan', 'Salvi', 'jan'];

export const Subscriber = () => {
    const [miniTemp, setMiniTemp] = useState(NewOne);

    const initValue = NewOne ?? false;

    const validationSchema = yup.object().shape({
        official_name: yup.string().required('Official Name is required.'),
        first_name: yup.string().required('First Name is required.'),
        last_name: yup.string().required('Last Name is required.'),
        address_1: yup.string().required('Address is required.'),
        city: yup.string().required('City is required.'),
        state: yup.string().required('State is required.'),
        city: yup.string().required('City is required.'),
        zip_code: yup.string().required('Zip Code is required.'),
        country_name: yup.string().required('Country is required.'),
        email: yup.string().required('Email is required.'),
        number: yup.string().required('Phone number is required.')
    });

    const formik = useFormik({
        initialValues: {
            // id: initValue ? initValue.id : '',
            official_name: initValue ? initValue.official_name : '',
            first_name: initValue ? initValue.first_name : '',
            last_name: initValue ? initValue.last_name : '',
            address_1: initValue ? initValue.address_1 : '',
            address_2: initValue ? initValue.address_2 : '',
            city: initValue ? initValue.city : '',
            state: initValue ? initValue.state : '',
            zip_code: initValue ? initValue.zip_code : '',
            email: initValue ? initValue.email : '',
            number: initValue ? initValue.number : '',
            country_name: initValue ? initValue.country_name : ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            setMiniTemp({
                official_name: values.official_name,
                first_name: values.first_name,
                last_name: values.last_name,
                address_1: values.address_1,
                address_2: values.address_2,
                city: values.city,
                state: values.state,
                zip_code: values.zip_code,
                email: values.email,
                number: values.number,
                company: values.company,
                default_company: values.default_company
            });
            // updateCompanySettingApi(values)
            //     .then((res) => {
            //         if (res.data && res.data.status === 1) {
            //             if (onSubmit) onSubmit();
            //             resetForm();
            //             apiSuccessSnackBar(res);
            //         } else {
            //             apiValidationSnackBar(res);
            //         }
            //     })
            //     .catch((err) => {
            //         apiErrorSnackBar(err);
            //     });
        }
    });

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} md={4}>
                <MainCard
                    title={
                        <Grid container spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                            <Grid item xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1">Subscriber Info</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    content={true}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <TableContainer>
                                        <Table
                                            size="small"
                                            sx={{
                                                [`& .${tableCellClasses.root}`]: {
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px'
                                                }
                                            }}
                                        >
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">Official Name</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" sx={{ textAlign: 'end' }}>
                                                            {miniTemp.official_name}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">Name</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" sx={{ textAlign: 'end' }}>
                                                            {miniTemp.first_name + ''}
                                                            {miniTemp.last_name}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">Email</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" sx={{ textAlign: 'end' }}>
                                                            {miniTemp.email}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">Phone Number</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" sx={{ textAlign: 'end' }}>
                                                            {miniTemp.number}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">Address</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" sx={{ textAlign: 'end' }}>
                                                            {miniTemp.address_1 + `, `} {miniTemp.address_2 && miniTemp.address_2 + `, `}
                                                            {miniTemp.city && miniTemp.city + ','} {miniTemp.zip_code ? `- ` : `, `}{' '}
                                                            {miniTemp.zip_code && miniTemp.zip_code + `, `}
                                                            {miniTemp.state && miniTemp.state + `, `}
                                                            {miniTemp.country_name && miniTemp.country_name}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">Status</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" sx={{ textAlign: 'end' }}>
                                                            {miniTemp.status === 'Active' ? (
                                                                <Chip label={miniTemp.status} color="primary" variant="outlined" />
                                                            ) : (
                                                                <Chip label={miniTemp.status} color="error" variant="outlined" />
                                                            )}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={12} md={8}>
                <MainCard
                    title={
                        <Grid container spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                            <Grid item xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1">Subscriber Details</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    content={true}
                >
                    <form
                        //  id={formID}
                        onSubmit={formik.handleSubmit}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1">
                                            <Required title="Official name" />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            id="official_name"
                                            name="official_name"
                                            label={<Required title="Official name" />}
                                            value={formik.values.official_name}
                                            onChange={formik.handleChange}
                                            error={formik.touched.official_name && Boolean(formik.errors.official_name)}
                                            helperText={formik.touched.official_name && formik.errors.official_name}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1">
                                            <Required title="Name" />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            id="first_name"
                                            name="first_name"
                                            label={<Required title="First name" />}
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                                            helperText={formik.touched.first_name && formik.errors.first_name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            id="last_name"
                                            name="last_name"
                                            label={<Required title="Last name" />}
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                            helperText={formik.touched.last_name && formik.errors.last_name}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1">
                                            <Required title="Email" />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
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
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1">
                                            <Required title="Mobile number" />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            id="number"
                                            name="number"
                                            label={<Required title="Mobile number" />}
                                            value={formik.values.number}
                                            onChange={formik.handleChange}
                                            error={formik.touched.number && Boolean(formik.errors.number)}
                                            helperText={formik.touched.number && formik.errors.number}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1">
                                            <Required title="Address" />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Grid container alignItems="center" spacing={2}>
                                            <Grid item xs={12} sm={12}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    size="small"
                                                    id="address_1"
                                                    name="address_1"
                                                    label={<Required title="Address 1" />}
                                                    value={formik.values.address_1}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.address_1 && Boolean(formik.errors.address_1)}
                                                    helperText={formik.touched.address_1 && formik.errors.address_1}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    size="small"
                                                    id="address_2"
                                                    name="address_2"
                                                    label="Address 2"
                                                    value={formik.values.address_2}
                                                    onChange={formik.handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    id="city"
                                                    name="city"
                                                    label={<Required title="City" />}
                                                    value={formik.values.city}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.city && Boolean(formik.errors.city)}
                                                    helperText={formik.touched.city && formik.errors.city}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    id="state"
                                                    name="state"
                                                    label={<Required title="State" />}
                                                    value={formik.values.state}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.state && Boolean(formik.errors.state)}
                                                    helperText={formik.touched.state && formik.errors.state}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    id="zip_code"
                                                    name="zip_code"
                                                    label={<Required title="zip_code" />}
                                                    value={formik.values.zip_code}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.zip_code && Boolean(formik.errors.zip_code)}
                                                    helperText={formik.touched.zip_code && formik.errors.zip_code}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                    error={formik.touched.country_id && Boolean(formik.errors.country_id)}
                                                >
                                                    <InputLabel id="country_id">
                                                        <Required title="Country" />
                                                    </InputLabel>
                                                    <Select
                                                        fullWidth
                                                        labelId="country_id"
                                                        id="country_id"
                                                        name="country_id"
                                                        label={<Required title="Country" />}
                                                        value={formik.values.country_id}
                                                        onChange={formik.handleChange}
                                                    >
                                                        {subscriberCountryList.map((item, idx) => (
                                                            <MenuItem value={item.id} key={idx}>
                                                                {item.country_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>{formik.touched.country_id && formik.errors.country_id}</FormHelperText>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2} justifyContent="flex-end">
                                <Grid item xs={12}>
                                    <DialogActions sx={{ marginTop: 1 }}>
                                        <AnimateButton>
                                            <Button variant="contained" color="primary" type="submit">
                                                update
                                            </Button>
                                        </AnimateButton>
                                    </DialogActions>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </MainCard>
            </Grid>
        </Grid>
    );
};
