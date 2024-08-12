import propTypes from 'prop-types';
import { Chip, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableRow, Typography } from '@mui/material';

const ViewUser = ({ data, roleIds }) => {
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
                            <Typography variant="subtitle1">Name</Typography>
                        </TableCell>
                        <TableCell>
                            {data.first_name} {data.last_name}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Email</Typography>
                        </TableCell>
                        <TableCell> {data.email}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Mobile number</Typography>
                        </TableCell>
                        <TableCell> {data.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Role</Typography>
                        </TableCell>
                        {roleIds && roleIds.map((i) => <TableCell key={i.id}>{i.name}</TableCell>)}
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Default company</Typography>
                        </TableCell>
                        <TableCell> {data.company_name ?? '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">Company</Typography>
                        </TableCell>
                        <TableCell>
                            {data.selectedCompany.length === 0
                                ? '-'
                                : data.selectedCompany.map((i, idx) => (
                                      <Chip key={idx} label={i.company_name} sx={{ marginRight: '5px' }} />
                                  ))}
                        </TableCell>
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

ViewUser.propTypes = {
    data: propTypes.object,
    roleIds: propTypes.array
};

export default ViewUser;
