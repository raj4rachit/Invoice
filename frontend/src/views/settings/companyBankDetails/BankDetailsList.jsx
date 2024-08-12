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
    TableSortLabel
} from '@mui/material';
import { CompanyBankListApi, DeleteCompanyBankApi } from 'apis/Settings';
import useAuth from 'hooks/useAuth';
import propTypes from 'prop-types';
import { useEffect } from 'react';
import { useState } from 'react';
import CommonDialog from 'utils/CommonDialog';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import CustomTooltip from 'views/utilities/CustomTooltip';
import DeleteDialog from 'views/utilities/DeleteDialog';
import AddEditBankDetails from './AddEditBankDetails';
import ViewCompanyBankDetails from './ViewCompanyBankDetails';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0,
    company_id: '0'
};
let recordsTotal = 0;
const BankDetailsList = ({ search, callApi, filter, setInitData, initData }) => {
    const { checkRestriction } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [bankData, setBankData] = useState({});
    const [openView, setOpenView] = useState(false);

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
        CompanyBankListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
                setInitData(res.data.data.companyList);
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

        getData();
    }, [page, rowsPerPage, order, orderBy, search, callApi, filter]);

    // ========== Edit ========== //
    const editData = (row) => {
        setOpenEdit((prevState) => !prevState);
        setBankData(row);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    // ========== Delete ========== //
    const deleteData = (row) => {
        setOpenDelete(true);
        setBankData(row);
    };

    const deleteHandler = () => {
        DeleteCompanyBankApi({ id: bankData.id })
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

    const viewData = (itemData) => {
        setBankData(itemData);
        setOpenView((prevState) => !prevState);
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
                                    <TableCell align="left">
                                        {item.bank_detail_name}
                                        <CustomTooltip
                                            title={`View Company Bank Details`}
                                            Icon={
                                                <IconButton color="inherit" sx={{ p: '0 5px' }} onClick={() => viewData(item)}>
                                                    <LaunchOutlined sx={{ p: 0, width: 30 }} color="inherit" fontSize="small" />
                                                </IconButton>
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{item.bank_name}</TableCell>
                                    <TableCell>{item.account_name}</TableCell>
                                    <TableCell>{item.account_number}</TableCell>
                                    <TableCell align="right">
                                        {checkRestriction('CAN_EDIT_COMPANY_BANK_DETAILS') && (
                                            <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        {checkRestriction('CAN_DELETE_COMPANY_BANK_DETAILS') && (
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

            {openView && (
                <CommonDialog
                    open={openView}
                    title={bankData['bank_detail_name']}
                    onClose={() => setOpenView((prevState) => !prevState)}
                    saveButton={true}
                >
                    <ViewCompanyBankDetails data={bankData} />
                </CommonDialog>
            )}

            {openEdit && (
                <CommonDialog
                    open={openEdit}
                    title="Edit Company Bank Detail"
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editBankDetails"
                    sx={{
                        '& .MuiDialog-container ': {
                            justifyContent: 'flex-end',
                            '& .MuiPaper-root': {
                                m: 0,
                                p: 0,
                                borderRadius: '0px',
                                minWidth: { sm: '45%', xs: '100%' },
                                minHeight: '100%'
                            }
                        }
                    }}
                >
                    <AddEditBankDetails formID="editBankDetails" value={bankData} onSubmit={submitHandler} initData={initData} />
                </CommonDialog>
            )}

            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Company Bank Details"
                    name={bankData['bank_detail_name']}
                />
            )}
        </>
    );
};

// ========== PropTypes ========== //

BankDetailsList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    filter: propTypes.object,
    setInitData: propTypes.func
};

export default BankDetailsList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="bank_detail_name" sx={{ width: '22%' }}>
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Bank Details Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="bank_name" sx={{ width: '22%' }}>
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Bank Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="account_name" sx={{ width: '22%' }}>
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        Account Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="account_number" sx={{ width: '22%' }}>
                    <TableSortLabel active={orderBy === '3'} direction={orderBy === '3' ? order : 'asc'} onClick={createSortHandler('3')}>
                        Account Number
                    </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ width: '12%' }}>
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
