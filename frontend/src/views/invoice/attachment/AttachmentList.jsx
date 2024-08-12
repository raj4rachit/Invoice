import { DeleteOutline, DownloadOutlined } from '@mui/icons-material';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AttachmentDeleteApi, AttachmentListApi } from 'apis/Invoice';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useState } from 'react';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';

const params = {
    invoice_id: 0
};
let colCount = 0;
const AttachmentList = ({ invoiceID, callApi }) => {
    // Download
    const { checkRestriction } = useAuth();
    const [attachmentData, setAttachmentData] = useState([]);
    const [openAttachment, setOpenAttachment] = useState(false);

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
        params.invoice_id = invoiceID;
        getData();
    }, [callApi]);

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
        </>
    );
};

export default AttachmentList;
