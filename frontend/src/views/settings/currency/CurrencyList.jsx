import propTypes from 'prop-types';

import { Edit as EditIcon } from '@mui/icons-material';
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
import CommonDialog from 'utils/CommonDialog';
import { apiErrorSnackBar } from 'utils/SnackBar';

import AddEditCurrency from './AddEditCurrency';
import { currencyListApi } from 'apis/Settings';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0
};
let recordsTotal = 0;

const CurrencyList = ({ search, callApi, currencyLocale, setCurrencyLocale }) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [currencyData, setCurrencyData] = useState({});

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
        setCurrencyData(row);
    };

    const getData = () => {
        currencyListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
                setCurrencyLocale(res.data.data.currencyLocale);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
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
                        {data.map((item, index) => (
                            <TableRow hover role="checkbox" key={index}>
                                <TableCell align="left">{item.currency_name}</TableCell>
                                <TableCell align="left">{item.currency_symbol}</TableCell>
                                <TableCell align="left">{item.short_code}</TableCell>
                                <TableCell align="left">{item.locale}</TableCell>
                                <TableCell align="left">{item.status}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
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
                    title="Edit Currency"
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editCurrency"
                >
                    <AddEditCurrency value={currencyData} formId="editCurrency" onSubmit={submitHandler} currencyLocale={currencyLocale} />
                </CommonDialog>
            )}
        </>
    );
};

CurrencyList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool
};

export default CurrencyList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="currency_name" sx={{ width: '20%' }}>
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Currency name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="currency_symbol" sx={{ width: '20%' }}>
                    Currency symbol
                </TableCell>
                <TableCell key="short_code" sx={{ width: '20%' }}>
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Short code
                    </TableSortLabel>
                </TableCell>
                <TableCell key="locale" sx={{ width: '15%' }}>
                    {/* <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}> */}
                    Locale
                    {/* </TableSortLabel> */}
                </TableCell>
                <TableCell key="status" sx={{ width: '15%' }}>
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
