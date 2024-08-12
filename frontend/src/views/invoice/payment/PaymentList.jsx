import { DeleteOutline, Edit as EditIcon } from '@mui/icons-material';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { DeletePaymentApi, InitPaymentApi, PaymentListApi } from 'apis/Invoice';
import { useEffect, useState } from 'react';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import CenterDialog from 'views/utilities/CenterDialog';
import DeleteDialog from 'views/utilities/DeleteDialog';
import AddEditPayment from './AddEditPayment';

const params = {
    invoice_id: '',
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0
};

let recordsTotal = 0;
const PaymentList = ({ search, invoiceID, callApi }) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [paymentData, setPaymentData] = useState({});
    const [invoiceData, setInvoiceData] = useState({});

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
        PaymentListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    useEffect(() => {
        params.invoice_id = invoiceID;
        params.search = search;
        params.displayLength = rowsPerPage;
        params.displayStart = rowsPerPage * page;
        params.orderDir = order?.toUpperCase() ?? params.orderDir;
        params.orderColumn = Number(orderBy);
        getData();
    }, [page, rowsPerPage, order, orderBy, search, callApi]);

    // ========== Edit ========== //
    const editData = (row) => {
        InitPaymentApi({ id: row.id, type: 'edit', invoice_id: invoiceID })
            .then((res) => {
                setPaymentData(res.data.data.paymentData);
                setInvoiceData(res.data.data.invoiceData);
                setOpenEdit((prevState) => !prevState);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };
    // ========== Delete ========== //
    const deleteData = (row) => {
        setPaymentData(row);
        setOpenDelete(true);
    };

    const deleteHandler = () => {
        DeletePaymentApi({ id: paymentData.id })
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
                    <TableHead>
                        <TableRow>
                            <TableCell>Ref No.</TableCell>
                            <TableCell>Payment Date</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">TDS</TableCell>
                            <TableCell>Way Of Payment</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{item.reference_no}</TableCell>
                                <TableCell>{item.payment_date}</TableCell>
                                <TableCell align="right">{item.company_currency_amount}</TableCell>
                                <TableCell align="right">{item.tds}</TableCell>
                                <TableCell>{item.payment_source_name}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton color="error" component="label" onClick={() => deleteData(item)}>
                                        <DeleteOutline fontSize="small" />
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

            {/* Invoice payment edit */}
            {openEdit && (
                <CenterDialog
                    title={`Edit Invoice Payment`}
                    open={openEdit}
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editPayment"
                >
                    <AddEditPayment value={paymentData} formId="editPayment" invoiceData={invoiceData} onSubmit={submitHandler} />
                </CenterDialog>
            )}

            {/* Invoice Delete */}
            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="invoice Payment"
                    name={paymentData['reference_no']}
                />
            )}
        </>
    );
};

export default PaymentList;
