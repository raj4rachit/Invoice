import { Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';

const ReportPage = ({ reportData }) => {
    const company = reportData.companyDetails;
    const income = reportData.incomeDetails;

    // const otherIncome = reportData.otherIncomesDetails;
    // console.log('reportData >>>', reportData);
    const columnCount = reportData.company_id === '0' ? 4 : 3;

    const OtherIncomeDisplay = (OtherData) =>
        OtherData.map((i, cidx) => {
            const subCategory = i.sub_categories;
            return subCategory.map((iSub, sidx) => {
                const company = iSub.company;
                return company.map((iCom, cidx) => {
                    const oIncomes = iCom.incomes;
                    return oIncomes.map((iE, idx) => (
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
        });

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
                            <Typography variant="h3">Income Report</Typography>
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
                        <TableCell sx={{ width: '60%' }} colSpan={columnCount}>
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
                    {
                        // income[1].length > 0 ? (
                        //     <>
                        //         <TableRow sx={{ background: 'wheat' }}>
                        //             <TableCell colSpan={columnCount}>
                        //                 {income[0].title}
                        //                 {` - ${income[0].company_name}`}
                        //             </TableCell>
                        //             <TableCell align="right">{reportData.total_income_subscriber_currency}</TableCell>
                        //             <TableCell align="right">{reportData.total_income_USD}</TableCell>
                        //         </TableRow>
                        //         {income[1].map((i, idx) => (
                        //             <TableRow key={idx}>
                        //                 <TableCell colSpan={columnCount}>{i.name}</TableCell>
                        //                 {i.income.map((val, ids) => (
                        //                     <React.Fragment key={ids}>
                        //                         <TableCell align="right">{val.subscriber_currency_total_amount}</TableCell>
                        //                         <TableCell align="right">{val.USD_currency_total_amount}</TableCell>
                        //                     </React.Fragment>
                        //                 ))}
                        //             </TableRow>
                        //         ))}
                        //     </>
                        // ) : (
                        income.length > 0 &&
                            income.map((i, idx) => (
                                <React.Fragment key={idx}>
                                    <TableRow sx={{ background: 'wheat' }}>
                                        <TableCell colSpan={columnCount}>
                                            {i.title}
                                            {` - ${i.company_name}`}
                                        </TableCell>
                                        <TableCell align="right">{i.subscriber_amount}</TableCell>
                                        <TableCell align="right">{i.usd_amount}</TableCell>
                                    </TableRow>
                                    {/* {i.clients.map((val, ids) => (
                                    <TableRow key={ids}>
                                        <TableCell colSpan={columnCount}>{val.name}</TableCell>
                                        <TableCell align="right">{val.income[0].subscriber_currency_total_amount}</TableCell>
                                        <TableCell align="right">{val.income[0].USD_currency_total_amount}</TableCell>
                                    </TableRow>
                                ))} */}
                                    {i.clients?.map((val, ids) => (
                                        <TableRow key={ids}>
                                            <TableCell colSpan={columnCount}>{val.name}</TableCell>
                                            <TableCell align="right">{val.income.subscriber_currency_total_amount}</TableCell>
                                            <TableCell align="right">{val.income.USD_currency_total_amount}</TableCell>
                                        </TableRow>
                                    ))}
                                    {i.otherIncomes.length > 0 && OtherIncomeDisplay(i.otherIncomes)}
                                </React.Fragment>
                            ))
                        // )
                    }
                    {/* {income.map((i, idx) => (
                        <TableRow key={idx}>
                            <TableCell colSpan={columnCount}>
                                {i.title}
                                {reportData.company_id === '0' && ` - ${i.company_name}`}
                            </TableCell>
                            <TableCell align="right">{i.subscriber_amount}</TableCell>
                            <TableCell align="right">{i.usd_amount}</TableCell>
                        </TableRow>
                    ))} */}
                    {/* {OtherIncomeDisplay(otherIncome)} */}

                    {/* Footer */}

                    <TableRow
                        sx={{
                            backgroundColor: 'lightgreen'
                        }}
                    >
                        <TableCell colSpan={columnCount}>
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
        </TableContainer>
    );
};

export default ReportPage;
