import { Chip, Divider, Grid, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableRow, Typography } from '@mui/material';
import propTypes from 'prop-types';

const ViewCompany = ({ data }) => {
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
                            <Typography variant="subtitle1">Trading name</Typography>
                        </TableCell>
                        <TableCell> {data.trading_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Email</Typography>
                        </TableCell>
                        <TableCell> {data.email}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Phone</Typography>
                        </TableCell>
                        <TableCell> {data.contact_number}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Website</Typography>
                        </TableCell>
                        <TableCell> {data.website}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Registration no</Typography>
                        </TableCell>
                        <TableCell> {data.registration_no}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Enroll date</Typography>
                        </TableCell>
                        <TableCell>{data.enroll_date}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Tax no.</Typography>
                        </TableCell>
                        <TableCell> {data.tax_no}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">GST/VAT no.</Typography>
                        </TableCell>
                        <TableCell> {data.gst_vat_no}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Currency</Typography>
                        </TableCell>
                        <TableCell> {data.currency_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Address</Typography>
                        </TableCell>
                        <TableCell>
                            {data.address_1 + `, `} {data.address_2 && data.address_2 + `, `}
                            {data.city && data.city} {data.zip_code ? `- ` : `, `} {data.zip_code && data.zip_code + `, `}
                            {data.state && data.state + `, `}
                            {data.country_name && data.country_name}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Client</Typography>
                        </TableCell>
                        <TableCell>
                            {data.selectedClient.length === 0
                                ? '-'
                                : data.selectedClient.map((i, idx) => <Chip key={idx} label={i.client_name} sx={{ marginRight: '5px' }} />)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Status</Typography>
                        </TableCell>
                        <TableCell>
                            {data.status === 'Active' ? (
                                <Chip label={data.status} color="primary" variant="outlined" />
                            ) : (
                                <Chip label={data.status} color="error" variant="outlined" />
                            )}
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell colSpan={2}>
                            <Divider>
                                <Chip label="Company Setting" />
                            </Divider>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Company code</Typography>
                        </TableCell>
                        <TableCell> {data.companySetting ? data.companySetting.company_code : '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Invoice prefix date format</Typography>
                        </TableCell>
                        <TableCell>{data.companySetting ? data.companySetting.invoice_prefix_date_format : '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Company Logo</Typography>
                        </TableCell>
                        <TableCell>
                            {data.companySetting ? <img src={data.companySetting.company_logo} width={150} alt="Loading" /> : '-'}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

ViewCompany.propTypes = {
    data: propTypes.object
};

export default ViewCompany;
