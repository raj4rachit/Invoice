import propTypes from 'prop-types';
import { Button, DialogActions, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { forwardRef } from 'react';
import { NumberFormatBase } from 'react-number-format/dist/react-number-format.cjs';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Required from 'views/utilities/Required';
import * as yup from 'yup';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import { addUpdateInvoiceItemTypeListApi } from 'apis/Settings';

const isDate = [{ label: 'Yes' }, { label: 'No' }];
const dateType = [
    { value: 'days', label: 'Days' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' }
];
const status = [{ label: 'Active' }, { label: 'Inactive' }];

const validationSchema = yup.object().shape({
    item_type_name: yup.string().required('Item type name is required.'),
    date_type: yup.string().when('is_date', { is: 'Yes', then: yup.string().required('Date type is required.') }),
    date_no: yup.string().when('is_date', { is: 'Yes', then: yup.string().required('Date no is required.') })
});

// Date No
const DateNoFormate = forwardRef(function DateNoFormate(props, ref) {
    const { onChange, ...other } = props;
    return (
        <NumberFormatBase
            {...other}
            getInputRef={(inputRef) => {
                ref = inputRef;
            }}
            isAllowed={(values, sourceInfo) => {
                const { value } = values;
                return value <= other.max;
            }}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value
                    }
                });
            }}
            type="input"
        />
    );
});

const AddEditInvoiceItemType = ({ value, formID, onSubmit }) => {
    const initValue = value ?? false;
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            item_type_name: initValue ? initValue.item_type_name : '',
            is_date: initValue ? initValue.is_date : 'No',
            date_type: initValue ? initValue.date_type : 'days',
            date_no: initValue ? Number(initValue.date_no) : '1',
            status: initValue ? initValue.status : 'Active',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            addUpdateInvoiceItemTypeListApi(values)
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
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                size="small"
                                id="item_type_name"
                                name="item_type_name"
                                label={<Required title="Item Type Name" />}
                                value={formik.values.item_type_name}
                                onChange={formik.handleChange}
                                error={formik.touched.item_type_name && Boolean(formik.errors.item_type_name)}
                                helperText={formik.touched.item_type_name && formik.errors.item_type_name}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <FormControl size="small" fullWidth>
                                <InputLabel id="is_date_label">Is Date?</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="is_date_label"
                                    id="is_date"
                                    name="is_date"
                                    label="Is Date?"
                                    value={formik.values.is_date}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.setFieldValue('date_type', 'days');
                                        formik.setFieldValue('date_no', '1');
                                    }}
                                >
                                    {isDate.map((item, idx) => (
                                        <MenuItem value={item.label} key={idx}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                {formik.values.is_date === 'Yes' && (
                    <>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl
                                        size="small"
                                        fullWidth
                                        error={Boolean(formik.touched.date_type && formik.errors.date_type)}
                                    >
                                        <InputLabel id="date_type_label">
                                            <Required title="Date Type" />
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="date_type_label"
                                            id="date_type"
                                            name="date_type"
                                            label={<Required title="Date Type" />}
                                            value={formik.values.date_type}
                                            onChange={formik.handleChange}
                                        >
                                            {dateType.map((item, idx) => (
                                                <MenuItem value={item.value} key={idx} onClick={() => formik.setFieldValue('date_no', '')}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {formik.touched.date_type && formik.errors.date_type && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {formik.errors.date_type}
                                            </FormHelperText>
                                        )}
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
                                        id="date_no"
                                        name="date_no"
                                        value={formik.values.date_no}
                                        InputLabelProps={{
                                            shrink: formik.values.date_no ? true : false
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                max:
                                                    formik.values.date_type === 'days'
                                                        ? 31
                                                        : formik.values.date_type === 'months'
                                                        ? 12
                                                        : formik.values.date_type === 'years'
                                                        ? 10
                                                        : 0,
                                                maxLength: 2
                                            },
                                            inputComponent: DateNoFormate
                                        }}
                                        label={<Required title="Date No." />}
                                        onChange={formik.handleChange}
                                        error={formik.touched.date_no && Boolean(formik.errors.date_no)}
                                        helperText={formik.touched.date_no && formik.errors.date_no}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                )}

                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <FormControl size="small" fullWidth>
                                <InputLabel id="status">Status</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="status"
                                    id="status"
                                    name="status"
                                    label="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                >
                                    {status.map((item, idx) => (
                                        <MenuItem value={item.label} key={idx}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                {formik.values.formType === 'add' && (
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2} justifyContent="flex-end">
                            <Grid item xs={12}>
                                <DialogActions>
                                    <AnimateButton>
                                        <Button variant="contained" color="primary" type="submit">
                                            save
                                        </Button>
                                    </AnimateButton>
                                    <Button variant="text" color="error" onClick={() => formik.resetForm()}>
                                        clear
                                    </Button>
                                </DialogActions>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </form>
    );
};

AddEditInvoiceItemType.propTypes = {
    value: propTypes.object,
    formID: propTypes.string.isRequired,
    onSubmit: propTypes.func
};

export default AddEditInvoiceItemType;
