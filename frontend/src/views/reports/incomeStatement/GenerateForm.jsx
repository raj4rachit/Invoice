import propTypes from 'prop-types';
import { Grid, MenuItem, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useFormik } from 'formik';
import moment from 'moment';
import { IncomeStatementApi } from 'apis/Reports';
import { apiErrorSnackBar } from 'utils/SnackBar';
import useAuth from 'hooks/useAuth';

const GenerateForm = ({ value, formID, initData, setReportData, onSubmit }) => {
    const { company } = useAuth();
    const initialData = initData ?? false;
    const initValue = Object.keys(value).length > 0 ? value : false;

    const formik = useFormik({
        initialValues: {
            company_id: initValue ? initValue.company_id : company.company_id,
            start_date: initValue ? moment(initValue.start_date) : moment(company.start_date),
            end_date: initValue ? moment(initValue.end_date) : moment(company.end_date)
        },
        onSubmit: (values) => {
            values.start_date = moment(values.start_date).format('YYYY-MM-DD');
            values.end_date = moment(values.end_date).format('YYYY-MM-DD');

            IncomeStatementApi(values)
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
                            id="company_id"
                            name="company_id"
                            value={formik.values.company_id}
                            onChange={formik.handleChange}
                            error={formik.touched.company_id && Boolean(formik.errors.company_id)}
                            helperText={formik.touched.company_id && formik.errors.company_id}
                        >
                            <MenuItem key={-1} value={0}>
                                All Companies
                            </MenuItem>
                            {initialData &&
                                initialData.companyList.map((i, idx) => (
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
    initData: propTypes.object,
    setReportData: propTypes.func,
    onSubmit: propTypes.func
};

export default GenerateForm;
