import { Button, DialogActions, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { addUpdateClientGroupApi } from 'apis/Settings';
import { useFormik } from 'formik';
import propTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';
import * as yup from 'yup';

const status = [{ label: 'Active' }, { label: 'Inactive' }];

const validationSchema = yup.object().shape({
    group_name: yup.string().required('Group name is required.'),
    status: yup.string().required('Status is required.')
});
const AddEditClientGroup = ({ value, formID, onSubmit }) => {
    const initValue = value ?? false;
    const formik = useFormik({
        initialValues: {
            id: initValue ? initValue.id : '',
            group_name: initValue ? initValue.group_name : '',
            description: initValue ? initValue.description : '',
            status: initValue ? initValue.status : 'Active',
            formType: initValue && initValue.id ? 'edit' : 'add'
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            addUpdateClientGroupApi(values)
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
                                id="group_name"
                                name="group_name"
                                label={<Required title="Group name" />}
                                value={formik.values.group_name}
                                onChange={formik.handleChange}
                                error={formik.touched.group_name && Boolean(formik.errors.group_name)}
                                helperText={formik.touched.group_name && formik.errors.group_name}
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

AddEditClientGroup.propTypes = {
    value: propTypes.object,
    formID: propTypes.string,
    onSubmit: propTypes.func
};

export default AddEditClientGroup;
