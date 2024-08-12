import { DeleteOutline } from '@mui/icons-material';
import { Grid, IconButton, Link, MenuItem, TextField, Typography } from '@mui/material';
import { AddUpdateCompanyBank } from 'apis/Settings';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { Fragment } from 'react';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    company_id: yup.string().required('Company is required.'),
    bank_details_name: yup.string().required('Bank details name is required.'),
    bank_name: yup.string().required('Bank name is required.'),
    account_name: yup.string().required('Account name is required.'),
    account_number: yup.string().required('Account number is required.'),
    extraFiled: yup.array().of(
        yup.object().shape({
            extraFiled: yup.string().required('Filed name is required'),
            extraValue: yup.string().required('Filed value is required')
        })
    )
});

const initExtraFiled = {
    extraFiled: '',
    extraValue: ''
};

const AddEditBankDetails = ({ value, formID, initData, onSubmit }) => {
    const { company } = useAuth();
    const initValue = value ?? false;
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            company_id: initValue ? initValue.company_id : company.company_id !== '0' ? company.company_id : '',
            bank_details_name: initValue ? initValue.bank_detail_name : '',
            bank_name: initValue ? initValue.bank_name : '',
            account_name: initValue ? initValue.account_name : '',
            account_number: initValue ? initValue.account_number : '',
            extraFiled: initValue ? initValue.extraFiled : [initExtraFiled],
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            AddUpdateCompanyBank(values)
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

    const checkTouchedValidation = (index, filedName) => {
        if (formik.touched.extraFiled && formik.touched.extraFiled[0] && formik.touched.extraFiled[0][filedName]) {
            if (formik.errors.extraFiled && formik.errors.extraFiled[index] && formik.errors.extraFiled[index][filedName]) {
                return Boolean(formik.errors.extraFiled[index][filedName]);
            }
            return false;
        }
        return false;
    };

    const checkErrorValidation = (index, filedName) => {
        if (
            formik.touched.extraFiled &&
            formik.errors.extraFiled &&
            formik.errors.extraFiled[index] &&
            formik.errors.extraFiled[index][filedName]
        ) {
            return formik.errors.extraFiled[index][filedName];
        }
        return '';
    };

    const deleteHandler = (index) => {
        const filedValue = formik.values.extraFiled;
        filedValue.splice(index, 1);
        formik.setFieldValue('extraFiled', filedValue);
    };

    return (
        <form id={formID} onSubmit={formik.handleSubmit}>
            <Grid item container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        id="company_id"
                        name="company_id"
                        label={<Required title="Company" />}
                        value={formik.values.company_id}
                        onChange={formik.handleChange}
                        error={formik.touched.company_id && Boolean(formik.errors.company_id)}
                        helperText={formik.touched.company_id && formik.errors.company_id}
                    >
                        {initData.map((val, idx) => (
                            <MenuItem key={idx} value={val.id}>
                                {val.company_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        fullWidth
                        size="small"
                        id="bank_details_name"
                        name="bank_details_name"
                        label={<Required title="Bank Detail Name" />}
                        value={formik.values.bank_details_name}
                        onChange={formik.handleChange}
                        error={formik.touched.bank_details_name && Boolean(formik.errors.bank_details_name)}
                        helperText={formik.touched.bank_details_name && formik.errors.bank_details_name}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        fullWidth
                        size="small"
                        id="bank_name"
                        name="bank_name"
                        label={<Required title="Bank Name" />}
                        value={formik.values.bank_name}
                        onChange={formik.handleChange}
                        error={formik.touched.bank_name && Boolean(formik.errors.bank_name)}
                        helperText={formik.touched.bank_name && formik.errors.bank_name}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        fullWidth
                        size="small"
                        id="account_name"
                        name="account_name"
                        label={<Required title="Account Name" />}
                        value={formik.values.account_name}
                        onChange={formik.handleChange}
                        error={formik.touched.account_name && Boolean(formik.errors.account_name)}
                        helperText={formik.touched.account_name && formik.errors.account_name}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        fullWidth
                        size="small"
                        id="account_number"
                        name="account_number"
                        label={<Required title="Account Number" />}
                        value={formik.values.account_number}
                        onChange={formik.handleChange}
                        error={formik.touched.account_number && Boolean(formik.errors.account_number)}
                        helperText={formik.touched.account_number && formik.errors.account_number}
                    />
                </Grid>

                {/* Start Extra Details */}
                <Grid item xs={12} sm={12}>
                    <Grid container justifyContent="space-between">
                        <Typography variant="body1" align="left">
                            Extra Details
                        </Typography>

                        <Link
                            underline="hover"
                            onClick={() => {
                                const formikValue = formik.values.extraFiled;
                                formik.setFieldValue('extraFiled', [...formikValue, initExtraFiled]);
                            }}
                            sx={{
                                cursor: 'pointer'
                            }}
                        >
                            Add Extra Details
                        </Link>
                    </Grid>
                </Grid>

                {formik.values.extraFiled.map((i, idx) => (
                    <Fragment key={idx}>
                        <Grid item xs={12} sm={5.5}>
                            <TextField
                                fullWidth
                                size="small"
                                id={`extraFiled[${idx}].extraFiled`}
                                name={`extraFiled[${idx}].extraFiled`}
                                label={<Required title={`Filed Name`} />}
                                value={formik.values.extraFiled[idx].extraFiled}
                                onChange={formik.handleChange}
                                error={checkTouchedValidation(idx, 'extraFiled')}
                                helperText={checkErrorValidation(idx, 'extraFiled')}
                            />
                        </Grid>
                        <Grid item xs={10} sm={5.5}>
                            <TextField
                                fullWidth
                                size="small"
                                id={`extraFiled[${idx}].extraValue`}
                                name={`extraFiled[${idx}].extraValue`}
                                label={<Required title={`Filed Value`} />}
                                value={formik.values.extraFiled[idx].extraValue}
                                onChange={formik.handleChange}
                                error={checkTouchedValidation(idx, 'extraValue')}
                                helperText={checkErrorValidation(idx, 'extraValue')}
                            />
                        </Grid>
                        <Grid item xs={1} sm={1}>
                            <IconButton color="error" component="label" onClick={() => deleteHandler(idx)}>
                                <DeleteOutline fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Fragment>
                ))}
            </Grid>
        </form>
    );
};

export default AddEditBankDetails;
