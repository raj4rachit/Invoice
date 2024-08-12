import propTypes from 'prop-types';

import { DeleteOutline, Edit as EditIcon } from '@mui/icons-material';
import {
    Chip,
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
import { deletePermissionGroupApi, permissionGroupListApi, viewPermissionGroupApi } from 'apis/Permission';
import { useEffect, useState } from 'react';
import CommonDialog from 'utils/CommonDialog';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import DeleteDialog from 'views/utilities/DeleteDialog';
import AddEditPermissionGroup from './AddEditPermissionGroup';
import useAuth from 'hooks/useAuth';

// const columns = [
//     { id: 'name', label: 'Name', align: 'left', width: '20%' },
//     { id: 'permissions', label: 'Permissions', align: 'left', width: '70%' },
//     { id: 'action', label: 'Action', align: 'center', width: '10%' }
// ];

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0
};
let recordsTotal = 0;
const PermissionGroupList = ({ search, callApi, setPermissionData, permissionData }) => {
    const { checkRestriction, recall } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [groupData, setGroupData] = useState({});

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
        viewPermissionGroupApi({ type: 'edit', id: row.id })
            .then((res) => {
                if (res.data && res.data.status === 1) {
                    setOpenEdit((prevState) => !prevState);
                    setGroupData(res.data.data.groupData);
                    setPermissionData(res.data.data.allPermissionList);
                } else {
                    apiValidationSnackBar(res);
                }
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    const deleteData = (row) => {
        setOpenDelete(true);
        setGroupData(row);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    const deleteHandler = () => {
        deletePermissionGroupApi({ id: groupData.id })
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

    const getData = () => {
        permissionGroupListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
                // setPermissionData(res.data.data.permissionList);
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
                        {data.map((item, index) => (
                            <TableRow hover role="checkbox" key={index}>
                                <TableCell>{item.name}</TableCell>
                                {/* <TableCell>
                                    {item.permissionList.map((p, i) => (
                                        <Chip key={i} label={p.name} sx={{ margin: '5px 5px 0 0' }} />
                                    ))}
                                </TableCell> */}

                                <TableCell>
                                    {item.permissions.map((val, i) => (
                                        <Chip key={i} label={val} sx={{ margin: '5px 5px 0 0' }} />
                                    ))}
                                </TableCell>
                                <TableCell align={'right'}>
                                    {checkRestriction('CAN_EDIT_PERMISSION_GROUP') && (
                                        <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {checkRestriction('CAN_DELETE_PERMISSION_GROUP') && (
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
                <CommonDialog
                    open={openEdit}
                    title="Edit Permission Group"
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editPermissionGroup"
                >
                    <AddEditPermissionGroup
                        value={groupData}
                        formId="editPermissionGroup"
                        onSubmit={submitHandler}
                        permissions={permissionData}
                    />
                </CommonDialog>
            )}

            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Permission Group"
                    name={groupData['name']}
                />
            )}
        </>
    );
};

PermissionGroupList.propTypes = {
    search: propTypes.string.isRequired,
    callApi: propTypes.bool,
    setPermissionData: propTypes.func,
    permissionData: propTypes.array
};

export default PermissionGroupList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };
    return (
        <TableHead>
            <TableRow>
                <TableCell key="name" sx={{ width: '20%' }}>
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Name
                    </TableSortLabel>
                </TableCell>

                <TableCell sx={{ width: '70%' }}>Permissions</TableCell>
                <TableCell align="right" sx={{ width: '10%' }}>
                    Action
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    order: propTypes.string,
    orderBy: propTypes.string,
    onRequestSort: propTypes.func
};
