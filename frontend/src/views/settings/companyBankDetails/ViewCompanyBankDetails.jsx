import { Chip, Divider, Grid, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableRow, Typography } from '@mui/material';
import propTypes from 'prop-types';

const ViewCompanyBankDetails = ({ data }) => {
    return (
        <TableContainer>
            <Table
                size="small"
                sx={{
                    [`& .${tableCellClasses.root}`]: {
                        borderBottom: 'none'
                    }
                }}
            >
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Company name</Typography>
                        </TableCell>
                        <TableCell> {data.company_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Bank Detail Name</Typography>
                        </TableCell>
                        <TableCell> {data.bank_detail_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Bank Name</Typography>
                        </TableCell>
                        <TableCell> {data.bank_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Account Name</Typography>
                        </TableCell>
                        <TableCell> {data.account_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Account Number</Typography>
                        </TableCell>
                        <TableCell> {data.account_number}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Extra Filed</Typography>
                        </TableCell>
                        <TableCell>
                            {data.extraFiled.length === 0
                                ? '-'
                                : data.extraFiled.map((i, idx) => (
                                      <Chip key={idx} label={`${i.extraFiled} - ${i.extraValue}`} sx={{ marginRight: '5px' }} />
                                  ))}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

ViewCompanyBankDetails.propTypes = {
    data: propTypes.object
};

export default ViewCompanyBankDetails;
