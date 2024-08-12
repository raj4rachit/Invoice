import { AddCircleOutlineOutlined, FilterAlt } from '@mui/icons-material';
import { Button, ButtonBase, Grid, InputAdornment, OutlinedInput, TextField, Typography, useTheme } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { IconSearch } from '@tabler/icons';
import { viewCompanyApi } from 'apis/Company';
import useAuth from 'hooks/useAuth';
import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import CommonDialog from 'utils/CommonDialog';
import { apiErrorSnackBar } from 'utils/SnackBar';
import AddEditCompany from './AddEditCompany';
import CompanyList from './CompanyList';

const initialFilter = {
    filterFromDate: null,
    filterToDate: null
};
const Index = () => {
    const theme = useTheme();
    const { checkRestriction } = useAuth();
    const [search, setSearch] = useState('');
    const [initData, setInitData] = useState({});
    const [filterOpen, setFilterOpen] = useState(false);
    const [filter, setFilter] = useState(initialFilter);
    const [openAdd, setOpenAdd] = useState(false);
    const [callApi, setCallApi] = useState(false);

    const handleSearch = (event) => {
        setSearch(event.target.value);
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

    useEffect(() => {
        viewCompanyApi()
            .then((res) => {
                setInitData(res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    }, []);

    return (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item sx={{ flexGrow: 1 }}>
                                    <Typography variant="column">Company List</Typography>
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
                                {checkRestriction('CAN_ADD_COMPANY') && (
                                    <Grid item>
                                        <Button variant="contained" onClick={() => addData()}>
                                            <AddCircleOutlineOutlined sx={{ mr: 0.5 }} /> Add Company
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
                                <LocalizationProvider dateAdapter={AdapterMoment} localeText={{ start: 'Start Date', end: 'From Date' }}>
                                    <Grid item md={3} xs={12}>
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
                                    </Grid>
                                    <Grid item md={3} xs={12}>
                                        <DesktopDatePicker
                                            id="to_date"
                                            name="to_date"
                                            label="To date"
                                            inputFormat="YYYY-MM-DD"
                                            minDate={moment(filter.filterFromDate)}
                                            value={filter.filterToDate ?? filter.filterFromDate}
                                            onChange={(newValue) => {
                                                handleFilter('filterToDate', moment(newValue).format('YYYY-MM-DD'));
                                            }}
                                            disabled={!filter.filterFromDate}
                                            required
                                            renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                                        />
                                    </Grid>
                                </LocalizationProvider>
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
                <CompanyList search={search} callApi={callApi} filter={filter} initData={initData} />
            </MainCard>

            {openAdd && (
                <CommonDialog
                    open={openAdd}
                    title="Add Company"
                    onClose={() => setOpenAdd((prevState) => !prevState)}
                    id="addCompany"
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
                    <AddEditCompany formId="addCompany" onSubmit={submitHandler} initData={initData} />
                </CommonDialog>
            )}
        </>
    );
};

export default Index;
