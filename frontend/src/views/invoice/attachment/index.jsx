import { AddCircleOutlineOutlined, DeleteOutline, DownloadOutlined, GetAppOutlined } from '@mui/icons-material';
import { Button, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { AttachmentDeleteApi, AttachmentListApi, DownloadInvoiceAttachmentApi } from 'apis/Invoice';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import CenterDialog from 'views/utilities/CenterDialog';
import AddAttachment from './AddAttachment';

const params = {
    invoice_id: 0
};

let colCount = 0;

const Index = ({ invoiceID }) => {
    const { checkRestriction } = useAuth();
    const [attachmentData, setAttachmentData] = useState([]);
    const [documentType, setDocumentType] = useState([]);
    const [openAttachment, setOpenAttachment] = useState(false);
    const [callApi, setCallApi] = useState(false);

    const getData = () => {
        AttachmentListApi(params)
            .then((res) => {
                setAttachmentData(res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    useEffect(() => {
        params.invoice_id = invoiceID;
        getData();
    }, [callApi]);

    const submitHandler = () => {
        setOpenAttachment((prevState) => !prevState);
        setCallApi((prevState) => !prevState);
    };

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

    // ========== Download Invoice Attachments ========== //
    const invoiceAttachmentsDownloadHandler = () => {
        DownloadInvoiceAttachmentApi({ invoice_id: invoiceID })
            .then((res) => {
                const a = document.createElement('a');
                a.href = res.data.data.zip;
                a.download = res.data.data.file_name;
                a.click();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item sx={{ flexGrow: 1 }}>
                                    {/* <Typography variant="column">Payment List</Typography> */}
                                </Grid>

                                <Grid item>
                                    {checkRestriction('CAN_DOWNLOAD_INVOICE_ALL_ATTACHMENT') && attachmentData.length > 1 && (
                                        <Tooltip title="Download All Invoice Attachments" arrow>
                                            <IconButton
                                                color="primary"
                                                component="label"
                                                onClick={() => invoiceAttachmentsDownloadHandler()}
                                            >
                                                <GetAppOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" onClick={() => setOpenAttachment((prevState) => !prevState)}>
                                        <AddCircleOutlineOutlined sx={{ mr: 0.5 }} /> Add Attachment
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                content={true}
            >
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
            </MainCard>

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
                        invoiceID={invoiceID}
                        initList={documentType}
                    />
                </CenterDialog>
            )}
        </>
    );
};

export default Index;
