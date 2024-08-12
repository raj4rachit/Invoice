import {
    Chip,
    IconButton,
    Link,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Tooltip,
    Typography
} from '@mui/material';
import { DownloadInvoiceApi, DuplicateInvoiceApi, InitPaymentApi, InvoiceDeleteApi, InvoiceInitApi, InvoiceListApi } from 'apis/Invoice';
import useAuth from 'hooks/useAuth';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import CommonDialog from 'utils/CommonDialog';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import CenterDialog from 'views/utilities/CenterDialog';
import DeleteDialog from 'views/utilities/DeleteDialog';
import AddEditInvoice from './AddEditInvoice';
import ViewInvoice from './ViewInvoice';
import PaymentIndex from './payment/index';
import AttachmentIndex from './attachment/index';
import { ContentCopyOutlined, DeleteOutline, Edit as EditIcon, GetAppOutlined, SimCardDownloadOutlined } from '@mui/icons-material';
import moment from 'moment';
import AddAttachment from './attachment/AddAttachment';
import AddEditPayment from './payment/AddEditPayment';
import TitlePopper from 'views/utilities/TitlePopper';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0,
    client_id: '0',
    invoice_amount: '0',
    status: '0',
    is_due: false,
    from_date: null,
    to_date: null
};

let recordsTotal = 0;

const InvoiceList = ({ search, callApi, initData, filter, setIsLoading, setWidgets }) => {
    const { checkRestriction, recall } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openInvoicePayment, setOpenInvoicePayment] = useState(false);
    const [invoiceData, setInvoiceData] = useState({});
    const [paymentInvoiceData, setPaymentInvoiceData] = useState({});
    const [footerData, setFooterData] = useState({});
    const [openAttachment, setOpenAttachment] = useState(false);
    const [openAttachmentList, setOpenAttachmentList] = useState(false);
    const [openPayment, setOpenPayment] = useState(false);
    const [iVStatusPopper, setIVStatusPopper] = useState(null);
    const [iVUpdateAtPopper, setIVUpdateAtPopper] = useState(null);
    const [currencyRateData, setCurrencyRate] = useState({});

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
                setWidgets(res.data.data.widgets);
                setFooterData(res.data.data.footerTotal);
                setIsLoading(false);
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
        params.client_id = filter.filterClientID;
        params.status = filter.filterStatus;
        params.from_date = filter.filterFromDate;
        params.to_date = filter.filterToDate;
        getData();
    }, [page, rowsPerPage, order, orderBy, search, callApi, recall]);

    // ========== Edit ========== //
    const editData = (row) => {
        InvoiceInitApi({ type: 'edit', id: row.id })
            .then((res) => {
                setOpenEdit((prevState) => !prevState);
                setInvoiceData(res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };
    const attachmentSubmitHandler = () => {
        setOpenAttachment((prevState) => !prevState);
        getData();
    };

    // ========== Duplicate Invoice ========== //
    const duplicateInvoice = (id) => {
        const obj = { id: id };
        DuplicateInvoiceApi(obj)
            .then((res) => {
                if (res.data && res.data.status === 1) {
                    getData();
                    apiSuccessSnackBar(res);
                } else {
                    apiValidationSnackBar(res);
                }
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    // ========== Delete ========== //
    const deleteData = (row) => {
        setOpenDelete(true);
        setInvoiceData(row);
    };

    const deleteHandler = () => {
        InvoiceDeleteApi({ id: invoiceData.id })
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

    // ========== Invoice Payment ========== //
    const invoicePaymentData = (row) => {
        setInvoiceData(row);
        if (row.has_payment) {
            setOpenInvoicePayment((prevState) => !prevState);
        } else {
            InitPaymentApi({ type: 'add', invoice_id: row.id })
                .then((res) => {
                    setPaymentInvoiceData(res.data.data.invoiceData);
                    setCurrencyRate(res.data.data.currency_rate);
                    // setOpenAdd((prevState) => !prevState);
                    setOpenPayment((prevState) => !prevState);
                })
                .catch((err) => {
                    apiErrorSnackBar(err);
                });
        }
    };

    const paymentSubmitHandler = () => {
        setOpenPayment((prevState) => !prevState);
        getData();
    };

    // ========== Download Invoice ========== //
    const invoiceDownload = (row) => {
        DownloadInvoiceApi({ invoice_id: row.id })
            .then((res) => {
                const a = document.createElement('a');
                a.href = res.data.data.invoice;
                a.download = res.data.data.invoice_name;
                a.click();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // ========== Download Invoice Attachments ========== //
    // const invoiceAttachmentsDownloadHandler = (row) => {
    //     DownloadInvoiceAttachmentApi({ invoice_id: row.id })
    //         .then((res) => {
    //             const a = document.createElement('a');
    //             a.href = res.data.data.zip;
    //             a.download = res.data.data.file_name;
    //             a.click();
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    const invoiceStatusChip = (status) => {
        switch (status) {
            case 'Due':
                return 'warning';
            case 'Partial':
                return 'primary';
            case 'Paid':
                return 'secondary';
            case 'Bad Debt':
                return 'error';
            default:
                return 'default';
        }
    };

    const attachmentsHandler = (row) => {
        setInvoiceData(row);
        if (row.has_attachment) {
            setOpenAttachmentList((prevState) => !prevState);
        } else {
            setOpenAttachment((prevState) => !prevState);
        }
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>
                        {data.map((i, idx) => (
                            <TableRow key={idx}>
                                <TableCell>
                                    {checkRestriction('CAN_VIEW_INVOICE') ? (
                                        <Link
                                            underline="none"
                                            sx={{
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => viewData(i)}
                                        >
                                            {i.invoice_no}
                                        </Link>
                                    ) : (
                                        i.invoice_no
                                    )}
                                </TableCell>
                                <TableCell>
                                    {i.client_company}
                                    <Typography variant="subtitle2">{i.client_name}</Typography>
                                </TableCell>
                                <TableCell>{i.invoice_date}</TableCell>
                                {/* <TableCell align="right">{i.invoice_currency_total_amount}</TableCell> */}
                                <TableCell align="right">
                                    {i.subtotal}
                                    {i.is_discount && <Typography variant="subtitle2">Discount - {i.total_discount}</Typography>}
                                </TableCell>
                                <TableCell align="right">{i.total_tax_amount}</TableCell>
                                <TableCell align="right">{i.currency_conversion_rate}</TableCell>
                                <TableCell align="right">{i.company_currency_total_amount}</TableCell>
                                <TableCell align="right">{i.company_currency_amount_received}</TableCell>
                                <TableCell>{i.is_bifurcated}</TableCell>
                                <TableCell>
                                    <Chip
                                        color={invoiceStatusChip(i.invoice_status)}
                                        label={i.invoice_status}
                                        onClick={() => invoicePaymentData(i)}
                                        onMouseEnter={(e) => {
                                            i.has_payment && setIVStatusPopper(e.currentTarget);
                                            i.has_payment && setInvoiceData(i);
                                        }}
                                        onMouseLeave={() => setIVStatusPopper(null)}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Typography
                                        onClick={() => attachmentsHandler(i)}
                                        sx={{ cursor: 'pointer' }}
                                        onMouseEnter={(e) => {
                                            i.has_attachment && setIVUpdateAtPopper(e.currentTarget);
                                            i.has_attachment && setInvoiceData(i);
                                        }}
                                        onMouseLeave={() => setIVUpdateAtPopper(null)}
                                    >
                                        {i.last_attachment_date !== null ? moment(i.last_attachment_date).format('YYYY-MM-DD') : '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    {/* {checkRestriction('CAN_DOWNLOAD_INVOICE_ALL_ATTACHMENT') && i.has_attachment === true && (
                                        <Tooltip title="Download Invoice Attachments" arrow>
                                            <IconButton
                                                color="primary"
                                                component="label"
                                                onClick={() => invoiceAttachmentsDownloadHandler(i)}
                                            >
                                                <GetAppOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )} */}
                                    {checkRestriction('CAN_EDIT_INVOICE') && (
                                        <Tooltip title="Edit" arrow>
                                            <IconButton color="primary" component="label" onClick={() => editData(i)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    <Tooltip title="Duplicate" arrow>
                                        <IconButton color="secondary" component="label" onClick={() => duplicateInvoice(i.id)}>
                                            <ContentCopyOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    {checkRestriction('CAN_DELETE_INVOICE') && (
                                        <Tooltip title="Delete" arrow>
                                            <IconButton color="error" component="label" onClick={() => deleteData(i)}>
                                                <DeleteOutline fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {checkRestriction('CAN_DOWNLOAD_INVOICE') && (
                                        <Tooltip title="Download Invoice" arrow>
                                            <IconButton color="primary" component="label" onClick={() => invoiceDownload(i)}>
                                                <SimCardDownloadOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>
                                <Typography>Invoice Number</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>Client</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>Date</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>Amount</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>Total Tax</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>CCR</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>{footerData?.total ? <b>{footerData.total}</b> : 'Total'}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {footerData?.received_amount ? <b>{footerData.received_amount}</b> : 'Received Amount'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>Is Bifurcated?</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>Status</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>Updated At</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>Action</Typography>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
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

            {/* {iVStatusPopper && (
                <TitlePopper
                    open={iVStatusPopper}
                    title={'Payments'}
                    itemList={['20-Nov-2022 | Demo| 454554', '20-Nov-2022 | Demo| 4545545645645645']}
                />
            )} */}
            {iVStatusPopper && <TitlePopper open={iVStatusPopper} title={'Invoice Payments'} itemList={invoiceData.payment_list} />}
            {iVUpdateAtPopper && <TitlePopper open={iVUpdateAtPopper} title={'Attachments'} itemList={invoiceData.attached_list} />}

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

            {/* Invoice Edit */}
            {openEdit && (
                <CommonDialog
                    open={openEdit}
                    title={`Edit Invoice - ${invoiceData.invoice['invoice_no']}`}
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editInvoice"
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
                    <AddEditInvoice value={invoiceData} formId="editInvoice" onSubmit={submitHandler} />
                </CommonDialog>
            )}

            {/* Invoice Delete */}
            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="invoice"
                    name={invoiceData['invoice_no']}
                />
            )}

            {/* Invoice Payment */}
            {openInvoicePayment && (
                <CenterDialog
                    title={`Invoice Payment List - ${invoiceData['invoice_no']}`}
                    open={openInvoicePayment}
                    onClose={() => {
                        setOpenInvoicePayment((prevState) => !prevState);
                        getData();
                    }}
                    id="addAttachment"
                    saveButton={true}
                    sx={{
                        '&>div:nth-of-type(3)': {
                            '&>div': {
                                minWidth: { md: '70%', xs: '90%' }
                            }
                        }
                    }}
                >
                    <PaymentIndex formID="addAttachment" invoiceID={invoiceData['id']} />
                </CenterDialog>
            )}

            {/* Open Attachment */}
            {openAttachment && (
                <CenterDialog
                    title={`Add Attachment - ${invoiceData['invoice_no']}`}
                    open={openAttachment}
                    onClose={() => setOpenAttachment((prevState) => !prevState)}
                    id="addAttachment"
                >
                    <AddAttachment attNo={0} formID="addAttachment" onSubmit={attachmentSubmitHandler} invoiceID={invoiceData.id} />
                </CenterDialog>
            )}

            {openAttachmentList && (
                <CenterDialog
                    title={`Invoice Attachment List - ${invoiceData['invoice_no']}`}
                    open={openAttachmentList}
                    onClose={() => {
                        setOpenAttachmentList((prevState) => !prevState);
                        getData();
                    }}
                    saveButton={true}
                    sx={{
                        '&>div:nth-of-type(3)': {
                            '&>div': {
                                minWidth: { md: '50%', xs: '90%' }
                            }
                        }
                    }}
                >
                    <AttachmentIndex invoiceID={invoiceData['id']} />
                </CenterDialog>
            )}

            {/* Invoice Payment */}
            {openPayment && (
                <CenterDialog
                    title={`Add Invoice Payment - ${invoiceData['invoice_no']}`}
                    open={openPayment}
                    onClose={() => setOpenPayment((prevState) => !prevState)}
                    id="addPayment"
                    sx={{
                        '&>div:nth-of-type(3)': {
                            '&>div': {
                                minWidth: { md: '40%', xs: '90%' }
                            }
                        }
                    }}
                >
                    <AddEditPayment
                        formId="addPayment"
                        invoiceData={paymentInvoiceData}
                        currencyRateData={currencyRateData}
                        onSubmit={paymentSubmitHandler}
                    />
                </CenterDialog>
            )}
        </>
    );
};

InvoiceList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    initData: propTypes.object,
    filter: propTypes.object,
    setIsLoading: propTypes.func,
    setWidgets: propTypes.func
};

export default InvoiceList;

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
                <TableCell key="total_tax" align="right">
                    <TableSortLabel active={orderBy === '4'} direction={orderBy === '4' ? order : 'asc'} onClick={createSortHandler('4')}>
                        Total Tax
                    </TableSortLabel>
                </TableCell>
                <TableCell key="ccr" align="right">
                    <TableSortLabel active={orderBy === '5'} direction={orderBy === '5' ? order : 'asc'} onClick={createSortHandler('5')}>
                        CCR
                    </TableSortLabel>
                </TableCell>

                <TableCell key="total" align="right">
                    <TableSortLabel active={orderBy === '6'} direction={orderBy === '6' ? order : 'asc'} onClick={createSortHandler('6')}>
                        Total
                    </TableSortLabel>
                </TableCell>
                <TableCell key="received_amount" align="right">
                    <TableSortLabel active={orderBy === '7'} direction={orderBy === '7' ? order : 'asc'} onClick={createSortHandler('7')}>
                        Received Amount
                    </TableSortLabel>
                </TableCell>
                <TableCell key="is_bifurcated">
                    <TableSortLabel active={orderBy === '8'} direction={orderBy === '8' ? order : 'asc'} onClick={createSortHandler('8')}>
                        Is Bifurcated?
                    </TableSortLabel>
                </TableCell>
                <TableCell key="status">
                    <TableSortLabel active={orderBy === '9'} direction={orderBy === '9' ? order : 'asc'} onClick={createSortHandler('9')}>
                        Status
                    </TableSortLabel>
                </TableCell>
                <TableCell key="updated_at">
                    <TableSortLabel
                        active={orderBy === '10'}
                        direction={orderBy === '10' ? order : 'asc'}
                        onClick={createSortHandler('10')}
                    >
                        Updated At
                    </TableSortLabel>
                </TableCell>

                <TableCell key="action" align="right">
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
