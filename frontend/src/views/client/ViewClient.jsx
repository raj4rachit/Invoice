import { Chip, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableRow, Typography } from '@mui/material';
import propTypes from 'prop-types';

const ViewClient = ({ data }) => {
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
                            <Typography variant="subtitle1">Client name</Typography>
                        </TableCell>
                        <TableCell> {data.client_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Company name</Typography>
                        </TableCell>
                        <TableCell> {data.company_name}</TableCell>
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
                        <TableCell> {data.phone}</TableCell>
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
                            <Typography variant="subtitle1">Group</Typography>
                        </TableCell>
                        <TableCell> {data.group_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Source by</Typography>
                        </TableCell>
                        <TableCell> {data.source_by_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Source from</Typography>
                        </TableCell>
                        <TableCell> {data.source_from_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Is Bifurcated ?</Typography>
                        </TableCell>
                        <TableCell> {data?.is_bifurcated ?? 'No'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Created By</Typography>
                        </TableCell>
                        <TableCell> {data.created_by}</TableCell>
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
                </TableBody>
            </Table>
        </TableContainer>
    );
};

ViewClient.propTypes = {
    data: propTypes.object
};

export default ViewClient;
