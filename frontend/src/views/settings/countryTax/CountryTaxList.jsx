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
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import DeleteDialog from 'views/utilities/DeleteDialog';
import CommonDialog from 'utils/CommonDialog';
import { CountryTaxListApi, deleteCountryTaxApi } from 'apis/Settings';
import AddEditCountryTax from './AddEditCountryTax';
// import useAuth from 'hooks/useAuth';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0
};

let recordsTotal = 0;

const CountryTaxList = ({ search, callApi, setCountryList, countryList }) => {
    // const { checkRestriction } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [countryTaxData, setCountryTaxData] = useState({});

    // ========== Delete ========== //
    const deleteData = (row) => {
        setOpenDelete(true);
        setCountryTaxData(row);
    };

    const deleteHandler = () => {
        deleteCountryTaxApi({ id: countryTaxData.id })
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
        setCountryTaxData(row);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    // ========== Data Supplier ========== //
    const getData = () => {
        CountryTaxListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
                setCountryList(res.data.data.countryList);
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
                                <TableCell align="left">{item.tax_name}</TableCell>
                                <TableCell align="left">{item.rate}</TableCell>
                                <TableCell align="left">{item.is_percentage}</TableCell>
                                <TableCell align="left">{item.country_name}</TableCell>
                                <TableCell align="left">{item.status}</TableCell>
                                {/* {checkRestriction('CAN_EDIT_SUBSCRIBER') && checkRestriction('CAN_DELETE_SUBSCRIBER') && ( */}
                                <TableCell align="right">
                                    {/* {checkRestriction('CAN_EDIT_SUBSCRIBER') && ( */}
                                    <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    {/* )} */}
                                    {/* {checkRestriction('CAN_DELETE_SUBSCRIBER') && ( */}
                                    <IconButton color="error" component="label" onClick={() => deleteData(item)}>
                                        <DeleteOutline fontSize="small" />
                                    </IconButton>
                                    {/* )} */}
                                </TableCell>
                                {/* )} */}
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
                    title="Edit Country Tax"
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editCountryTax"
                >
                    <AddEditCountryTax value={countryTaxData} formId="editCountryTax" onSubmit={submitHandler} countryList={countryList} />
                </CommonDialog>
            )}

            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Country Tax"
                    name={countryTaxData['tax_name']}
                />
            )}
        </>
    );
};

// ========== PropTypes ========== //

CountryTaxList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    setCountryList: propTypes.func,
    countryList: propTypes.array
};

export default CountryTaxList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    // const { checkRestriction } = useAuth();
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="tax_name">
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Tax name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="rate">
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Rate
                    </TableSortLabel>
                </TableCell>
                <TableCell key="is_percentage">
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        Is Percentage
                    </TableSortLabel>
                </TableCell>
                <TableCell key="country_name">
                    <TableSortLabel active={orderBy === '3'} direction={orderBy === '3' ? order : 'asc'} onClick={createSortHandler('3')}>
                        Country
                    </TableSortLabel>
                </TableCell>
                <TableCell key="status">
                    <TableSortLabel active={orderBy === '4'} direction={orderBy === '4' ? order : 'asc'} onClick={createSortHandler('4')}>
                        Status
                    </TableSortLabel>
                </TableCell>
                {/* {checkRestriction('CAN_EDIT_SUBSCRIBER') && checkRestriction('CAN_DELETE_SUBSCRIBER') && ( */}
                <TableCell align="right" sx={{ width: '10%' }}>
                    Action
                </TableCell>
                {/* )} */}
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
