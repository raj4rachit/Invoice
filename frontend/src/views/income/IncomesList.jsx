import propTypes from 'prop-types';
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
import { useEffect } from 'react';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import { DeleteOutline, Edit as EditIcon } from '@mui/icons-material';
import CenterDialog from 'views/utilities/CenterDialog';
import DeleteDialog from 'views/utilities/DeleteDialog';
import useAuth from 'hooks/useAuth';
import AddEditIncomes from './AddEditIncomes';
import { IncomesDeleteApi, IncomesListApi } from 'apis/Incomes';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0,
    company_id: '0',
    category_id: '0'
};

let recordsTotal = 0;
const IncomesList = ({ search, callApi, filter, setInitData, initData }) => {
    const { checkRestriction } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [incomesData, setIncomesData] = useState({});

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

    // ========== Data Supplier ========== //
    const getData = () => {
        IncomesListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.incomeList.totalCount;
                setData(res.data.data.incomeList.data);
                setInitData(res.data.data.initData);
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
        params.company_id = filter.filterCompanyID;
        params.category_id = filter.filterCategoryID;

        getData();
    }, [page, rowsPerPage, order, orderBy, search, callApi, filter]);

    // ========== Edit ========== //
    const editData = (row) => {
        setOpenEdit((prevState) => !prevState);
        setIncomesData(row);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    // ========== Delete ========== //
    const deleteData = (row) => {
        setOpenDelete(true);
        setIncomesData(row);
    };

    const deleteHandler = () => {
        IncomesDeleteApi({ id: incomesData.id })
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
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>{item.category_name}</TableCell>
                                    <TableCell>{item.subcategory_name}</TableCell>
                                    <TableCell>{item.company_name}</TableCell>
                                    <TableCell align="right">{item.formate_amount}</TableCell>
                                    <TableCell align="right">
                                        {checkRestriction('CAN_EDIT_INCOMES') && (
                                            <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        {checkRestriction('CAN_DELETE_INCOMES') && (
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
                <CenterDialog open={openEdit} title="Edit Incomes" onClose={() => setOpenEdit((prevState) => !prevState)} id="editIncomes">
                    <AddEditIncomes value={incomesData} formID="editIncomes" onSubmit={submitHandler} initData={initData} />
                </CenterDialog>
            )}

            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Incomes"
                    name={incomesData['title']}
                />
            )}
        </>
    );
};

// ========== PropTypes ========== //

IncomesList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    filter: propTypes.object,
    setInitData: propTypes.func,
    initData: propTypes.object
};

export default IncomesList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="title" sx={{ width: '20%' }}>
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Title
                    </TableSortLabel>
                </TableCell>
                <TableCell key="date" sx={{ width: '10%' }}>
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Date
                    </TableSortLabel>
                </TableCell>
                <TableCell key="category" sx={{ width: '15%' }}>
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        Category
                    </TableSortLabel>
                </TableCell>
                <TableCell key="subcategory" sx={{ width: '15%' }}>
                    <TableSortLabel active={orderBy === '3'} direction={orderBy === '3' ? order : 'asc'} onClick={createSortHandler('3')}>
                        Subcategory
                    </TableSortLabel>
                </TableCell>
                <TableCell key="company" sx={{ width: '15%' }}>
                    <TableSortLabel active={orderBy === '4'} direction={orderBy === '4' ? order : 'asc'} onClick={createSortHandler('4')}>
                        Company
                    </TableSortLabel>
                </TableCell>
                <TableCell key="amount" align="right" sx={{ width: '15%' }}>
                    <TableSortLabel active={orderBy === '5'} direction={orderBy === '5' ? order : 'asc'} onClick={createSortHandler('5')}>
                        Amount
                    </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ width: '10%' }}>
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
