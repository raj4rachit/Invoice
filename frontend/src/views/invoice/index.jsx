import { AddCircleOutlineOutlined, FilterAlt } from '@mui/icons-material';
import { Button, ButtonBase, Grid, InputAdornment, MenuItem, OutlinedInput, TextField, Typography, useTheme } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { IconSearch } from '@tabler/icons';
import { InvoiceInitApi } from 'apis/Invoice';
import useAuth from 'hooks/useAuth';
import moment from 'moment';
import { useEffect } from 'react';
import { useTransition } from 'react';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import CommonDialog from 'utils/CommonDialog';
import { apiErrorSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import AddEditInvoice from './AddEditInvoice';
import PrimaryDarkCard from './invoiceCard/PrimaryDarkCard';
import SecondaryDarkCard from './invoiceCard/SecondaryDarkCard';
import InvoiceList from './InvoiceList';

const initialFilter = {
    filterFromDate: null,
    filterToDate: null,
    filterClientID: '0',
    filterInvoiceAmount: '0',
    filterStatus: '0'
};

const Index = () => {
    const theme = useTheme();
    const { checkRestriction, checkCompany, company, recall } = useAuth();
    const [initData, setInitData] = useState({});
    const [invoiceInitData, setInvoiceInitData] = useState({});
    const [search, setSearch] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filter, setFilter] = useState(initialFilter);
    const [openAdd, setOpenAdd] = useState(false);
    const [callApi, setCallApi] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [widgets, setWidgets] = useState({});
    const [, startTransition] = useTransition();

    const handleSearch = (event) => {
        startTransition(() => setSearch(event.target.value));
    };

    const addData = () => {
        if (company.company_id !== '0') {
            InvoiceInitApi({ type: 'add' })
                .then((res) => {
                    if (res.data && res.data.status === 1) {
                        setInvoiceInitData(res.data.data);
                        setOpenAdd((prevState) => !prevState);
                        // apiSuccessSnackBar(res);
                    } else {
                        apiValidationSnackBar(res);
                    }
                })
                .catch((err) => {
                    apiErrorSnackBar(err);
                });
        } else {
            checkCompany();
        }
    };

    const submitHandler = () => {
        setOpenAdd((prevState) => !prevState);
        setCallApi((prevState) => !prevState);
    };

    const openFilter = () => {
        setFilterOpen((prevState) => !prevState);
    };

    const handleFilter = (key, event) => {
        if (key !== 'reset') {
            const newString = event;
            setFilter({ ...filter, [key]: newString });
        } else {
            setFilter({ ...initialFilter });
        }
        setCallApi((prevState) => !prevState);
    };

    /*******************************************************************************
     * Initial api call
     *******************************************************************************/
    useEffect(() => {
        InvoiceInitApi()
            .then((res) => {
                setInitData(res.data.data);
            })
            .catch((err) => console.log(err));
    }, [recall]);

    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item sm={6} xs={12} md={6} lg={4}>
                            <PrimaryDarkCard
                                isLoading={isLoading}
                                title="Total Invoices"
                                count={widgets?.TotalInvoiceCount}
                                amount={widgets?.TotalInvoiceAmount}
                                handleFilter={handleFilter}
                                status={'0'}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12} md={6} lg={4}>
                            <SecondaryDarkCard
                                isLoading={isLoading}
                                title="Partial Paid Invoices"
                                count={widgets?.TotalPartialCount}
                                amount={widgets?.TotalPartialAmount}
                                handleFilter={handleFilter}
                                status={'Partial'}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12} md={6} lg={4}>
                            <PrimaryDarkCard
                                isLoading={isLoading}
                                title="Over Due Invoices"
                                count={widgets?.TotalOverDueCount}
                                amount={widgets?.TotalOverDueAmount}
                                handleFilter={handleFilter}
                                status={'Over Due'}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12} md={6} lg={4}>
                            <SecondaryDarkCard
                                isLoading={isLoading}
                                title="Unpaid Invoices"
                                count={widgets?.TotalUnPaidCount}
                                amount={widgets?.TotalUnPaidAmount}
                                handleFilter={handleFilter}
                                status={'Unpaid'}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12} md={6} lg={4}>
                            <PrimaryDarkCard
                                isLoading={isLoading}
                                title="Paid Invoices"
                                count={widgets?.TotalPaidCount}
                                amount={widgets?.TotalPaidAmount}
                                handleFilter={handleFilter}
                                status={'Paid'}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12} md={6} lg={4}>
                            <SecondaryDarkCard
                                isLoading={isLoading}
                                title="Bad Debt"
                                count={widgets?.TotalBadDeptCount}
                                amount={widgets?.TotalBadDeptAmount}
                                handleFilter={handleFilter}
                                status={'Bad Debt'}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}></Grid>
            </Grid>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item sx={{ flexGrow: 1 }}>
                                    <Typography variant="column">Invoice List</Typography>
                                </Grid>
                                <Grid item>
                                    <ButtonBase
                                        disableRipple
                                        onClick={() => {
                                            openFilter();
                                        }}
                                    >
                                        {JSON.stringify(filter) !== JSON.stringify(initialFilter) ? (
                                            <FilterAlt sx={{ fontWeight: 500, color: 'secondary.dark' }} />
                                        ) : (
                                            <FilterAlt sx={{ fontWeight: 500, color: 'secondary.200' }} />
                                        )}

                                        <Typography variant="h5" sx={{ mt: 0.5 }}>
                                            Filter
                                        </Typography>
                                    </ButtonBase>
                                </Grid>
                                {checkRestriction('CAN_ADD_INVOICE') && (
                                    <Grid item>
                                        <Button variant="contained" onClick={() => addData()}>
                                            <AddCircleOutlineOutlined sx={{ mr: 0.5 }} /> Add Invoice
                                        </Button>
                                    </Grid>
                                )}
                                <Grid item>
                                    <OutlinedInput
                                        id="input-search-list-style1"
                                        placeholder="Search"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <IconSearch stroke={1.5} size="1rem" />
                                            </InputAdornment>
                                        }
                                        size="small"
                                        onChange={handleSearch}
                                        autoComplete="off"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                content={true}
            >
                {filterOpen ? (
                    <Transitions type="grow" in={filterOpen} position="top-left" direction="up">
                        <MainCard
                            content={false}
                            sx={{
                                padding: '20px',
                                background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
                            }}
                        >
                            <Grid container spacing={gridSpacing}>
                                <Grid item md={3} xs={12}>
                                    <LocalizationProvider
                                        dateAdapter={AdapterMoment}
                                        localeText={{ start: 'Start Date', end: 'From Date' }}
                                    >
                                        <DesktopDatePicker
                                            id="from_date"
                                            name="from_date"
                                            label="From date"
                                            maxDate={moment()}
                                            inputFormat="YYYY-MM-DD"
                                            value={filter.filterFromDate}
                                            onChange={(newValue) => {
                                                handleFilter('filterFromDate', moment(newValue).format('YYYY-MM-DD'));
                                            }}
                                            renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <LocalizationProvider
                                        dateAdapter={AdapterMoment}
                                        localeText={{ start: 'Start Date', end: 'From Date' }}
                                    >
                                        <DesktopDatePicker
                                            id="to_date"
                                            name="to_date"
                                            label="To date"
                                            inputFormat="YYYY-MM-DD"
                                            minDate={moment(filter.filterFromDate)}
                                            value={filter.filterToDate}
                                            onChange={(newValue) => {
                                                handleFilter('filterToDate', moment(newValue).format('YYYY-MM-DD'));
                                            }}
                                            disabled={!filter.filterFromDate}
                                            required
                                            renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <TextField
                                        size="small"
                                        label="Client"
                                        fullWidth
                                        id="filterClientID"
                                        select
                                        value={filter.filterClientID}
                                        onChange={(e) => handleFilter('filterClientID', e.target.value)}
                                    >
                                        <MenuItem key={-1} value="0">
                                            All
                                        </MenuItem>
                                        {initData?.clientList.map((val, idx) => (
                                            <MenuItem key={idx} value={val.id} disabled={val.id === '-'}>
                                                {val.client_name} - {val.company_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <TextField
                                        size="small"
                                        label="Status"
                                        fullWidth
                                        id="filterStatus"
                                        select
                                        value={filter.filterStatus}
                                        onChange={(e) => handleFilter('filterStatus', e.target.value)}
                                    >
                                        <MenuItem key={-1} value="0">
                                            All
                                        </MenuItem>
                                        {initData?.paymentStatus.map((val, idx) => (
                                            <MenuItem key={idx} value={val}>
                                                {val}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                {JSON.stringify(filter) !== JSON.stringify(initialFilter) ? (
                                    <Grid item>
                                        <Button variant="outlined" color="primary" onClick={() => handleFilter('reset', undefined)}>
                                            Clear All
                                        </Button>
                                    </Grid>
                                ) : null}
                            </Grid>
                        </MainCard>
                    </Transitions>
                ) : null}

                <InvoiceList
                    search={search}
                    callApi={callApi}
                    initData={initData}
                    filter={filter}
                    setIsLoading={setIsLoading}
                    setWidgets={setWidgets}
                />
            </MainCard>

            {openAdd && (
                <CommonDialog
                    open={openAdd}
                    title="Add Invoice"
                    onClose={() => setOpenAdd((prevState) => !prevState)}
                    id="addInvoice"
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
                    <AddEditInvoice value={invoiceInitData} formId="addInvoice" onSubmit={submitHandler} />
                </CommonDialog>
            )}
        </>
    );
};

export default Index;
