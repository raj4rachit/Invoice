import { useTheme } from '@mui/material/styles';
import { DeleteOutline } from '@mui/icons-material';
import {
    Button,
    DialogActions,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import Required from 'views/utilities/Required';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { AddUpdateContributionApi, ContributionInitApi, SlabByEmployeeApi } from 'apis/Contribution';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
// third party
import * as yup from 'yup';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';

const initSlab = {
    from: '',
    to: '',
    amount_type: '%',
    amount: ''
};

const validationSchema = yup.object().shape({
    employee_id: yup.string().required('Employee is required.'),
    roll_over_month: yup.string().required('Roll over month is required.'),
    // roll_over_bill: yup.string().required('Roll over bill is required.'),
    // roll_over_month: yup.string().when('roll_over_bill', { is: '', then: yup.string().required('Roll over month is required.') }),
    roll_over_bill: yup.string().when('roll_over_month', { is: '', then: yup.string().required('Roll over bill is required.') }),
    slabs: yup.array().of(
        yup.object().shape({
            from: yup.string().required('From is required'),
            to: yup.string().required('To is required'),
            amount: yup.string().required('Amount is required')
        })
    )
});
const Form = () => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const { recall } = useAuth();
    const [data, setData] = useState({});

    const formik = useFormik({
        initialValues: {
            id: '',
            employee_id: '',
            roll_over_month: '0',
            roll_over_bill: '0',
            slabs: [initSlab],
            formType: 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            AddUpdateContributionApi(values)
                .then((res) => {
                    if (res.data && res.data.status === 1) {
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

    useEffect(() => {
        ContributionInitApi()
            .then((res) => {
                setData(res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    }, [recall]);

    const checkTouchedValidation = (index, filedName) => {
        if (formik.touched.slabs && formik.touched.slabs[0] && formik.touched.slabs[0][filedName]) {
            if (formik.errors.slabs && formik.errors.slabs[index] && formik.errors.slabs[index][filedName]) {
                return Boolean(formik.errors.slabs[index][filedName]);
            }
            return false;
        }
        return false;
    };

    const checkErrorValidation = (index, filedName) => {
        if (formik.touched.slabs && formik.errors.slabs && formik.errors.slabs[index] && formik.errors.slabs[index][filedName]) {
            return formik.errors.slabs[index][filedName];
        }
        return '';
    };

    // ========== Get Employee Data ========== //
    const changeEmployeeHandler = (id) => {
        SlabByEmployeeApi({ employee_id: id })
            .then((res) => {
                const data = res.data.data ?? {};
                formik.setFieldValue('id', data ? data.id : '');
                formik.setFieldValue('roll_over_month', data ? data.roll_over_month : '0', true);
                formik.setFieldValue('roll_over_bill', data ? data.roll_over_bill : '0', true);
                formik.setFieldValue('slabs', data ? data.slabs : [initSlab]);
                formik.setFieldValue('formType', data && data.id ? 'edit' : 'add');
                formik.setTouched({}, false);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    // ========== Add Slab ========== //
    const addSlabHandler = () => {
        const currentSlab = formik.values.slabs;
        formik.setFieldValue('slabs', [...currentSlab, initSlab]);
    };

    // ========== Add Slab ========== //
    const deleteHandler = (index) => {
        const currentSlab = formik.values.slabs;
        currentSlab.splice(index, 1);
        formik.setFieldValue('slabs', currentSlab);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={4} md={3}>
                            <Typography variant="subtitle1">
                                <Required title="Employee" />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                            <FormControl size="small" fullWidth error={formik.touched.employee_id && Boolean(formik.errors.employee_id)}>
                                <InputLabel id="employee_id_label">Employee</InputLabel>
                                <Select
                                    labelId="employee_id_label"
                                    id="employee_id"
                                    name="employee_id"
                                    label="Employee"
                                    value={formik.values.employee_id}
                                    onChange={(e) => {
                                        changeEmployeeHandler(e.target.value);
                                        formik.handleChange(e);
                                    }}
                                >
                                    {data?.employeeList &&
                                        data.employeeList.map((i, idx) => (
                                            <MenuItem value={i.id} key={idx}>{`${i.first_name} ${i.last_name}`}</MenuItem>
                                        ))}
                                </Select>
                                <FormHelperText>{formik.touched.employee_id && formik.errors.employee_id}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={4} md={3}>
                            <Typography variant="subtitle1">
                                <Required title="Roll Over Month" />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                            <FormControl
                                size="small"
                                fullWidth
                                error={formik.touched.roll_over_month && Boolean(formik.errors.roll_over_month)}
                            >
                                <InputLabel id="roll_over_month_label">Roll Over Month</InputLabel>
                                <Select
                                    labelId="roll_over_month_label"
                                    id="roll_over_month"
                                    name="roll_over_month"
                                    label="Roll Over Month"
                                    value={formik.values.roll_over_month}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.setFieldTouched('roll_over_bill', false, false);
                                    }}
                                    disabled={formik.values.roll_over_bill != '0' ? true : false}
                                >
                                    <MenuItem value={0}>select</MenuItem>
                                    {Array.apply(1, Array(12)).map((x, i) => (
                                        <MenuItem value={i + 1} key={i}>
                                            {i + 1}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{formik.touched.roll_over_month && formik.errors.roll_over_month}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={4} md={3}>
                            <Typography variant="subtitle1">
                                <Required title="Roll Over Bill" />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                            <FormControl
                                size="small"
                                fullWidth
                                error={formik.touched.roll_over_bill && Boolean(formik.errors.roll_over_bill)}
                            >
                                <InputLabel id="roll_over_bill_label">Roll Over Bill</InputLabel>
                                <Select
                                    labelId="roll_over_bill_label"
                                    id="roll_over_bill"
                                    name="roll_over_bill"
                                    label="Roll Over Bill"
                                    value={formik.values.roll_over_bill}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.setFieldTouched('roll_over_month', false, false);
                                    }}
                                    disabled={formik.values.roll_over_month != '0' ? true : false}
                                >
                                    <MenuItem value={'0'}>select</MenuItem>
                                    {Array.apply(1, Array(12)).map((x, i) => (
                                        <MenuItem value={i + 1} key={i}>
                                            {i + 1}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{formik.touched.roll_over_bill && formik.errors.roll_over_bill}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12}>
                            <Grid container justifyContent="space-between">
                                <Typography variant="subtitle1" align="left">
                                    Slabs
                                </Typography>

                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        addSlabHandler(e);
                                    }}
                                >
                                    Add Slab
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table
                            sx={
                                !matchUpMd
                                    ? {
                                          width: 'max-content'
                                      }
                                    : {}
                            }
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '250px' }}>From</TableCell>
                                    <TableCell sx={{ width: '250px' }}>To</TableCell>
                                    <TableCell sx={{ width: '250px' }}>Amount Type</TableCell>
                                    <TableCell sx={{ width: '250px' }}>Amount</TableCell>
                                    <TableCell sx={{ width: '100px' }} align="right">
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {formik.values.slabs.map((i, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                id={`slabs.[${idx}].from`}
                                                name={`slabs.[${idx}].from`}
                                                label={<Required title="From" />}
                                                value={i.from}
                                                onChange={formik.handleChange}
                                                error={checkTouchedValidation(idx, 'from')}
                                                helperText={checkErrorValidation(idx, 'from')}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                id={`slabs.${idx}.to`}
                                                name={`slabs.${idx}.to`}
                                                label={<Required title="To" />}
                                                value={i.to}
                                                onChange={formik.handleChange}
                                                error={checkTouchedValidation(idx, 'to')}
                                                helperText={checkErrorValidation(idx, 'to')}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormControl size="small" fullWidth>
                                                <InputLabel id="amount_type_label">Amount Type</InputLabel>
                                                <Select
                                                    labelId="amount_type_label"
                                                    label="Amount Type"
                                                    id={`slabs.${idx}.amount_type`}
                                                    name={`slabs.${idx}.amount_type`}
                                                    value={i.amount_type}
                                                    onChange={formik.handleChange}
                                                >
                                                    <MenuItem value="%">%</MenuItem>
                                                    <MenuItem value="Flat">Flat</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                id={`slabs.${idx}.amount`}
                                                name={`slabs.${idx}.amount`}
                                                label={<Required title="Amount" />}
                                                value={i.amount}
                                                onChange={formik.handleChange}
                                                error={checkTouchedValidation(idx, 'amount')}
                                                helperText={checkErrorValidation(idx, 'amount')}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton color="error" component="label" onClick={() => deleteHandler(idx)}>
                                                <DeleteOutline fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2} justifyContent="flex-end">
                        <Grid item xs={12}>
                            <DialogActions>
                                <AnimateButton>
                                    <Button variant="contained" color="primary" type="submit">
                                        save
                                    </Button>
                                </AnimateButton>
                            </DialogActions>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

export default Form;
