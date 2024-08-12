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
import { deleteSubscriberApi, subscriberListApi } from 'apis/Subscriber';
import AddEditSubscriber from './AddEditSubscriber';
import CommonDialog from 'utils/CommonDialog';
import useAuth from 'hooks/useAuth';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0
};

let recordsTotal = 0;

const SubscriberList = ({
    search,
    callApi,
    subscriberCountryList,
    setSubscriberCountryList,
    subscriberCurrencyList,
    setSubscriberCurrencyList
}) => {
    const { checkRestriction } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [subscriberData, setSubscriberData] = useState({});

    // ========== Delete ========== //

    const deleteData = (row) => {
        setOpenDelete(true);
        setSubscriberData(row);
    };

    const deleteHandler = () => {
        deleteSubscriberApi({ id: subscriberData.id })
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
        setSubscriberData(row);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    // ========== Data Supplier ========== //
    const getData = () => {
        subscriberListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
                setSubscriberCountryList(res.data.data.countryList);
                setSubscriberCurrencyList(res.data.data.currencyList);
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
                                <TableCell align="left">{item.official_name}</TableCell>
                                <TableCell align="left">{item.email}</TableCell>
                                <TableCell align="left">{item.country_name}</TableCell>
                                <TableCell align="left">{item.status}</TableCell>
                                {checkRestriction('CAN_EDIT_SUBSCRIBER') && checkRestriction('CAN_DELETE_SUBSCRIBER') && (
                                    <TableCell align="right">
                                        {checkRestriction('CAN_EDIT_SUBSCRIBER') && (
                                            <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        {checkRestriction('CAN_DELETE_SUBSCRIBER') && (
                                            <IconButton color="error" component="label" onClick={() => deleteData(item)}>
                                                <DeleteOutline fontSize="small" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                )}
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
                    title="Edit Subscriber"
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editSubscriber"
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
                    <AddEditSubscriber
                        value={subscriberData}
                        formId="editSubscriber"
                        onSubmit={submitHandler}
                        subscriberCountryList={subscriberCountryList}
                        subscriberCurrencyList={subscriberCurrencyList}
                    />
                </CommonDialog>
            )}

            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Subscriber"
                    name={subscriberData['official_name']}
                />
            )}
        </>
    );
};

// ========== PropTypes ========== //

SubscriberList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    setSubscriberCountryList: propTypes.func,
    subscriberCountryList: propTypes.array,
    setSubscriberCurrencyList: propTypes.func,
    subscriberCurrencyList: propTypes.array
};

export default SubscriberList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const { checkRestriction } = useAuth();
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="official_name" sx={{ width: '30%' }}>
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Official Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="email" sx={{ width: '30%' }}>
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Email
                    </TableSortLabel>
                </TableCell>
                <TableCell key="country_name" sx={{ width: '15%' }}>
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        Country Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="status" sx={{ width: '15%' }}>
                    <TableSortLabel active={orderBy === '3'} direction={orderBy === '3' ? order : 'asc'} onClick={createSortHandler('3')}>
                        Status
                    </TableSortLabel>
                </TableCell>
                {checkRestriction('CAN_EDIT_SUBSCRIBER') && checkRestriction('CAN_DELETE_SUBSCRIBER') && (
                    <TableCell align="right" sx={{ width: '10%' }}>
                        Action
                    </TableCell>
                )}
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
