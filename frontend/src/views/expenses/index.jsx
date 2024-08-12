import { AddCircleOutlineOutlined, FilterAlt } from '@mui/icons-material';
import { Button, ButtonBase, Grid, InputAdornment, MenuItem, OutlinedInput, TextField, Typography, useTheme } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import useAuth from 'hooks/useAuth';
import { useTransition } from 'react';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import CommonDialog from 'utils/CommonDialog';
import CenterDialog from 'views/utilities/CenterDialog';
import AddEditExpenses from './AddEditExpenses';
import AddExpenses from './AddExpenses';
import ExpensesList from './ExpensesList';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

const initialFilter = {
    filterFromDate: null,
    filterToDate: null,
    filterCompanyID: '0',
    filterCategoryID: '0'
};
const Expenses = () => {
    const theme = useTheme();
    const { checkRestriction } = useAuth();
    const [, startTransition] = useTransition();
    const [search, setSearch] = useState('');
    const [initData, setInitData] = useState({});
    const [filterOpen, setFilterOpen] = useState(false);
    const [filter, setFilter] = useState(initialFilter);
    const [openAdd, setOpenAdd] = useState(false);
    const [callApi, setCallApi] = useState(false);

    const handleSearch = (event) => {
        startTransition(() => setSearch(event.target.value));
    };

    const addData = () => {
        setOpenAdd((prevState) => !prevState);
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

    const submitHandler = () => {
        setOpenAdd((prevState) => !prevState);
        setCallApi((prevState) => !prevState);
    };
    return (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item sx={{ flexGrow: 1 }}>
                                    <Typography variant="column">Expenses List</Typography>
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
                                {checkRestriction('CAN_ADD_EXPENSES') && (
                                    <Grid item>
                                        <Button variant="contained" onClick={() => addData()}>
                                            <AddCircleOutlineOutlined sx={{ mr: 0.5 }} /> Add Expenses
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
                                        label="Company"
                                        fullWidth
                                        id="filterCompanyID"
                                        select
                                        value={filter.filterCompanyID}
                                        onChange={(e) => handleFilter('filterCompanyID', e.target.value)}
                                    >
                                        <MenuItem key={-1} value="0">
                                            All
                                        </MenuItem>
                                        {initData?.companyList.map((val, idx) => (
                                            <MenuItem key={idx} value={val.id}>
                                                {val.company_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <TextField
                                        size="small"
                                        label="Category"
                                        fullWidth
                                        id="filterCategoryID"
                                        select
                                        value={filter.filterCategoryID}
                                        onChange={(e) => handleFilter('filterCategoryID', e.target.value)}
                                    >
                                        <MenuItem key={-10} value="0">
                                            All
                                        </MenuItem>
                                        {initData?.categoryList.map((val, idx) => (
                                            <MenuItem key={idx} value={val.id}>
                                                {val.name}
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
                <ExpensesList search={search} callApi={callApi} filter={filter} setInitData={setInitData} initData={initData} />
            </MainCard>

            {/* {openAdd && (
                <CenterDialog title={`Add Expenses`} open={openAdd} onClose={() => setOpenAdd((prevState) => !prevState)} id="addExpenses">
                    <AddEditExpenses formID="addExpenses" onSubmit={submitHandler} initData={initData} />
                </CenterDialog>
            )} */}
            {openAdd && (
                <CommonDialog title={`Add Expenses`} open={openAdd} onClose={() => setOpenAdd((prevState) => !prevState)} id="addExpenses">
                    <AddExpenses formID="addExpenses" onSubmit={submitHandler} initData={initData} />
                </CommonDialog>
            )}
        </>
    );
};

export default Expenses;
