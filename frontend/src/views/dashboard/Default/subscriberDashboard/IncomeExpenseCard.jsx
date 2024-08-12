import { CalendarMonthTwoTone } from '@mui/icons-material';
import { CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonAmountCard from './Skeleton/AmountCard';

const IncomeExpenseCard = ({ isLoading, data }) => {
    const [monthName, setMonthName] = useState(moment().format('MMMM'));
    return (
        <>
            {isLoading ? (
                <SkeletonAmountCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Typography variant="h4">Other Incomes / Invoiced / Payment / Expenses</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Month</TableCell>
                                        <TableCell align="right">Other Income</TableCell>
                                        <TableCell align="right">Invoiced</TableCell>
                                        <TableCell align="right">Payment</TableCell>
                                        <TableCell align="right">Expenses</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((i, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <Typography
                                                    variant={idx + 1 === data.length ? 'h5' : 'subtitle1'}
                                                    color={idx + 1 === data.length ? '' : 'inherit'}
                                                >
                                                    {i.month}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    variant={idx + 1 === data.length ? 'h5' : 'subtitle1'}
                                                    color={idx + 1 === data.length ? '' : 'inherit'}
                                                    align="right"
                                                >
                                                    {i.otherIncome}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    variant={idx + 1 === data.length ? 'h5' : 'subtitle1'}
                                                    color={idx + 1 === data.length ? '' : 'inherit'}
                                                    align="right"
                                                >
                                                    {i.income}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    variant={idx + 1 === data.length ? 'h5' : 'subtitle1'}
                                                    color={idx + 1 === data.length ? '' : 'inherit'}
                                                    align="right"
                                                >
                                                    {i.payment}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    variant={idx + 1 === data.length ? 'h5' : 'subtitle1'}
                                                    color={idx + 1 === data.length ? '' : 'inherit'}
                                                    align="right"
                                                >
                                                    {i.expense}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* DIv */}
                        {/* <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">Invoiced / Payment / Expenses</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <Typography variant="h5">Month</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" align="right">
                                            Invoiced
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" align="right">
                                            Payment
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" align="right">
                                            Expenses
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {data.map((i, idx) => (
                                <Grid item xs={12} key={idx}>
                                    <Grid container>
                                        <Grid item xs={3}>
                                            <Typography
                                                variant={idx + 1 === data.length ? 'h5' : 'subtitle1'}
                                                color={idx + 1 === data.length ? '' : 'inherit'}
                                            >
                                                {i.month}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3} alignItems="right">
                                            <Typography
                                                variant={idx + 1 === data.length ? 'h5' : 'subtitle1'}
                                                color={idx + 1 === data.length ? '' : 'inherit'}
                                                align="right"
                                            >
                                                {i.income}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3} alignItems="right">
                                            <Typography
                                                variant={idx + 1 === data.length ? 'h5' : 'subtitle1'}
                                                color={idx + 1 === data.length ? '' : 'inherit'}
                                                align="right"
                                            >
                                                {i.payment}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography
                                                variant={idx + 1 === data.length ? 'h5' : 'subtitle1'}
                                                color={idx + 1 === data.length ? '' : 'inherit'}
                                                align="right"
                                            >
                                                {i.expense}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid> */}
                    </CardContent>
                </MainCard>
            )}
        </>
    );
};

export default IncomeExpenseCard;
