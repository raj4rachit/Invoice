import propTypes from 'prop-types';
import {
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Grid,
    IconButton,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { gridSpacing } from 'store/constant';
import Logo1 from 'assets/images/logo.png';
import { DeleteOutline, DownloadOutlined } from '@mui/icons-material';
import AddAttachment from './attachment/AddAttachment';
import { useEffect, useState } from 'react';
import CenterDialog from 'views/utilities/CenterDialog';
import useAuth from 'hooks/useAuth';
import { AttachmentDeleteApi, AttachmentListApi } from 'apis/Invoice';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import parse from 'html-react-parser';

const params = {
    invoice_id: 0
};
let colCount = 0;
const ViewInvoice = ({ invoiceData }) => {
    const invoice = invoiceData?.invoice ?? false;
    const client = invoiceData?.client ?? false;
    const invoiceCompany = invoiceData?.invoiceCompanyDetails ?? false;
    const invoiceItems = invoiceData?.invoiceItems ?? false;
    const invoiceTaxes = invoiceData?.invoiceTaxes ?? false;
    const invoiceBanks = invoiceData?.invoiceBanks ?? false;
    const invoiceTerm = invoiceData?.invoiceTerm ?? false;
    const DocumentType = invoiceData?.documentType;

    const { checkRestriction } = useAuth();
    const [attachmentData, setAttachmentData] = useState([]);
    const [openAttachment, setOpenAttachment] = useState(false);

    const submitHandler = () => {
        setOpenAttachment((prevState) => !prevState);
        getData();
    };

    colCount = (invoice.total_discount_flag === true ? 1 : 0) + (invoice.total_deduction_flag === true ? 1 : 0) + invoiceTaxes.length;

    const getData = () => {
        AttachmentListApi(params)
            .then((res) => {
                setAttachmentData(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        params.invoice_id = invoice.id;
        getData();
    }, [invoice]);

    // Download
    const downloadAttachment = (row) => {
        const a = document.createElement('a');
        a.href = row.base64_document;
        a.download = row.document;
        a.click();
    };

    const deleteAttachment = (row) => {
        AttachmentDeleteApi({ id: row.id })
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

    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12} md={8}>
                    <img src={invoiceCompany.company_logo} alt="logo" height="70" />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <Typography variant="h3">Invoice</Typography>
                    <Typography variant="subtitle1">Invoice # - {invoice.invoice_no}</Typography>
                    <Typography variant="subtitle1">Invoice Date - {invoice.invoice_date}</Typography>
                    <Typography variant="subtitle1">Invoice Due Date - {invoice.invoice_due_date}</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#515151' }}>
                                    <TableCell sx={{ width: '50%', color: '#FFFFFF' }}>Our Information</TableCell>
                                    <TableCell sx={{ width: '50%', color: '#FFFFFF' }}>Invoice To</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="subtitle1">{invoiceCompany.company_name}</Typography>
                                        <Typography variant="h6">{`${invoiceCompany.address_1}, ${invoiceCompany.address_2}`}</Typography>
                                        <Typography variant="h6">{`${invoiceCompany.city}, ${invoiceCompany.state}`}</Typography>
                                        <Typography variant="h6">{`${invoiceCompany.country_name}, ${invoiceCompany.zip_code}`}</Typography>
                                        <Typography variant="h6">Phone : {invoiceCompany.contact_number}</Typography>
                                        <Typography variant="h6">Email : {invoiceCompany.email}</Typography>
                                        <Typography variant="h6">Tax ID : {invoiceCompany.tax_no}</Typography>
                                        <Typography variant="h6">GST No. : {invoiceCompany.gst_vat_no}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{client.company_name}</Typography>
                                        <Typography variant="h6">{`${client.address_1}, ${client.address_2}`}</Typography>
                                        <Typography variant="h6">{`${client.city}, ${client.state}`}</Typography>
                                        <Typography variant="h6">{`${client.country_name}, ${client.zip_code}`}</Typography>
                                        <Typography variant="h6">Phone : {client.phone}</Typography>
                                        <Typography variant="h6">Email : {client.email}</Typography>
                                        <Typography variant="h6">Tax ID : {client.tax_no}</Typography>
                                        {client?.gst_vat_no && client.gst_vat_no !== '' && (
                                            <Typography variant="h6">GST No. : {client.gst_vat_no}</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#515151' }}>
                                    <TableCell sx={{ color: '#FFFFFF' }}>Description</TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }} align="right">
                                        Price
                                    </TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }} align="right">
                                        Resource Qty
                                    </TableCell>
                                    {invoice.total_deduction_flag === true && (
                                        <TableCell sx={{ color: '#FFFFFF' }} align="right">
                                            deduction
                                        </TableCell>
                                    )}
                                    <TableCell sx={{ color: '#FFFFFF' }} align="right">
                                        Amount
                                    </TableCell>
                                    {invoice.total_discount_flag === true && (
                                        <TableCell sx={{ color: '#FFFFFF' }} align="right">
                                            Discount
                                        </TableCell>
                                    )}
                                    {invoiceTaxes &&
                                        invoiceTaxes.map((i, idx) => (
                                            <TableCell align="right" sx={{ color: '#FFFFFF' }} key={idx}>
                                                {`${i.tax_name} (${i.tax_rate}${i.is_percentage === 'Yes' ? '%' : ''})`}
                                            </TableCell>
                                        ))}
                                    <TableCell sx={{ color: '#FFFFFF' }} align="right">
                                        Total
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoiceItems.map((i, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <Typography variant="subtitle1">{i.resource_name}</Typography>
                                            <Typography variant="h6">{i.description}</Typography>
                                        </TableCell>
                                        <TableCell align="right">{i.rate}</TableCell>
                                        <TableCell align="right">{i.resource_quantity}</TableCell>
                                        {invoice.total_deduction_flag === true && <TableCell align="right">{i.deduction}</TableCell>}
                                        <TableCell align="right">{i.subtotal}</TableCell>
                                        {invoice.total_discount_flag === true && <TableCell align="right">{i.discount_amount}</TableCell>}
                                        {i.itemTaxAmount.map((iv, id) => (
                                            <TableCell align="right" key={id}>
                                                {iv.tax_amount}
                                            </TableCell>
                                        ))}
                                        <TableCell align="right">{i.total_amount}</TableCell>
                                    </TableRow>
                                ))}

                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Typography variant="h5">Grand Total</Typography>
                                    </TableCell>
                                    {invoice.total_deduction_flag === true && (
                                        <TableCell align="right">{invoice.total_deduction}</TableCell>
                                    )}
                                    <TableCell align="right">{invoice.subtotal}</TableCell>
                                    {invoice.total_discount_flag === true && <TableCell align="right">{invoice.total_discount}</TableCell>}
                                    {invoiceTaxes &&
                                        invoiceTaxes.map((i, idx) => (
                                            <TableCell align="right" key={idx}>
                                                {i.tax_amount}
                                            </TableCell>
                                        ))}
                                    <TableCell align="right">
                                        <Typography variant="h5">{invoice.invoice_currency_total_amount}</Typography>
                                    </TableCell>
                                </TableRow>
                                {/* If company currency show */}
                                {invoice.is_display_company_amount === 'Yes' && (
                                    <>
                                        <TableRow>
                                            <TableCell colSpan={4 + colCount}>
                                                <Typography variant="h5">Company CCR</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="h5">{invoice.currency_conversion_rate}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={4 + colCount}>
                                                <Typography variant="h5">Company Currency Amount</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="h5">{invoice.company_currency_total_amount}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="subtitle1">This is computer generated invoice no signature required.</Typography>
                </Grid> */}

                {/* Bank Details */}
                {invoiceBanks.length > 0 && (
                    <Grid item xs={12} sm={12} md={12}>
                        <Typography variant="subtitle1" mb={`10px`}>
                            Bank Details :
                        </Typography>
                        <Grid container justifyContent="space-between" spacing={1}>
                            {invoiceBanks.map((i, idx) => (
                                <Grid item xs={12} md={invoiceBanks.length === 1 ? 12 : 6} key={idx}>
                                    <Card variant="outlined">
                                        <CardHeader
                                            title={<Typography sx={{ color: '#FFFFFF' }}>{i.bank_detail_name}</Typography>}
                                            sx={{ padding: '15px', backgroundColor: '#515151' }}
                                        />
                                        <CardContent sx={{ padding: '15px' }}>
                                            <Grid container justifyContent="space-between" sx={{ marginBottom: '8px' }}>
                                                <Typography variant="body2" align="left">
                                                    Bank Name :
                                                </Typography>
                                                <Typography variant="h6" align="right" color="text.secondary">
                                                    {i.bank_name}
                                                </Typography>
                                            </Grid>
                                            <Grid container justifyContent="space-between" sx={{ marginBottom: '8px' }}>
                                                <Typography variant="body2" align="left">
                                                    Account Name :
                                                </Typography>
                                                <Typography variant="h6" align="right" color="text.secondary">
                                                    {i.account_name}
                                                </Typography>
                                            </Grid>
                                            <Grid container justifyContent="space-between" sx={{ marginBottom: '8px' }}>
                                                <Typography variant="body2" align="left">
                                                    Account Number :
                                                </Typography>
                                                <Typography variant="h6" align="right" color="text.secondary">
                                                    {i.account_number}
                                                </Typography>
                                            </Grid>
                                            {i.filed.map((iv, index) => (
                                                <Grid container justifyContent="space-between" sx={{ marginBottom: '8px' }} key={index}>
                                                    <Typography variant="body2" align="left">
                                                        {iv.key} :
                                                    </Typography>
                                                    <Typography variant="h6" align="right" color="text.secondary">
                                                        {iv.value}
                                                    </Typography>
                                                </Grid>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                )}

                {invoiceTerm && (
                    <Grid item xs={12} sm={12} md={12}>
                        {/* <Typography variant="subtitle1" mb={`10px`}>
                            Invoice Terms :
                        </Typography> */}
                        <Typography variant="subtitle1" component={'div'}>
                            {parse(invoiceTerm.description)}
                        </Typography>
                    </Grid>
                )}

                <Grid item xs={12} sm={12} md={12}>
                    <Divider>
                        <Chip label="Attachment" />
                    </Divider>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <Grid container justifyContent="space-between">
                        <Typography variant="body1" align="left">
                            Attachment
                        </Typography>
                        {checkRestriction('CAN_ADD_INVOICE_ATTACHMENT') && (
                            <Link
                                underline="hover"
                                sx={{
                                    cursor: 'pointer'
                                }}
                                onClick={() => setOpenAttachment((prevState) => !prevState)}
                            >
                                Add Attachment
                            </Link>
                        )}
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '40%' }}>File Name</TableCell>
                                    <TableCell sx={{ width: '40%' }}>Document Type</TableCell>
                                    <TableCell align="right" sx={{ width: '20%' }}>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attachmentData.map((i, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{i.file_name}</TableCell>
                                        <TableCell>{i.doc_type_name}</TableCell>
                                        <TableCell align="right">
                                            {checkRestriction('CAN_DOWNLOAD_INVOICE_ATTACHMENT') && (
                                                <IconButton color="secondary" component="label" onClick={() => downloadAttachment(i)}>
                                                    <DownloadOutlined fontSize="small" />
                                                </IconButton>
                                            )}
                                            {checkRestriction('CAN_DELETE_INVOICE_ATTACHMENT') && (
                                                <IconButton color="error" component="label" onClick={() => deleteAttachment(i)}>
                                                    <DeleteOutline fontSize="small" />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            {openAttachment && (
                <CenterDialog
                    title={`Add Attachment`}
                    open={openAttachment}
                    onClose={() => setOpenAttachment((prevState) => !prevState)}
                    id="addAttachment"
                >
                    <AddAttachment
                        attNo={attachmentData.length}
                        formID="addAttachment"
                        onSubmit={submitHandler}
                        invoiceID={invoice.id}
                        initList={DocumentType}
                    />
                </CenterDialog>
            )}
        </>
    );
};

ViewInvoice.propTypes = {
    invoiceData: propTypes.object
};
export default ViewInvoice;
