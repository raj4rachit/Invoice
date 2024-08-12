import { ArrowDropDownOutlined, ArrowDropUpOutlined, ArrowUpwardOutlined } from '@mui/icons-material';
import { Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { Fragment } from 'react';

const ReportPage = ({ reportData }) => {
    const Subscriber_currency_symbol = reportData.Subscriber_currency_symbol ?? '';
    const USD_symbol = reportData.USD_symbol ?? '';
    const headers = reportData.headers ?? [];
    const income = reportData.incomes ?? [];
    const expense = reportData.expenses ?? [];
    const totalIncome = reportData.total_incomes ?? [];
    const totalExpense = reportData.total_expenses ?? [];
    const totalMargin = reportData.total_margin ?? [];

    const checkUpDownCost = (type) => {
        if (type === 'up') {
            return <ArrowDropUpOutlined color="success" sx={{ fontSize: '25px', verticalAlign: 'middle' }} />;
        }

        if (type === 'down') {
            return <ArrowDropDownOutlined color="error" sx={{ fontSize: '25px', verticalAlign: 'middle' }} />;
        }

        return '';
    };

    return (
        <TableContainer>
            <Table
                size="small"
                sx={{
                    marginTop: 5,
                    [`& .${tableCellClasses.root}`]: {
                        borderLeft: '1px solid',
                        borderRight: '1px solid',
                        borderTop: '1px solid',
                        borderBottom: '1px solid'
                    }
                }}
            >
                <TableHead
                    sx={{
                        backgroundColor: 'lightblue'
                    }}
                >
                    <TableRow>
                        <TableCell rowSpan={2}>
                            <Typography variant="h4">Incomes</Typography>
                        </TableCell>
                        {headers.map((res, idx) => (
                            <TableCell align="center" colSpan={2} key={idx}>
                                <Typography variant="h4">{res.financial_year_name}</Typography>
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        {headers.map((res, idx) => (
                            <Fragment key={idx}>
                                <TableCell align="center">
                                    <Typography variant="h4">({Subscriber_currency_symbol})</Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="h4">({USD_symbol})</Typography>
                                </TableCell>
                            </Fragment>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {income.map((res, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{res.name}</TableCell>
                            {res.income.map((ires, iidx) => (
                                <Fragment key={iidx}>
                                    <TableCell align="right">
                                        {checkUpDownCost(ires.type)}
                                        {ires.subscriber_currency_total_amount}
                                    </TableCell>
                                    <TableCell align="right">
                                        {checkUpDownCost(ires.type)}
                                        {ires.USD_currency_total_amount}
                                    </TableCell>
                                </Fragment>
                            ))}
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell>
                            <b>Total</b>
                        </TableCell>
                        {totalIncome.map((res, idx) => (
                            <Fragment key={idx}>
                                <TableCell align="right">
                                    {checkUpDownCost(res.type)}
                                    <b>{res.subscriber_currency_total_amount}</b>
                                </TableCell>
                                <TableCell align="right">
                                    {checkUpDownCost(res.type)}
                                    <b>{res.USD_currency_total_amount}</b>
                                </TableCell>
                            </Fragment>
                        ))}
                    </TableRow>
                </TableBody>
                <TableBody>
                    <TableRow></TableRow>
                </TableBody>
                <TableHead
                    sx={{
                        backgroundColor: 'lightblue'
                    }}
                >
                    <TableRow>
                        <TableCell rowSpan={2}>
                            <Typography variant="h4">Expenses</Typography>
                        </TableCell>
                        {headers.map((res, idx) => (
                            <TableCell align="center" colSpan={2} key={idx}>
                                <Typography variant="h4">{res.financial_year_name}</Typography>
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        {headers.map((res, idx) => (
                            <Fragment key={idx}>
                                <TableCell align="center">
                                    <Typography variant="h4">({Subscriber_currency_symbol})</Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="h4">({USD_symbol})</Typography>
                                </TableCell>
                            </Fragment>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expense.map((res, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{res.name}</TableCell>
                            {res.expenses.map((ires, iidx) => (
                                <Fragment key={iidx}>
                                    <TableCell align="right">
                                        {checkUpDownCost(ires.type)}
                                        {ires.subscriber_currency_total_amount}
                                    </TableCell>
                                    <TableCell align="right">
                                        {checkUpDownCost(ires.type)}
                                        {ires.USD_currency_total_amount}
                                    </TableCell>
                                </Fragment>
                            ))}
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell>
                            <b>Total</b>
                        </TableCell>
                        {totalExpense.map((res, idx) => (
                            <Fragment key={idx}>
                                <TableCell align="right">
                                    {checkUpDownCost(res.type)}
                                    <b>{res.subscriber_currency_total_amount}</b>
                                </TableCell>
                                <TableCell align="right">
                                    {checkUpDownCost(res.type)}
                                    <b>{res.USD_currency_total_amount}</b>
                                </TableCell>
                            </Fragment>
                        ))}
                    </TableRow>

                    {/* Total Margin */}
                    <TableRow
                        sx={{
                            backgroundColor: 'antiquewhite'
                        }}
                    >
                        <TableCell>
                            <b>Total Margin</b>
                        </TableCell>
                        {totalMargin.map((res, idx) => (
                            <Fragment key={idx}>
                                <TableCell align="right">
                                    {checkUpDownCost(res.type)}
                                    <b>{res.subscriber_currency_total_amount}</b>
                                </TableCell>
                                <TableCell align="right">
                                    {checkUpDownCost(res.type)}
                                    <b>{res.USD_currency_total_amount}</b>
                                </TableCell>
                            </Fragment>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReportPage;
