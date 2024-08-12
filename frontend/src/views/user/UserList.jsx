import propTypes from 'prop-types';
import { DeleteOutline, Edit as EditIcon, LaunchOutlined } from '@mui/icons-material';
import {
    Dialog,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Tooltip
} from '@mui/material';
import { deleteUserApi, userListApi } from 'apis/User';
import { useEffect, useState } from 'react';
import CommonDialog from 'utils/CommonDialog';
import AddEditUser from './AddEditUser';
import DeleteDialog from 'views/utilities/DeleteDialog';
import { apiErrorSnackBar, apiSuccessSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import CustomTooltip from 'views/utilities/CustomTooltip';
import ViewUser from './ViewUser';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
// import useAuth from 'hooks/useAuth';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0,
    employer_id: ''
};
let recordsTotal = 0;
const UserList = ({ search, callApi, setRoleList, roleList, setCompanyList, companyList, employerId }) => {
    // const { checkRestriction } = useAuth();
    const [data, setData] = useState([]); // set UserList in the state
    const [rowData, setRowData] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [roleIds, setRoleIds] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openList, setOpenList] = useState(false);
    const [miniPopupData, setMiniPopupData] = useState([]);

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

    // ========= View ========== //
    const viewData = (itemData) => {
        setRoleIds(roleList.filter((a) => itemData.role_id === a.id));
        setRowData(itemData);
        setOpenView((prevState) => !prevState);
    };

    const ListData = (itemData) => {
        setOpenList(true);
        setMiniPopupData(itemData.selectedCompany);
    };

    // ========= Edit ========== //
    const editData = (itemData) => {
        setOpenEdit((prevState) => !prevState);
        setRowData(itemData);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    // ========= Delete ========== //
    const deleteData = (itemData) => {
        setOpenDelete(true);
        setRowData(itemData);
    };

    const deleteHandler = () => {
        deleteUserApi({ id: rowData.id })
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

    const getData = () => {
        userListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
                setRoleList(res.data.data.roleList);
                setCompanyList(res.data.data.companyList);
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
        params.employer_id = employerId ?? params.employer_id;
        getData();
        // checkRestriction();
    }, [page, rowsPerPage, order, orderBy, search, callApi, employerId]);

    return (
        <>
            <TableContainer>
                <Table>
                    <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow hover key={index}>
                                <TableCell>
                                    {item.first_name + ' ' + item.last_name}
                                    <CustomTooltip
                                        title={`View User`}
                                        Icon={
                                            <IconButton color="inherit" onClick={() => viewData(item)}>
                                                <LaunchOutlined sx={{ p: 0, width: 30 }} fontSize="small" />
                                            </IconButton>
                                        }
                                    />
                                </TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.phone}</TableCell>
                                <TableCell>
                                    <AvatarGroup
                                        max={4}
                                        sx={{
                                            display: 'inline-flex',
                                            '& .MuiAvatar-root': {
                                                width: 30,
                                                height: 30,
                                                fontSize: 12
                                            }
                                        }}
                                        onClick={() => {
                                            ListData(item);
                                        }}
                                    >
                                        {item.selectedCompany.map((i, index) => (
                                            <Tooltip key={index} title={i.company_name}>
                                                <Avatar src={i.company_name} alt={i.company_name} />
                                            </Tooltip>
                                        ))}
                                    </AvatarGroup>
                                </TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell align={'right'}>
                                    {/* {checkRestriction('CAN_EDIT_USER') && ( */}
                                    <IconButton color="primary" component="label" onClick={() => editData(item)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    {/* )}
                                    {checkRestriction('CAN_DELETE_USER') && ( */}
                                    <IconButton color="error" component="label" onClick={() => deleteData(item)}>
                                        <DeleteOutline fontSize="small" />
                                    </IconButton>
                                    {/* )} */}
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

            {openList && (
                <Dialog onClose={() => setOpenList((prevState) => !prevState)} open={openList}>
                    <DialogTitle>Company List</DialogTitle>
                    <Divider />
                    <List sx={{ pt: 0 }}>
                        {miniPopupData.map((item, idx) => (
                            <ListItem key={idx}>
                                {/* <ListItem button onClick={() => handleListItemClick(i)} key={i}> */}
                                <ListItemAvatar>
                                    <Avatar
                                        src={item.company_name}
                                        alt={item.company_name}
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            border: '2px solid'
                                        }}
                                    />
                                </ListItemAvatar>
                                <ListItemText sx={{ marginLeft: 2 }} primary={item.company_name} />
                            </ListItem>
                        ))}
                    </List>
                </Dialog>
            )}

            {openView && (
                <CommonDialog
                    open={openView}
                    title={rowData['first_name'] + ' ' + rowData['last_name']}
                    onClose={() => setOpenView((prevState) => !prevState)}
                    saveButton={true}
                >
                    <ViewUser data={rowData} roleIds={roleIds} />
                </CommonDialog>
            )}

            {openEdit && (
                <CommonDialog
                    open={openEdit}
                    title="Edit User"
                    onClose={() => setOpenEdit((prevState) => !prevState)}
                    id="editUser"
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
                    <AddEditUser formId="editUser" value={rowData} onSubmit={submitHandler} roleList={roleList} companyList={companyList} />
                </CommonDialog>
            )}

            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="User"
                    name={rowData['first_name'] + ' ' + rowData['last_name']}
                />
            )}
        </>
    );
};

UserList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    setRoleList: propTypes.func,
    roleList: propTypes.array,
    setCompanyList: propTypes.func,
    companyList: propTypes.array,
    employerId: propTypes.string
};

export default UserList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="first_name">
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="Email">
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Email
                    </TableSortLabel>
                </TableCell>
                <TableCell key="phone">Mobile Number</TableCell>
                <TableCell key="company">Company</TableCell>
                <TableCell key="status">Status</TableCell>
                <TableCell align="right">Action</TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    order: propTypes.string,
    orderBy: propTypes.string,
    onRequestSort: propTypes.func
};
