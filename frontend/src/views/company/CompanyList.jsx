import propTypes from 'prop-types';
import {
    IconButton,
    MenuItem,
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
import CommonDialog from 'utils/CommonDialog';
import AddEditCompany from './AddEditCompany';
import { companyListApi, deleteCompanyApi } from 'apis/Company';
import Operations from 'views/utilities/Operations';
import CustomTooltip from 'views/utilities/CustomTooltip';
import { LaunchOutlined } from '@mui/icons-material';
import ViewCompany from './ViewCompany';
import EditCompanySetting from './EditCompanySetting';
import CenterDialog from 'views/utilities/CenterDialog';
import EmailConfiguration from './EmailConfiguration';
import useAuth from 'hooks/useAuth';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0,
    from_date: null,
    to_date: null
};

let recordsTotal = 0;

const CompanyList = ({ search, callApi, filter, initData }) => {
    // ========== State Management ========== //
    const { checkRestriction } = useAuth();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openSetting, setOpenSetting] = useState(false);
    const [settingData, setSettingData] = useState({});
    const [openEmailConfig, setOpenEmailConfig] = useState(false);
    const [emailConfigData, setEmailConfigData] = useState({});
    const [companyData, setCompanyData] = useState({});

    // ========== Delete ========== //
    const deleteData = (row) => {
        setOpenDelete(true);
        setCompanyData(row);
    };

    const deleteHandler = () => {
        deleteCompanyApi({ id: companyData.id })
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

    // ========== view ========== //
    const viewData = (itemData) => {
        setCompanyData(itemData);
        setOpenView((prevState) => !prevState);
    };

    // ========== Edit ========== //
    const editData = (row) => {
        setOpenEdit((prevState) => !prevState);
        setCompanyData(row);
    };

    const submitHandler = () => {
        setOpenEdit((prevState) => !prevState);
        getData();
    };

    // ========== company Setting ======== //

    const companySettingData = (item) => {
        setOpenSetting((prevState) => !prevState);
        setSettingData(item);
    };

    const settingSubmitHandler = () => {
        setOpenSetting((prevState) => !prevState);
        getData();
    };

    // ========== email Config ======== //

    const emailConfigurationData = (item) => {
        setOpenEmailConfig((prevState) => !prevState);
        setEmailConfigData(item);
    };

    const emailSubmitHandler = () => {
        setOpenEmailConfig((prevState) => !prevState);
        getData();
    };

    // ========== Data Supplier ========== //
    const getData = () => {
        companyListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
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
        params.from_date = filter.filterFromDate;
        params.to_date = filter.filterToDate ?? filter.filterFromDate;

        getData();
    }, [page, rowsPerPage, order, orderBy, search, callApi, filter]);

    return (
        <>
            <TableContainer>
                <Table>
                    <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>
                        {data.map((item, Index) => (
                            <TableRow key={Index}>
                                <TableCell align="left">
                                    {item.company_name}
                                    <CustomTooltip
                                        title={`View Company`}
                                        Icon={
                                            <IconButton color="inherit" sx={{ p: '0 5px' }} onClick={() => viewData(item)}>
                                                <LaunchOutlined sx={{ p: 0, width: 30 }} color="inherit" fontSize="small" />
                                            </IconButton>
                                        }
                                    />
                                </TableCell>
                                <TableCell align="left">{item.enroll_date}</TableCell>
                                <TableCell align="left">{item.trading_name}</TableCell>
                                <TableCell align="left">{item.email}</TableCell>
                                <TableCell align="left">{item.contact_number}</TableCell>
                                <TableCell align="left">{item.country_name}</TableCell>
                                <TableCell align="left">{item.status}</TableCell>
                                <TableCell align="right">
                                    <Operations>
                                        {checkRestriction('CAN_EDIT_COMPANY') && <MenuItem onClick={() => editData(item)}>Edit</MenuItem>}
                                        {checkRestriction('CAN_DELETE_COMPANY') && (
                                            <MenuItem onClick={() => deleteData(item)}>Delete</MenuItem>
                                        )}
                                        {checkRestriction('CAN_COMPANY_SETTING') && (
                                            <MenuItem onClick={() => companySettingData(item)}>Setting</MenuItem>
                                        )}
                                        {checkRestriction('CAN_COMPANY_EMAIL_CONFIGURATION') && (
                                            <MenuItem onClick={() => emailConfigurationData(item)}>Email Config</MenuItem>
                                        )}
                                    </Operations>
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

            {openView && (
                <CommonDialog
                    open={openView}
                    title={companyData['company_name']}
                    onClose={() => setOpenView((prevState) => !prevState)}
                    saveButton={true}
                >
                    <ViewCompany data={companyData} />
                </CommonDialog>
            )}

            {openEdit && (
                <CommonDialog open={openEdit} title="Edit Company" onClose={() => setOpenEdit((prevState) => !prevState)} id="editCompany">
                    <AddEditCompany value={companyData} formId="editCompany" onSubmit={submitHandler} initData={initData} />
                </CommonDialog>
            )}

            {openDelete && (
                <DeleteDialog
                    onDeleteHandler={deleteHandler}
                    onClose={() => setOpenDelete(false)}
                    open={openDelete}
                    dept="Company"
                    name={companyData['company_name']}
                />
            )}

            {openSetting && (
                <CenterDialog
                    title={`Edit Company Setting - ${settingData.company_name} `}
                    open={openSetting}
                    onClose={() => setOpenSetting((prevState) => !prevState)}
                    id="editCompanySetting"
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
                    <EditCompanySetting
                        value={settingData}
                        formID="editCompanySetting"
                        onSubmit={settingSubmitHandler}
                        initData={initData}
                    />
                </CenterDialog>
            )}

            {openEmailConfig && (
                <CenterDialog
                    title={`Email Configuration - ${emailConfigData.company_name} `}
                    open={openEmailConfig}
                    onClose={() => setOpenEmailConfig((prevState) => !prevState)}
                    id="emailConfig"
                >
                    <EmailConfiguration value={emailConfigData} formID="emailConfig" onSubmit={emailSubmitHandler} initData={initData} />
                </CenterDialog>
            )}
        </>
    );
};

// ========== PropTypes ========== //

CompanyList.propTypes = {
    search: propTypes.string,
    callApi: propTypes.bool,
    filter: propTypes.object,
    initData: propTypes.object
};

export default CompanyList;

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell key="name" sx={{ width: '20%' }}>
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="enroll_date" sx={{ width: '10%' }}>
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Enroll Date
                    </TableSortLabel>
                </TableCell>
                <TableCell key="trading_name" sx={{ width: '15%' }}>
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        Trading Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="email" sx={{ width: '20%' }}>
                    <TableSortLabel active={orderBy === '3'} direction={orderBy === '3' ? order : 'asc'} onClick={createSortHandler('3')}>
                        Email
                    </TableSortLabel>
                </TableCell>
                <TableCell key="phone" sx={{ width: '10%' }}>
                    <TableSortLabel active={orderBy === '4'} direction={orderBy === '4' ? order : 'asc'} onClick={createSortHandler('4')}>
                        Phone No.
                    </TableSortLabel>
                </TableCell>
                <TableCell key="country" sx={{ width: '10%' }}>
                    <TableSortLabel active={orderBy === '5'} direction={orderBy === '5' ? order : 'asc'} onClick={createSortHandler('5')}>
                        Country
                    </TableSortLabel>
                </TableCell>
                <TableCell key="status" sx={{ width: '7%' }}>
                    <TableSortLabel active={orderBy === '6'} direction={orderBy === '6' ? order : 'asc'} onClick={createSortHandler('6')}>
                        Status
                    </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ width: '8%' }}>
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
