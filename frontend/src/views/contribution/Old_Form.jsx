import {
    Autocomplete,
    Button,
    Checkbox,
    DialogActions,
    FormControl,
    Grid,
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
    Typography
} from '@mui/material';
import { AddUpdateContributionApi, ClientListByEmployeeApi, ContributionInitApi } from 'apis/Contribution';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { useEffect } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';

const Form = () => {
    const { recall } = useAuth();
    const [data, setData] = useState({});
    const [clientData, setClientData] = useState({});
    const [showForm, setShowForm] = useState(false);
    // const [selectedEmployee, setSelectedEmployee] = useState('0');

    const formik = useFormik({
        initialValues: { employee_id: '0', contribution: [] },
        onSubmit: (values) => {
            console.log(values);
            // values.contribution.map((i, idx) => {
            //     i !== undefined &&
            //         Object.keys(i).map((iv) => {
            //             i[iv].map((ivv, inx) => {
            //                 console.log(`contribution[${idx}][${iv}][]`, ivv);
            //             });
            //         });
            // });
            AddUpdateContributionApi(values)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });

    useEffect(() => {
        ContributionInitApi()
            .then((res) => {
                setData(res.data.data);
                formik.setFieldValue('employee_id', '0');
                setShowForm(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [recall]);

    const changeEmployeeHandler = (empID) => {
        formik.setFieldValue('contribution', []);

        // setSelectedEmployee(empID);
        ClientListByEmployeeApi({ employee_id: empID })
            .then((res) => {
                setClientData(res.data.data);
                setShowForm(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (formik.values.employee_id != '0') {
            changeEmployeeHandler(formik.values.employee_id);
        }
    }, []);

    return (
        <MainCard
            title={
                <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={gridSpacing}>
                            <Grid item sx={{ flexGrow: 1 }}>
                                <Typography variant="column">Contribution Form</Typography>
                            </Grid>
                            <Grid item>
                                <FormControl size="small" sx={{ minWidth: '100px' }}>
                                    <InputLabel id="permission">Employee</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="permission"
                                        id="permission"
                                        label="Employee"
                                        value={formik.values.employee_id}
                                        onChange={(e) => {
                                            formik.setFieldValue('employee_id', e.target.value);
                                            changeEmployeeHandler(e.target.value);
                                        }}
                                    >
                                        <MenuItem value="0">Select</MenuItem>
                                        {data?.employeeList &&
                                            data.employeeList.map((i, idx) => (
                                                <MenuItem value={i.id} key={idx}>{`${i.first_name} ${i.last_name}`}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
            content={true}
        >
            {showForm && clientData?.clientList.length > 0 && (
                <form onSubmit={formik.handleSubmit}>
                    <TableContainer>
                        <Table
                            sx={{
                                width: 'max-content'
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '250px' }}>Client Name</TableCell>
                                    {clientData?.monthList &&
                                        clientData.monthList.map((i, idx) => (
                                            <TableCell sx={{ width: '250px' }} key={idx}>
                                                {i.name}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clientData?.clientList &&
                                    clientData.clientList.map((i, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                {i.client_name}
                                                <Typography variant="subtitle2">{i.company_name}</Typography>
                                            </TableCell>
                                            {clientData?.monthList &&
                                                clientData.monthList.map((iv, index) => (
                                                    <TableCell sx={{ width: '250px' }} key={index}>
                                                        <Autocomplete
                                                            multiple
                                                            size="small"
                                                            options={data?.contributionRatioList ?? []}
                                                            id={`contribution_${i.id}_${iv.id}`}
                                                            name={`contribution_${i.id}_${iv.id}`}
                                                            getOptionLabel={(option) => (option.title ? option.title : '')}
                                                            renderOption={(props, option, { selected }) => (
                                                                <li {...props}>
                                                                    <Checkbox checked={selected} value={option.id} />
                                                                    {option.title}
                                                                </li>
                                                            )}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    size="small"
                                                                    id={`contribution_${i.id}_${iv.id}`}
                                                                    name={`contribution_${i.id}_${iv.id}`}
                                                                    label="Contribution"
                                                                />
                                                            )}
                                                            onChange={(_, v) => {
                                                                formik.setFieldValue(`contribution.${i.id}.${iv.id}`, v);
                                                            }}
                                                        />
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                </form>
            )}
        </MainCard>
    );
};

export default Form;
