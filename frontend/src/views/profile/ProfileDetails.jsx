import {
    Autocomplete,
    Avatar,
    AvatarGroup,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import User1 from 'assets/images/users/user-round.svg';
import { useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Required from 'views/utilities/Required';
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';

const Temp = {
    name: 'Bhavik Shah',
    email: 'BhavikShah123@gmail.com',
    number: 1472583690,
    default_company: 'TBS',
    company: ['TBS', 'Bhavik'],
    tp: ''
};

const companyList = ['TBS', 'Bhavik', 'Dan', 'Salvi', 'jan'];

export const ProfileDetails = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const [openList, setOpenList] = useState(false);
    const [focus, setFocus] = useState(false);
    const [miniTemp, setMiniTemp] = useState(Temp);

    const initValue = Temp ?? false;

    const validationSchema = yup.object().shape({
        name: yup.string().required('Name is required.'),
        email: yup.string().required('Email is required.'),
        number: yup.string().required('Phone number is required.')
    });

    const formik = useFormik({
        initialValues: {
            // id: initValue ? initValue.id : '',
            name: initValue ? initValue.name : '',
            email: initValue ? initValue.email : '',
            number: initValue ? initValue.number : '',
            default_company: initValue ? initValue.default_company : '',
            company: initValue ? initValue.company : []
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            setMiniTemp({
                name: values.name,
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

    const ListData = () => {
        setOpenList(true);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} md={4}>
                <MainCard
                    title={
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                                <Avatar
                                    src={User1}
                                    sx={{
                                        ...theme.typography.mediumAvatar,
                                        margin: '8px 0 8px 8px !important'
                                    }}
                                    aria-haspopup="true"
                                    color="inherit"
                                />
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1">User name</Typography>
                                <Typography variant="subtitle2">Position</Typography>
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
                                                        <Typography variant="subtitle1">Name</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" sx={{ textAlign: 'end' }}>
                                                            {miniTemp.name}
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
                                                {user.user_type !== 'SuperAdmin' && (
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography variant="subtitle1">Default company</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle2" sx={{ textAlign: 'end' }}>
                                                                {miniTemp.default_company}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                {user.user_type !== 'SuperAdmin' && (
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography variant="subtitle1">company</Typography>
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'end' }}>
                                                            <AvatarGroup
                                                                max={4}
                                                                sx={{
                                                                    display: 'inline-flex',
                                                                    '& .MuiAvatar-root': {
                                                                        width: 30,
                                                                        height: 30,
                                                                        fontSize: 12
                                                                    }
                                                                }}
                                                                onClick={() => ListData()}
                                                            >
                                                                {miniTemp.company.map((i, index) => (
                                                                    <Tooltip key={index} title={i}>
                                                                        <Avatar src={i} alt={i} />
                                                                    </Tooltip>
                                                                ))}
                                                            </AvatarGroup>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
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
                                        <Typography variant="subtitle1">Profile Details</Typography>
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
                                    <Grid item xs={12} sm={3}>
                                        <Typography variant="subtitle1">
                                            <Required title="Name" />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            id="name"
                                            name="name"
                                            label={<Required title="Name" />}
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
                                    <Grid item xs={12} sm={3}>
                                        <Typography variant="subtitle1">
                                            <Required title="Email" />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
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
                                    <Grid item xs={12} sm={3}>
                                        <Typography variant="subtitle1">
                                            <Required title="Phone Number" />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            id="number"
                                            name="number"
                                            label={<Required title="Phone Number" />}
                                            value={formik.values.number}
                                            onChange={formik.handleChange}
                                            error={formik.touched.number && Boolean(formik.errors.number)}
                                            helperText={formik.touched.number && formik.errors.number}
                                        />
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
            {openList && (
                <Dialog onClose={() => setOpenList((prevState) => !prevState)} open={openList}>
                    <DialogTitle>Company List</DialogTitle>
                    <Divider />
                    <List sx={{ pt: 0, minWidth: '250px' }}>
                        {miniTemp.company.map((item, idx) => (
                            <ListItem key={idx}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={item}
                                        alt={item}
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            border: '2px solid'
                                        }}
                                    />
                                </ListItemAvatar>
                                <ListItemText sx={{ marginLeft: 2 }} primary={item} />
                            </ListItem>
                        ))}
                    </List>
                </Dialog>
            )}
        </Grid>
    );
};
