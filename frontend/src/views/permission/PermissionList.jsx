import propTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { permissionListApi } from 'apis/Permission';
import { apiErrorSnackBar } from 'utils/SnackBar';

const columns = [
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'slug', label: 'Slug', minWidth: 200 },
    { id: 'url', label: 'Url', minWidth: 200 }
];

const params = {
    search: '',
    orderColumn: 1,
    displayLength: 10,
    displayStart: 0
};

let recordsTotal = 0;
const PermissionList = ({ search }) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getData = () => {
        permissionListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    useEffect(() => {
        params.search = search;
        params.orderColumn = 0;
        params.displayLength = rowsPerPage;
        params.displayStart = rowsPerPage * page;
        getData();
    }, [search, page, rowsPerPage]);
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow hover role="checkbox" key={index}>
                                {columns.map((column) => {
                                    const value = item[column.id];
                                    return (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={Number(recordsTotal)}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

PermissionList.propTypes = {
    search: propTypes.string.isRequired
};

export default PermissionList;
