import { Button, DialogActions, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { addUpdateContributionRatioApi } from 'apis/Settings';
import { useFormik } from 'formik';
import propTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';
import * as yup from 'yup';

const status = [{ label: 'Active' }, { label: 'Inactive' }];

const validationSchema = yup.object().shape({
    ratio_name: yup.string().required('Name is required.'),
    ratio: yup.string().required('Ratio is required.'),
    status: yup.string().required('Status is required.')
});

const AddEditContributionRatio = ({ value, formID, onSubmit }) => {
    const initValue = value ?? false;
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            ratio_name: initValue ? initValue.title : '',
            ratio: initValue ? initValue.ratio : '',
            description: initValue ? initValue.description : '',
            status: initValue ? initValue.status : 'Active',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            addUpdateContributionRatioApi(values)
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
                                id="ratio_name"
                                name="ratio_name"
                                label={<Required title="Name" />}
                                value={formik.values.ratio_name}
                                onChange={formik.handleChange}
                                error={formik.touched.ratio_name && Boolean(formik.errors.ratio_name)}
                                helperText={formik.touched.ratio_name && formik.errors.ratio_name}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            {/* <NumericFormat
                                value={formik.values.ratio}
                                onValueChange={(e) => {
                                    console.log(e.value);
                                    formik.setFieldValue('ratio', e.value);
                                }}
                                decimalScale={2}
                                suffix={'%'}
                                isAllowed={(values) => {
                                    const { value } = values;
                                    return value <= 100;
                                }}
                                fullWidth
                                size="small"
                                id="ratio"
                                name="ratio"
                                label={<Required title="Ratio" />}
                                error={formik.touched.ratio && Boolean(formik.errors.ratio)}
                                helperText={formik.touched.ratio && formik.errors.ratio}
                                customInput={TextField}
                            /> */}

                            <TextField
                                fullWidth
                                size="small"
                                id="ratio"
                                name="ratio"
                                type="number"
                                label={<Required title="Ratio" />}
                                value={formik.values.ratio}
                                onChange={formik.handleChange}
                                // InputProps={{
                                //     inputComponent: RateFormate1
                                // }}
                                // InputLabelProps={{
                                //     shrink: formik.values.ratio ? true : false
                                // }}
                                error={formik.touched.ratio && Boolean(formik.errors.ratio)}
                                helperText={formik.touched.ratio && formik.errors.ratio}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                multiline
                                size="small"
                                id="description"
                                name="description"
                                label="Description"
                                rows={5}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                        </Grid>
                    </Grid>
                </Grid>
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

AddEditContributionRatio.propTypes = {
    value: propTypes.object,
    formID: propTypes.string,
    onSubmit: propTypes.func
};

export default AddEditContributionRatio;
