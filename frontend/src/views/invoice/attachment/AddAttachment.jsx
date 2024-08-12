import { Box, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { AddAttachmentApi, AttachmentINITApi } from 'apis/Invoice';
import { useFormik } from 'formik';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import Required from 'views/utilities/Required';

// third party
import * as yup from 'yup';
const validationSchema = yup.object().shape({
    // file_name: yup.string().required('File name is required.'),
    // attachment_file: yup
    //     .mixed()
    //     .nullable()
    //     .test(2000000, 'File size is too big put under 2 MB', (value) => !value || (value && value.size <= 2000000))
    //     .required('File is required'),
    // doc_type: yup.string().required('Document type is required.'),
    invoice_id: yup.string().required('Invoice ID is required.'),

    files: yup.array().of(
        yup.object().shape({
            file_name: yup.string().required('File name is required.'),
            doc_type: yup.string().required('Document type is required.'),
            attachment_file: yup
                .mixed()
                .nullable()
                .test(2000000, 'File size is too big put under 2 MB', (value) => !value || (value && value.size <= 2000000))
                .required('File is required')
        })
    )
});

const AddAttachment = ({ attNo, formID, onSubmit, invoiceID }) => {
    const count = attNo + 1;
    const [docType, setDocType] = useState([]);
    // const docName = 'document_' + (attNo + 1);
    const formik = useFormik({
        initialValues: {
            // file_name: docName,
            // attachment_file: '',
            // doc_type: '',
            attachment_files: '',
            files: [],
            invoice_id: invoiceID
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            AddAttachmentApi(values)
                .then((res) => {
                    if (res.data && res.data.status === 1) {
                        if (onSubmit) onSubmit();
                        apiSuccessSnackBar(res);
                    } else {
                        apiValidationSnackBar(res);
                    }
                })
                .catch((err) => {
                    apiErrorSnackBar(err);
                });
        }
    });

    useEffect(() => {
        AttachmentINITApi()
            .then((res) => {
                setDocType(res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    }, []);

    // CheckTouchValidation
    const checkTouchValidation = (filedName, index, columnName) => {
        if (formik.touched[filedName] && formik.touched[filedName][index] && formik.touched[filedName][index][columnName]) {
            if (formik.errors[filedName] && formik.errors[filedName][index] && formik.errors[filedName][index][columnName]) {
                return formik.touched[filedName][index][columnName] && Boolean(formik.errors[filedName][index][columnName]);
            }
            return false;
        }
        return false;
    };

    const checkErrorValidation = (filedName, index, columnName) => {
        if (formik.touched[filedName] && formik.touched[filedName][index] && formik.touched[filedName][index][columnName]) {
            if (formik.errors[filedName] && formik.errors[filedName][index] && formik.errors[filedName][index][columnName]) {
                return formik.touched[filedName][index][columnName] && formik.errors[filedName][index][columnName];
            }
            return '';
        }
        return '';
    };

    return (
        <Box>
            <form id={formID} onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    fullWidth
                                    type="file"
                                    size="small"
                                    id="attachment_files"
                                    name="attachment_files"
                                    label={<Required title="File" />}
                                    onChange={(e) => {
                                        let file = e.target.files;
                                        formik.setFieldValue('attachment_files', file);
                                        const objArray = [];
                                        Object.keys(file).map((i, idx) => {
                                            objArray.push({
                                                file_name: 'document_' + (count + idx),
                                                doc_type: '',
                                                attachment_file: file[i]
                                            });
                                        });
                                        formik.setFieldValue('files', objArray);
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        inputProps: {
                                            accept: '.jpeg,.jpg,.png,.webp,.docx,.docs,.txt,.xls,.xlsx,.pdf',
                                            multiple: true
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {formik.values.files.map((i, idx) => (
                        <Grid item xs={12} key={idx}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl size="small" fullWidth error={checkTouchValidation('files', idx, 'doc_type')}>
                                        <InputLabel id="docTypeLabel">
                                            <Required title="Document Type" />
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="docTypeLabel"
                                            id={`files.${idx}.doc_type`}
                                            name={`files.${idx}.doc_type`}
                                            // name="doc_type"
                                            label={<Required title="Document Type" />}
                                            value={formik.values.files[idx].doc_type}
                                            onChange={formik.handleChange}
                                        >
                                            {docType.map((i, idx) => (
                                                <MenuItem value={i.id} key={idx}>
                                                    {i.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{checkErrorValidation('files', idx, 'doc_type')}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id={`files.${idx}.file_name`}
                                        name={`files.${idx}.file_name`}
                                        label={<Required title="File Name" />}
                                        value={formik.values.files[idx].file_name}
                                        onChange={formik.handleChange}
                                        error={checkTouchValidation('files', idx, 'file_name')}
                                        helperText={checkErrorValidation('files', idx, 'file_name')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle1">{i.attachment_file.name}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}></Grid>
                    </Grid>
                    {/* <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                type="file"
                                size="small"
                                id="attachment_file"
                                name="attachment_file"
                                label={<Required title="File" />}
                                onChange={(e) => {
                                    let file = e.target.files[0];
                                    formik.setFieldValue('attachment_file', file);
                                }}
                                error={formik.touched.attachment_file && Boolean(formik.errors.attachment_file)}
                                helperText={formik.touched.attachment_file && formik.errors.attachment_file}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    inputProps: {
                                        accept: '.jpeg,.jpg,.png,.webp,.docx,.docs,.txt,.xls,.xlsx,.pdf'
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid> */}
                </Grid>
            </form>
        </Box>
    );
};

AddAttachment.propTypes = {
    attNo: propTypes.number,
    formID: propTypes.string,
    onSubmit: propTypes.func,
    invoiceID: propTypes.any
};

export default AddAttachment;
