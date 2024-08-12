import propTypes from 'prop-types';
// import { InvoiceTermListApi, deleteClientGroupApi } from 'apis/Settings';
import { useEffect, useState } from 'react';
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
import { DeleteOutline, Edit as EditIcon } from '@mui/icons-material';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import DeleteDialog from 'views/utilities/DeleteDialog';
import AddEditInvoiceTerm from './AddEditInvoiceTerm';
import CommonDialog from 'utils/CommonDialog';
import { deleteInvoiceTermApi, InvoiceTermListApi } from 'apis/Settings';
import useAuth from 'hooks/useAuth';
// import AddEditClientGroup from './AddEditClientGroup';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0,
    company_id: '0'
};
let recordsTotal = 0;
const InvoiceTermList = ({ search, callApi, filter, setCompanyList, companyList }) => {
    const { checkRestriction } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [groupData, setGroupData] = useState({});

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
        InvoiceTermListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setCompanyList(res.data.data.companies);
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
        params.company_id = filter.company_id;
        getData();
    }, [page, rowsPerPage, order, orderBy, search, callApi]);

    // ========== Edit ========== //
    const editData = (row) => {
        setOpenEdit((prevState) => !prevState);
        setGroupData(row);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    // ========== Delete ========== //
    const deleteData = (row) => {
        setOpenDelete(true);
        setGroupData(row);
    };

    const deleteHandler = () => {
        deleteInvoiceTermApi({ id: groupData.id })
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
                        {data.map((item, Index) => (
                            <TableRow key={Index}>
                                <TableCell align="left">{item.title}</TableCell>
                                <TableCell align="left">{item.company_name}</TableCell>
                                <TableCell align="left">{item.status}</TableCell>
                                <TableCell align="right">
                                    {checkRestriction('CAN_EDIT_TERMS') && (
                                        <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {checkRestriction('CAN_DELETE_TERMS') && (
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
                    title="Edit Invoice Term"
                    open={openEdit}
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editInvoiceTerm"
                >
                    <AddEditInvoiceTerm value={groupData} formID="editInvoiceTerm" onSubmit={submitHandler} companyList={companyList} />
                </CommonDialog>
            )}
            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Invoice Term"
                    name={groupData['title']}
                />
            )}
        </>
    );
};

InvoiceTermList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    filter: propTypes.object,
    setCompanyList: propTypes.func,
    companyList: propTypes.array
};

export default InvoiceTermList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="name" sx={{ width: '30%' }}>
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="company_name" sx={{ width: '40%' }}>
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        company
                    </TableSortLabel>
                </TableCell>
                <TableCell key="status" sx={{ width: '20%' }}>
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        Status
                    </TableSortLabel>
                </TableCell>
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
