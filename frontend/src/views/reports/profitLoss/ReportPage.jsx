import propTypes from 'prop-types';
import { Table, TableBody, TableCell, tableCellClasses, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';

const ReportPage = ({ reportData }) => {
    const company = reportData.companyDetails;
    const income = reportData.incomeDetails;
    const otherIncome = reportData.otherIncomeDetails;
    const expense = reportData.expenseDetails;
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
                            <Typography variant="h3">Profit & Loss Report</Typography>
                            <Typography variant="h4">
                                For the period ended
                                {` ${moment(reportData.start_date).format('YYYY-MMM-DD')} To ${moment(reportData.end_date).format(
                                    'YYYY-MMM-DD'
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
                        <TableCell sx={{ width: '60%' }}>
                            <Typography variant="h4">Income</Typography>
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
                    {income.map((i, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <b>{i.title}</b>
                                {reportData.company_id === '0' && ` - ${i.company_name}`}
                            </TableCell>
                            <TableCell align="right">{i.subscriber_amount}</TableCell>
                            <TableCell align="right">{i.usd_amount}</TableCell>
                        </TableRow>
                    ))}
                    {otherIncome.map((i, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <b>{i.title}</b>
                                {reportData.company_id === '0' && ` - ${i.company_name}`}
                            </TableCell>
                            <TableCell align="right">{i.subscriber_amount}</TableCell>
                            <TableCell align="right">{i.usd_amount}</TableCell>
                        </TableRow>
                    ))}
                    {/* Footer */}
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Total Income</Typography>
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

            {/* Expenses */}
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
                        <TableCell sx={{ width: '60%' }}>
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
                    {expense.map((i, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <b>{i.title}</b>
                                {reportData.company_id === '0' && ` - ${i.company_name}`}
                            </TableCell>
                            <TableCell align="right">{i.subscriber_amount}</TableCell>
                            <TableCell align="right">{i.usd_amount}</TableCell>
                        </TableRow>
                    ))}
                    {/* Footer */}
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Total Expense</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="subtitle1">{reportData.total_expense_subscriber_currency}</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="subtitle1">{reportData.total_expense_USD}</Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
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
                        backgroundColor: `${reportData.profit_loss === 'Profit' ? 'lightgreen' : 'lightsalmon'}`
                    }}
                >
                    <TableRow>
                        <TableCell sx={{ width: '60%' }}>
                            <Typography variant="h4">{reportData.profit_loss}</Typography>
                        </TableCell>
                        <TableCell sx={{ width: '20%' }} align="right">
                            <Typography variant="h4">{reportData.total_profit_loss_subscriber_currency}</Typography>
                        </TableCell>
                        <TableCell sx={{ width: '20%' }} align="right">
                            <Typography variant="h4">{reportData.total_profit_loss_amount_USD}</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    );
};

// ========== PropTypes ========== //

ReportPage.propTypes = {
    reportData: propTypes.object
};

export default ReportPage;
