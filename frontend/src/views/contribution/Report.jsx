import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { ClientListByEmployeeApi, ContributionInitApi } from 'apis/Contribution';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

const Report = () => {
    const { recall } = useAuth();
    const [data, setData] = useState({});
    const [clientData, setClientData] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState('0');

    useEffect(() => {
        ContributionInitApi()
            .then((res) => {
                setData(res.data.data);
                setSelectedEmployee('0');
                setShowForm(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [recall]);

    const changeEmployeeHandler = (empID) => {
        setSelectedEmployee(empID);
        ClientListByEmployeeApi({ employee_id: empID })
            .then((res) => {
                setClientData(res.data.data);
                setShowForm(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <MainCard
            title={
                <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={gridSpacing}>
                            <Grid item sx={{ flexGrow: 1 }}>
                                <Typography variant="column">Contribution Report</Typography>
                            </Grid>
                            <Grid item>
                                <FormControl size="small" sx={{ minWidth: '100px' }}>
                                    <InputLabel id="permission">Employee</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="permission"
                                        id="permission"
                                        label="Employee"
                                        value={selectedEmployee}
                                        onChange={(e) => {
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
            {showForm && clientData.clientData.length > 0 ? (
                <TableContainer>
                    <Table
                        sx={{
                            width: 'max-content'
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '200px' }}>Client Name</TableCell>
                                {clientData.months &&
                                    clientData.months.map((i, idx) => (
                                        <TableCell sx={{ width: '200px' }} key={idx} align="right">
                                            {i}
                                        </TableCell>
                                    ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientData.clientData &&
                                clientData.clientData.map((i, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            {i.client_name}
                                            <Typography variant="subtitle2">{i.company_name}</Typography>
                                        </TableCell>
                                        {i.monthData &&
                                            i.monthData.map((iv, index) => (
                                                <TableCell key={index} align="right">
                                                    <Typography variant="subtitle1">{iv}</Typography>
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box component="span">
                    <Typography
                        variant="h2"
                        textAlign="center"
                        sx={{
                            p: '10%'
                        }}
                        color="GrayText"
                    >
                        Please Select Employee
                    </Typography>
                </Box>
            )}
        </MainCard>
    );
};

export default Report;
