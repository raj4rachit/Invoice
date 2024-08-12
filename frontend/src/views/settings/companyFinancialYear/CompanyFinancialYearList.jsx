import propTypes from 'prop-types';
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
    TableSortLabel,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DeleteOutline, Edit as EditIcon } from '@mui/icons-material';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import DeleteDialog from 'views/utilities/DeleteDialog';
import CenterDialog from 'views/utilities/CenterDialog';
import AddEditCompanyFinancialYear from './AddEditCompanyFinancialYear';
import { companyFinancialYearListApi, deleteCompanyFinancialYearApi } from 'apis/CompanyFinancialYear';
import useAuth from 'hooks/useAuth';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0
};
let recordsTotal = 0;
const CompanyFinancialYearList = ({ search, callApi, setCompanyList, companyList }) => {
    const { checkRestriction } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [financialData, setFinancialData] = useState({});

    // ========== Delete ========== //
    const deleteData = (row) => {
        setOpenDelete(true);
        setFinancialData(row);
    };

    const deleteHandler = () => {
        deleteCompanyFinancialYearApi({ id: financialData.id })
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
        setFinancialData(row);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    // ========== Table ========== //
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
        companyFinancialYearListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
                setCompanyList(res.data.data.companies);
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
                                <TableCell align="left">
                                    {item.financial_year_name}
                                    <Typography variant="subtitle2">{item.company_name}</Typography>
                                </TableCell>
                                <TableCell align="left">{item.start_date}</TableCell>
                                <TableCell align="left">{item.end_date}</TableCell>
                                <TableCell align="left">
                                    {item.is_default === 'Yes' ? (
                                        <Chip label={item.is_default} color="success" variant="outlined" size="small" />
                                    ) : (
                                        <Chip label={item.is_default} color="error" variant="outlined" size="small" />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {checkRestriction('CAN_EDIT_COMPANY_FINANCIAL_YEAR') && (
                                        <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {checkRestriction('CAN_DELETE_COMPANY_FINANCIAL_YEAR') && (
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
                    title="Edit Company Financial Year"
                    open={openEdit}
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editCompanyFinancialYear"
                >
                    <AddEditCompanyFinancialYear
                        value={financialData}
                        formId="editCompanyFinancialYear"
                        onSubmit={submitHandler}
                        companyList={companyList}
                    />
                </CenterDialog>
            )}
            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Company Financial Year"
                    name={financialData['financial_year_name']}
                />
            )}
        </>
    );
};

CompanyFinancialYearList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    setCompanyList: propTypes.func,
    companyList: propTypes.array
};

export default CompanyFinancialYearList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="company" sx={{ width: '30%' }}>
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="start_date" sx={{ width: '20%' }}>
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Start Date
                    </TableSortLabel>
                </TableCell>
                <TableCell key="end_date" sx={{ width: '20%' }}>
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        End Date
                    </TableSortLabel>
                </TableCell>
                <TableCell key="IsDefault" sx={{ width: '15%' }}>
                    <TableSortLabel active={orderBy === '3'} direction={orderBy === '3' ? order : 'asc'} onClick={createSortHandler('3')}>
                        Is Default
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
