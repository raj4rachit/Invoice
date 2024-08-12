import propTypes from 'prop-types';

import { DeleteOutline, Edit as EditIcon } from '@mui/icons-material';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel
} from '@mui/material';
import { deleteRoleApi, roleListApi } from 'apis/Role';
import { useEffect, useState } from 'react';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import DeleteDialog from 'views/utilities/DeleteDialog';
import AddEditRole from './AddEditRole';
import useAuth from 'hooks/useAuth';
import CenterDialog from 'views/utilities/CenterDialog';

// const columns = [
//     { id: 'name', label: 'Name', align: 'left', width: '30%' },
//     { id: 'permission_group', label: 'Permission Group', align: 'left', width: '30%' },
//     { id: 'status', label: 'Status', align: 'left', width: '30%' },
//     { id: 'action', label: 'Action', align: 'right', width: '10%' }
// ];

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0
};
let recordsTotal = 0;
const RoleList = ({ search, callApi, setPermissionGroupData, permissionGroupData }) => {
    const { checkRestriction, recall } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [roleData, setRoleData] = useState({});

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const editData = (row) => {
        setOpenEdit((prevState) => !prevState);
        setRoleData(row);
    };

    const deleteData = (row) => {
        setOpenDelete(true);
        setRoleData(row);
    };

    const getData = () => {
        roleListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
                setPermissionGroupData(res.data.data.permissionGroups);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    const deleteHandler = () => {
        deleteRoleApi({ id: roleData.id })
            .then((res) => {
                if (res.data && res.data.status === 1) {
                    setPage(0);
                    getData();
                    setOpenDelete(false);
                    apiSuccessSnackBar(res);
                } else {
                    apiValidationSnackBar(res);
                }
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    useEffect(() => {
        params.search = search;
        params.displayLength = rowsPerPage;
        params.displayStart = rowsPerPage * page;
        params.orderDir = order?.toUpperCase() ?? params.orderDir;
        params.orderColumn = Number(orderBy);
        getData();
    }, [page, rowsPerPage, order, orderBy, search, callApi, recall]);

    return (
        <>
            <TableContainer>
                <Table>
                    <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>
                        {/* {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => ( */}
                        {data.map((item, index) => (
                            <TableRow hover role="checkbox" key={index}>
                                <TableCell align="left">{item.name}</TableCell>
                                <TableCell align="left">{item.group_name}</TableCell>
                                <TableCell align="left">{item.status}</TableCell>
                                <TableCell align="right">
                                    {checkRestriction('CAN_EDIT_ROLE') && (
                                        <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {checkRestriction('CAN_DELETE_ROLE') && item.can_delete === 'Yes' && (
                                        <IconButton color="error" component="label" onClick={() => deleteData(item)}>
                                            <DeleteOutline fontSize="small" />
                                        </IconButton>
                                    )}
                                </TableCell>
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

            {openEdit && (
                <CenterDialog open={openEdit} title="Edit Role" onClose={() => setOpenEdit((prevState) => !prevState)} id="editRole">
                    <AddEditRole RoleValue={roleData} formId="editRole" onSubmit={submitHandler} permissionGroup={permissionGroupData} />
                </CenterDialog>
            )}

            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Role"
                    name={roleData['name']}
                />
            )}
        </>
    );
};

RoleList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    setPermissionGroupData: propTypes.func,
    permissionGroupData: propTypes.array
};

export default RoleList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const { checkRestriction } = useAuth();
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="name">
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="permissionGroup">
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Permission group
                    </TableSortLabel>
                </TableCell>
                <TableCell key="status">
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        Status
                    </TableSortLabel>
                </TableCell>
                {checkRestriction('CAN_EDIT_ROLE') && checkRestriction('CAN_DELETE_ROLE') && <TableCell align="right">Action</TableCell>}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    order: propTypes.string,
    orderBy: propTypes.string,
    onRequestSort: propTypes.func
};
