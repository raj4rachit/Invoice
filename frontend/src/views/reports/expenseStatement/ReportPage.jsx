import { Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';

const ReportPage = ({ reportData }) => {
    const company = reportData.companyDetails;
    const expenses = reportData.expenses;

    const columnCount = reportData.company_id === '0' ? 4 : 3;
    return (
        <TableContainer>
            <Table
                sx={{
                    [`& .${tableCellClasses.root}`]: {
                        borderBottom: 'none'
                    }
                }}
            >
                <TableHead>
                    {reportData.company_id === '0' ? (
                        <TableRow>
                            <TableCell align="center">
                                <Typography variant="h2">All Companies</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <TableRow>
                            <TableCell align="center">
                                <Typography variant="h2">{company.company_name}</Typography>
                                <Typography variant="inherit">
                                    {`${company.address_1}${company.address_2 && ` ${company.address_2}`}`},
                                    {` ${company.city}, ${company.state} ${company.zip_code}`}
                                </Typography>
                                <Typography variant="inherit">
                                    {`Phone : ${company.contact_number}`} | {`Email : ${company.email}`}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    <TableRow>
                        <TableCell align="center">
                            <Typography variant="h3">Expense Report</Typography>
                            <Typography variant="h4">
                                For the period ended
                                {` ${moment(reportData.start_date).format('DD-MMM, YYYY')} To ${moment(reportData.end_date).format(
                                    'DD-MMM, YYYY'
                                )}`}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>

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
                        <TableCell sx={{ width: '60%' }} colSpan={columnCount}>
                            <Typography variant="h4">Expenses</Typography>
                        </TableCell>
                        <TableCell sx={{ width: '20%' }} align="center">
                            <Typography variant="h4">({reportData.Subscriber_currency_symbol})</Typography>
                        </TableCell>
                        <TableCell sx={{ width: '20%' }} align="center">
                            <Typography variant="h4">({reportData.USD_symbol})</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expenses.map((i, cidx) => {
                        const subCategory = i.sub_categories;
                        return subCategory.map((iSub, sidx) => {
                            const company = iSub.company;
                            return company.map((iCom, cidx) => {
                                const expenses = iCom.expenses;
                                return expenses.map((iE, idx) => (
                                    <TableRow key={idx}>
                                        {/* {cidx === 0 && sidx === 0 && idx === 0 && <TableCell rowSpan={i.count}>{i.name}</TableCell>} */}
                                        {sidx === 0 && cidx === 0 && idx === 0 && (
                                            <TableCell rowSpan={i.count}>
                                                {i.name}
                                                <Typography variant="subtitle2" mt={1}>
                                                    <b>
                                                        {i.subscriber_amount} | {i.USD_amount}
                                                    </b>
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {cidx === 0 && idx === 0 && (
                                            <TableCell rowSpan={iSub.count}>
                                                {iSub.name}
                                                <Typography variant="subtitle2" mt={1}>
                                                    <b>
                                                        {iSub.subscriber_amount} | {iSub.USD_amount}
                                                    </b>
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {reportData.company_id === '0' && idx === 0 && (
                                            <TableCell rowSpan={iCom.count}>
                                                {iCom.name}
                                                <Typography variant="subtitle2" mt={1}>
                                                    <b>
                                                        {iCom.subscriber_amount} | {iCom.USD_amount}
                                                    </b>
                                                </Typography>
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            {iE.title}
                                            {/* {reportData.company_id === '0' && ` - ${iE.company_name}`} */}
                                        </TableCell>
                                        <TableCell align="right">{iE.subscriber_amount}</TableCell>
                                        <TableCell align="right">{iE.USD_amount}</TableCell>
                                    </TableRow>
                                ));
                            });
                        });
                    })}
                    <TableRow
                        sx={{
                            backgroundColor: 'lightgreen'
                        }}
                    >
                        <TableCell colSpan={columnCount}>
                            <Typography variant="subtitle1">Total Expense</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="subtitle1">{reportData.total_income_subscriber_currency}</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="subtitle1">{reportData.total_income_USD}</Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReportPage;
