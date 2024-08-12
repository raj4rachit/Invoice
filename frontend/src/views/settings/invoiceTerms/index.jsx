import { AddCircleOutlineOutlined, FilterAlt } from '@mui/icons-material';
import { Button, ButtonBase, Grid, InputAdornment, MenuItem, OutlinedInput, TextField, Typography, useTheme } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import CommonDialog from 'utils/CommonDialog';
import AddEditInvoiceTerm from './AddEditInvoiceTerm';
import InvoiceTermList from './InvoiceTermList';

const initialFilter = {
    company_id: 0
};

const Index = () => {
    const { checkRestriction } = useAuth();
    const theme = useTheme();
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [callApi, setCallApi] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [filter, setFilter] = useState(initialFilter);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const addData = () => {
        setOpenAdd((prevState) => !prevState);
    };

    const submitHandler = () => {
        setOpenAdd((prevState) => !prevState);
        setCallApi((prevState) => !prevState);
    };

    const openFilter = () => {
        setFilterOpen((prevState) => !prevState);
    };

    const handleFilter = async (key, event) => {
        if (key !== 'reset') {
            const newString = event?.target.value;
            setFilter({ ...filter, [key]: newString });
        } else {
            setFilter({ ...initialFilter });
        }
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
                                    <Typography variant="column">Invoice Terms List</Typography>
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
                                {checkRestriction('CAN_ADD_TERMS') && (
                                    <Grid item>
                                        <Button variant="contained" onClick={() => addData()}>
                                            <AddCircleOutlineOutlined sx={{ mr: 0.5 }} /> Add Invoice Term
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
                                    <TextField
                                        size="small"
                                        label="Company"
                                        fullWidth
                                        id="company_id"
                                        select
                                        value={filter.company_id}
                                        onChange={(e) => handleFilter('company_id', e)}
                                    >
                                        <MenuItem key={-1} value="0">
                                            All
                                        </MenuItem>
                                        {companyList.map((val, idx) => (
                                            <MenuItem key={idx} value={val.id}>
                                                {val.company_name}
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
                <InvoiceTermList
                    search={search}
                    callApi={callApi}
                    filter={filter}
                    setCompanyList={setCompanyList}
                    companyList={companyList}
                />
            </MainCard>
            {openAdd && (
                <CommonDialog
                    open={openAdd}
                    title="Add Invoice Term"
                    onClose={() => setOpenAdd((prevState) => !prevState)}
                    id="addInvoiceTerm"
                >
                    <AddEditInvoiceTerm formID="addInvoiceTerm" onSubmit={submitHandler} companyList={companyList} />
                </CommonDialog>
            )}
        </>
    );
};

export default Index;
