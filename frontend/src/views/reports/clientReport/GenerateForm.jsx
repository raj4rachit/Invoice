import propTypes from 'prop-types';
import { Grid, MenuItem, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useFormik } from 'formik';
import moment from 'moment';
import { ClientStatementApi, IncomeStatementApi } from 'apis/Reports';
import { apiErrorSnackBar } from 'utils/SnackBar';
import useAuth from 'hooks/useAuth';

const GenerateForm = ({ value, formID, initData, setReportData, onSubmit }) => {
    const { company } = useAuth();
    const initialData = initData ?? false;
    const initValue = Object.keys(value).length > 0 ? value : false;

    const formik = useFormik({
        initialValues: {
            client_id: initValue ? initValue.client_id : '0',
            start_date: initValue ? moment(initValue.start_date) : moment(company.start_date),
            end_date: initValue ? moment(initValue.end_date) : moment(company.end_date)
        },
        onSubmit: (values) => {
            values.start_date = moment(values.start_date).format('YYYY-MM-DD');
            values.end_date = moment(values.end_date).format('YYYY-MM-DD');

            ClientStatementApi(values)
                .then((res) => {
                    if (onSubmit) onSubmit();
                    setReportData(res.data.data);
                })
                .catch((err) => {
                    apiErrorSnackBar(err);
                });
        }
    });

    return (
        <form id={formID} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <LocalizationProvider dateAdapter={AdapterMoment} localeText={{ start: 'Start Date', end: 'From Date' }}>
                    <Grid item xs={12}>
                        <DesktopDatePicker
                            id="start_date"
                            name="start_date"
                            label="Start Date"
                            inputFormat="YYYY-MM-DD"
                            value={formik.values.start_date}
                            onChange={(newValue) => {
                                formik.setFieldValue('start_date', moment(newValue));
                            }}
                            renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DesktopDatePicker
                            id="end_date"
                            name="end_date"
                            label="End date"
                            inputFormat="YYYY-MM-DD"
                            value={formik.values.end_date}
                            onChange={(newValue) => {
                                formik.setFieldValue('end_date', moment(newValue));
                            }}
                            renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            size="small"
                            label="Company"
                            fullWidth
                            id="client_id"
                            name="client_id"
                            value={formik.values.client_id}
                            onChange={formik.handleChange}
                            error={formik.touched.client_id && Boolean(formik.errors.client_id)}
                            helperText={formik.touched.client_id && formik.errors.client_id}
                        >
                            <MenuItem key={-1} value={0}>
                                All Clients
                            </MenuItem>
                            {initialData &&
                                initialData.map((i, idx) => (
                                    <MenuItem key={idx} value={i.id}>
                                        {i.company_name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </Grid>
                </LocalizationProvider>
            </Grid>
        </form>
    );
};

// ========== PropTypes ========== //

GenerateForm.propTypes = {
    value: propTypes.object,
    formID: propTypes.string.isRequired,
    initData: propTypes.array,
    setReportData: propTypes.func,
    onSubmit: propTypes.func
};

export default GenerateForm;
