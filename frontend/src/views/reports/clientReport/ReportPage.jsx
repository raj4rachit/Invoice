import { Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import propTypes from 'prop-types';
import moment from 'moment';
import { Fragment } from 'react';

const ReportPage = ({ reportData }) => {
    const columnCount = 3;
    const ClientData = reportData.clientInvoiceData;
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
                    {reportData.client_id === '0' ? (
                        <TableRow>
                            <TableCell align="center">
                                <Typography variant="h2">All Clients</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <TableRow>
                            <TableCell align="center">
                                {ClientData.map((iSub, idx) => (
                                    <Fragment key={idx}>
                                        <Typography key={idx} variant="h2">
                                            {iSub.client_company_name}
                                        </Typography>
                                        <Typography variant="inherit">{iSub.client_name}</Typography>
                                    </Fragment>
                                ))}
                            </TableCell>
                        </TableRow>
                    )}
                    <TableRow>
                        <TableCell align="center">
                            <Typography variant="h3">Client Report</Typography>
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
                            <Typography variant="h4">Clients</Typography>
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
                    {ClientData.map((iSub) => {
                        const companies = iSub.companies;
                        return companies.map((iCom, cidx) => {
                            const invoices = iCom.invoices;
                            return invoices.map((iE, idx) => (
                                <TableRow key={idx}>
                                    {cidx === 0 && idx === 0 && (
                                        <TableCell rowSpan={iSub.count}>
                                            {iSub.client_company_name + ' - ' + iSub.client_name}{' '}
                                            <Typography variant="subtitle2" mt={1}>
                                                <b>
                                                    {iSub.subscriber_amount} | {iSub.usd_amount}
                                                </b>
                                            </Typography>
                                        </TableCell>
                                    )}
                                    {idx === 0 && (
                                        <TableCell rowSpan={iCom.count}>
                                            {iCom.company_name}
                                            <Typography variant="subtitle2" mt={1}>
                                                <b>
                                                    {iCom.subscriber_amount} | {iCom.usd_amount}
                                                </b>
                                            </Typography>
                                        </TableCell>
                                    )}
                                    <TableCell>{iE.invoice_no}</TableCell>
                                    <TableCell align="right">{iE.subscriber_currency_total_amount}</TableCell>
                                    <TableCell align="right">{iE.USD_currency_total_amount}</TableCell>
                                </TableRow>
                            ));
                        });
                    })}
                    <TableRow
                        sx={{
                            backgroundColor: 'lightgreen'
                        }}
                    >
                        <TableCell colSpan={columnCount}>
                            <Typography variant="subtitle1">Total</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="subtitle1">{reportData.total_subscriber_currency}</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="subtitle1">{reportData.total_USD}</Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
ReportPage.propTypes = {
    reportData: propTypes.object
};

export default ReportPage;
