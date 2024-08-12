import propTypes from 'prop-types';
import {
    CardContent,
    Link,
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
import MainCard from 'ui-component/cards/MainCard';
import { useState } from 'react';
import { useEffect } from 'react';
import useAuth from 'hooks/useAuth';
import { InvoiceInitApi, InvoiceListApi } from 'apis/Invoice';
import { apiErrorSnackBar } from 'utils/SnackBar';
import CommonDialog from 'utils/CommonDialog';
import ViewInvoice from 'views/invoice/ViewInvoice';
import InvoiceSkeleton from './Skeleton/InvoiceSkeleton';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0,
    client_id: '0',
    invoice_amount: '0',
    status: '0',
    is_due: true
};
let recordsTotal = 0;
const DashboardInvoiceList = ({ isLoading }) => {
    const { recall } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openView, setOpenView] = useState(false);
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
        InvoiceListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    useEffect(() => {
        params.displayLength = rowsPerPage;
        params.displayStart = rowsPerPage * page;
        params.orderDir = order?.toUpperCase() ?? params.orderDir;
        params.orderColumn = Number(orderBy);
        getData();
    }, [page, rowsPerPage, order, orderBy, recall]);

    // ========== View ========== //
    const viewData = (row) => {
        InvoiceInitApi({ type: 'view', id: row.id })
            .then((res) => {
                setOpenView((prevState) => !prevState);
                setInvoiceData(res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };
    return (
        <>
            {isLoading ? (
                <InvoiceSkeleton />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Typography variant="h4">Due Invoices</Typography>
                        <TableContainer>
                            <Table>
                                <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                                <TableBody>
                                    {data.map((i, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <Link
                                                    underline="none"
                                                    sx={{
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => viewData(i)}
                                                >
                                                    {i.invoice_no}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {i.client_company}
                                                <Typography variant="subtitle2">{i.client_name}</Typography>
                                            </TableCell>
                                            <TableCell>{i.invoice_date}</TableCell>
                                            <TableCell align="right">{i.invoice_currency_total_amount}</TableCell>
                                            <TableCell align="right">{i.company_currency_total_amount}</TableCell>
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
                    </CardContent>

                    {/* Invoice View */}
                    {openView && (
                        <CommonDialog
                            open={openView}
                            title={`View - ${invoiceData.invoice['invoice_no']}`}
                            onClose={() => {
                                setOpenView((prevState) => !prevState);
                                getData();
                            }}
                            saveButton={true}
                            sx={{
                                '& .MuiDialog-container ': {
                                    justifyContent: 'flex-end',
                                    '& .MuiPaper-root': {
                                        m: 0,
                                        p: 0,
                                        borderRadius: '0px',
                                        minWidth: { sm: '70%', xs: '100%' },
                                        minHeight: '100%'
                                    }
                                }
                            }}
                        >
                            <ViewInvoice invoiceData={invoiceData} />
                        </CommonDialog>
                    )}
                </MainCard>
            )}
        </>
    );
};

DashboardInvoiceList.propTypes = {
    isLoading: propTypes.bool
};

export default DashboardInvoiceList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };
    return (
        <TableHead>
            <TableRow>
                <TableCell key="invoice_number">
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Invoice Number
                    </TableSortLabel>
                </TableCell>
                <TableCell key="Client">
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Client
                    </TableSortLabel>
                </TableCell>
                <TableCell key="date">
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        Date
                    </TableSortLabel>
                </TableCell>
                <TableCell key="amount" align="right">
                    <TableSortLabel active={orderBy === '3'} direction={orderBy === '3' ? order : 'asc'} onClick={createSortHandler('3')}>
                        Amount
                    </TableSortLabel>
                </TableCell>
                <TableCell key="total" align="right">
                    <TableSortLabel active={orderBy === '6'} direction={orderBy === '6' ? order : 'asc'} onClick={createSortHandler('6')}>
                        Total
                    </TableSortLabel>
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
