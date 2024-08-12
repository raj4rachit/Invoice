import { DeleteOutline, Edit as EditIcon } from '@mui/icons-material';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { deleteRestrictionApi, restrictionListApi } from 'apis/Restriction';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import CommonDialog from 'utils/CommonDialog';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import DeleteDialog from 'views/utilities/DeleteDialog';
import AddEditRestriction from './AddEditRestriction';

const columns = [
    { id: 'name', label: 'Name', align: 'left', width: '30%' },
    { id: 'slug', label: 'Slug', align: 'left', width: '30%' },
    { id: 'permissions', label: 'Permissions', align: 'left', width: '20%' },
    { id: 'action', label: 'Action', align: 'right', width: '20%' }
];
const params = {
    search: '',
    permission_id: '0',
    orderColumn: 1,
    displayLength: 10,
    displayStart: 0
};
let recordsTotal = 0;
const RestrictionList = ({ search, permissionFilter, callApi, setPermissionData, permissionData }) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [restrictionData, setRestrictionData] = useState({});

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    const editData = (row) => {
        setOpenEdit((prevState) => !prevState);
        setRestrictionData(row);
    };

    const deleteData = (row) => {
        setOpenDelete(true);
        setRestrictionData(row);
    };

    const deleteHandler = () => {
        deleteRestrictionApi({ id: restrictionData.id })
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

    // GetRestriction Data
    const getData = async () => {
        await restrictionListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setPermissionData(res.data.data.permissionList);
                setData(res.data.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    useEffect(() => {
        params.search = search;
        params.permission_id = permissionFilter;
        params.orderColumn = 0;
        params.displayLength = rowsPerPage;
        params.displayStart = rowsPerPage * page;
        getData();
    }, [search, permissionFilter, callApi, page, rowsPerPage]);

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ width: column.width }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow hover role="checkbox" key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.slug}</TableCell>
                                <TableCell>{item.permission_name}</TableCell>
                                <TableCell align={'right'}>
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

            {openEdit && (
                <CommonDialog
                    open={openEdit}
                    title="Edit Restriction"
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editRestriction"
                >
                    <AddEditRestriction
                        value={restrictionData}
                        formId="editRestriction"
                        onSubmit={submitHandler}
                        permissions={permissionData}
                    />
                </CommonDialog>
            )}

            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Restriction"
                    name={restrictionData['name']}
                />
            )}
        </>
    );
};

RestrictionList.propTypes = {
    search: propTypes.string,
    permissionFilter: propTypes.string,
    callApi: propTypes.bool,
    setPermissionData: propTypes.func,
    permissionData: propTypes.array
};

export default RestrictionList;
