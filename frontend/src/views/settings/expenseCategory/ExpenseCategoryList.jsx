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
import { useState } from 'react';
import CenterDialog from 'views/utilities/CenterDialog';
import DeleteDialog from 'views/utilities/DeleteDialog';
import AddEditExpenseCategory from './AddEditExpenseCategory';
import { useEffect } from 'react';
import { DeleteExpenseCategoryApi, ExpenseCategoryListApi } from 'apis/Settings';
import useAuth from 'hooks/useAuth';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0
};
let recordsTotal = 0;

export const ExpenseCategoryList = ({ search, callApi, setInitData, initData }) => {
    const { checkRestriction } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [categoryData, setCategoryData] = useState({});

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

    const getData = () => {
        ExpenseCategoryListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
                setInitData({ parent_category: res.data.data.parent_category });
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

    // ========== Edit ========== //
    const editData = (row) => {
        setOpenEdit((prevState) => !prevState);
        setCategoryData(row);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    // ========== Delete ========== //
    const deleteData = (row) => {
        setOpenDelete(true);
        setCategoryData(row);
    };

    const deleteHandler = () => {
        DeleteExpenseCategoryApi({ id: categoryData.id })
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

    return (
        <>
            <TableContainer>
                <Table>
                    <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>
                        {data &&
                            data.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.parent_name}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell align="right">
                                        {checkRestriction('CAN_EDIT_EXPENSE_CATEGORY') && (
                                            <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        {checkRestriction('CAN_DELETE_EXPENSE_CATEGORY') && (
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
                    title="Edit Expense Category"
                    open={openEdit}
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editExpenseCategory"
                >
                    <AddEditExpenseCategory
                        value={categoryData}
                        formID="editExpenseCategory"
                        onSubmit={submitHandler}
                        initData={initData}
                    />
                </CenterDialog>
            )}
            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Expense Category"
                    name={categoryData['name']}
                />
            )}
        </>
    );
};

ExpenseCategoryList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    setInitData: propTypes.func,
    initData: propTypes.object
};

export default ExpenseCategoryList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="title">
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="parent_name">
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Parent Category
                    </TableSortLabel>
                </TableCell>
                <TableCell key="status">
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        Status
                    </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ width: '15%' }}>
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
