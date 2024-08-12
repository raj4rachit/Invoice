import propTypes from 'prop-types';
import { DeleteOutline, Edit as EditIcon, LaunchOutlined } from '@mui/icons-material';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import DeleteDialog from 'views/utilities/DeleteDialog';
import CommonDialog from 'utils/CommonDialog';
import AddEditClient from './AddEditClient';
import { ClientListApi, deleteClientApi } from 'apis/Client';
import CustomTooltip from 'views/utilities/CustomTooltip';
import ViewClient from './ViewClient';
import useAuth from 'hooks/useAuth';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0,
    from_date: null,
    to_date: null,
    group_id: '0',
    source_by: '0',
    source_from: '0'
};

let recordsTotal = 0;

const ClientList = ({ search, callApi, initData, filter }) => {
    const { checkRestriction, recall } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [clientData, setClientData] = useState({});

    // ========== Delete ========== //
    const deleteData = (row) => {
        setOpenDelete(true);
        setClientData(row);
    };

    const deleteHandler = () => {
        deleteClientApi({ id: clientData.id })
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

    // ========== Edit ========== //
    const editData = (row) => {
        setOpenEdit((prevState) => !prevState);
        setClientData(row);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    // ========== view ========== //
    const viewData = (itemData) => {
        setClientData(itemData);
        setOpenView((prevState) => !prevState);
    };

    // ========== Data Supplier ========== //
    const getData = () => {
        ClientListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    // ========== Table Pagination ========== //
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

    useEffect(() => {
        params.search = search;
        params.displayLength = rowsPerPage;
        params.displayStart = rowsPerPage * page;
        params.orderDir = order?.toUpperCase() ?? params.orderDir;
        params.orderColumn = Number(orderBy);
        params.from_date = filter.filterFromDate ?? params.filterFromDate;
        params.to_date = filter.filterToDate ?? filter.filterFromDate;
        params.group_id = filter.filterGroupID ?? params.group_id;
        params.source_by = filter.filterSourceBy ?? params.source_by;
        params.source_from = filter.filterSourceFrom ?? params.source_from;
        getData();
    }, [page, rowsPerPage, order, orderBy, search, callApi, recall, filter]);

    return (
        <>
            <TableContainer>
                <Table>
                    <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>
                        {data.map((item, Index) => (
                            <TableRow key={Index}>
                                <TableCell align="left">
                                    {item.company_name}
                                    <CustomTooltip
                                        title={`View Client`}
                                        Icon={
                                            <IconButton color="inherit" sx={{ p: '0 5px' }} onClick={() => viewData(item)}>
                                                <LaunchOutlined sx={{ p: 0, width: 30 }} color="inherit" fontSize="small" />
                                            </IconButton>
                                        }
                                    />
                                    <Typography variant="subtitle2">{item.client_name}</Typography>
                                </TableCell>
                                <TableCell align="left">{item.enroll_date}</TableCell>
                                <TableCell align="left">{item.email}</TableCell>
                                <TableCell align="left">{item.phone}</TableCell>
                                <TableCell align="left">{item.group_name}</TableCell>
                                <TableCell align="left">{item.source_by_name}</TableCell>
                                <TableCell align="left">{item.source_from_name}</TableCell>
                                <TableCell align="left">{item.country_name}</TableCell>
                                <TableCell align="left">{item.status}</TableCell>
                                <TableCell align="right">
                                    {checkRestriction('CAN_EDIT_CLIENT') && (
                                        <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {checkRestriction('CAN_DELETE_CLIENT') && (
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
                    title="Edit Client"
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editClient"
                    sx={{
                        '& .MuiDialog-container ': {
                            justifyContent: 'flex-end',
                            '& .MuiPaper-root': {
                                m: 0,
                                p: 0,
                                borderRadius: '0px',
                                minWidth: { sm: '40%', xs: '100%' },
                                minHeight: '100%'
                            }
                        }
                    }}
                >
                    <AddEditClient value={clientData} formId="editClient" onSubmit={submitHandler} initData={initData} />
                </CommonDialog>
            )}
            {openView && (
                <CommonDialog
                    open={openView}
                    title={clientData['client_name']}
                    onClose={() => setOpenView((prevState) => !prevState)}
                    saveButton={true}
                >
                    <ViewClient data={clientData} />
                </CommonDialog>
            )}

            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Client"
                    name={clientData['client_name']}
                />
            )}
        </>
    );
};

// ========== PropTypes ========== //

ClientList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    initData: propTypes.object,
    filter: propTypes.object
};

export default ClientList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="name" sx={{ width: '15%' }}>
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="enroll_date" sx={{ width: '10%' }}>
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Enroll Date
                    </TableSortLabel>
                </TableCell>
                <TableCell key="email" sx={{ width: '10%' }}>
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        Email
                    </TableSortLabel>
                </TableCell>
                <TableCell key="phone" sx={{ width: '10%' }}>
                    <TableSortLabel active={orderBy === '3'} direction={orderBy === '3' ? order : 'asc'} onClick={createSortHandler('3')}>
                        Phone
                    </TableSortLabel>
                </TableCell>
                <TableCell key="group" sx={{ width: '10%' }}>
                    <TableSortLabel active={orderBy === '4'} direction={orderBy === '4' ? order : 'asc'} onClick={createSortHandler('4')}>
                        Group
                    </TableSortLabel>
                </TableCell>
                <TableCell key="source_by" sx={{ width: '10%' }}>
                    <TableSortLabel active={orderBy === '5'} direction={orderBy === '5' ? order : 'asc'} onClick={createSortHandler('5')}>
                        Source By
                    </TableSortLabel>
                </TableCell>
                <TableCell key="source_from" sx={{ width: '10%' }}>
                    <TableSortLabel active={orderBy === '6'} direction={orderBy === '6' ? order : 'asc'} onClick={createSortHandler('6')}>
                        Source From
                    </TableSortLabel>
                </TableCell>
                <TableCell key="country" sx={{ width: '10%' }}>
                    <TableSortLabel active={orderBy === '7'} direction={orderBy === '7' ? order : 'asc'} onClick={createSortHandler('7')}>
                        Country
                    </TableSortLabel>
                </TableCell>
                <TableCell key="status" sx={{ width: '7%' }}>
                    <TableSortLabel active={orderBy === '8'} direction={orderBy === '8' ? order : 'asc'} onClick={createSortHandler('8')}>
                        Status
                    </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ width: '8%' }}>
                    Action
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

// ========== PropTypes ========== //

EnhancedTableHead.propTypes = {
    order: propTypes.string,
    orderBy: propTypes.string,
    onRequestSort: propTypes.func
};
