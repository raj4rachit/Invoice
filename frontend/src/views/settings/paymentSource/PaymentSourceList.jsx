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
import { useEffect, useState } from 'react';
import CenterDialog from 'views/utilities/CenterDialog';
import { deletePaymentSourceApi, PaymentSourceListApi } from 'apis/Settings';
import AddEditPaymentSource from './AddEditPaymentSource';
import DeleteDialog from 'views/utilities/DeleteDialog';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import useAuth from 'hooks/useAuth';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0
};
let recordsTotal = 0;
const PaymentSourceList = ({ search, callApi }) => {
    const { checkRestriction } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [PaymentSourceData, setPaymentSourceData] = useState({});

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

    // ========== Delete ========== //
    const deleteData = (row) => {
        setOpenDelete(true);
        setPaymentSourceData(row);
    };

    const deleteHandler = () => {
        deletePaymentSourceApi({ id: PaymentSourceData.id })
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

    // Edit
    const editData = (row) => {
        setOpenEdit((prevState) => !prevState);
        setPaymentSourceData(row);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    const getData = () => {
        PaymentSourceListApi(params)
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
        params.displayLength = rowsPerPage;
        params.displayStart = rowsPerPage * page;
        params.orderDir = order?.toUpperCase() ?? params.orderDir;
        params.orderColumn = Number(orderBy);
        getData();
    }, [page, rowsPerPage, order, orderBy, search, callApi]);

    return (
        <>
            <TableContainer>
                <Table>
                    <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>
                        {data.map((item, Index) => (
                            <TableRow key={Index}>
                                <TableCell align="left">{item.payment_source_name}</TableCell>
                                <TableCell align="left">{item.status}</TableCell>
                                <TableCell align="right">
                                    {checkRestriction('CAN_EDIT_PAYMENT_SOURCE') && (
                                        <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {checkRestriction('CAN_DELETE_PAYMENT_SOURCE') && (
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
                <CenterDialog
                    title="Edit Payment Source"
                    open={openEdit}
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editPaymentSource"
                >
                    <AddEditPaymentSource value={PaymentSourceData} formID="editPaymentSource" onSubmit={submitHandler} />
                </CenterDialog>
            )}
            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Payment Source"
                    name={PaymentSourceData['payment_source_name']}
                />
            )}
        </>
    );
};

PaymentSourceList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool
};

export default PaymentSourceList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="payment_source_name" sx={{ width: '50%' }}>
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Payment source name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="status" sx={{ width: '30%' }}>
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Status
                    </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ width: '20%' }}>
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
