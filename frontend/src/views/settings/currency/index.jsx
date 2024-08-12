import { AddCircleOutlineOutlined as AddCircleOutlineOutlinedIcon } from '@mui/icons-material';
import { Button, Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import useAuth from 'hooks/useAuth';
import { useState, useTransition } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import CommonDialog from 'utils/CommonDialog';
import AddEditCurrency from './AddEditCurrency';
import CurrencyList from './CurrencyList';

const Index = () => {
    const { checkRestriction } = useAuth();
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [callApi, setCallApi] = useState(false);
    const [currencyLocale, setCurrencyLocale] = useState({});
    const [, startTransition] = useTransition();
    const addData = () => {
        setOpenAdd((prevState) => !prevState);
    };
    const handleSearch = (event) => {
        startTransition(() => setSearch(event.target.value));
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
                                    <Typography variant="column">Currency List</Typography>
                                </Grid>
                                {checkRestriction('CAN_ADD_ROLE') && (
                                    <Grid item>
                                        <Button variant="contained" onClick={() => addData()}>
                                            <AddCircleOutlineOutlinedIcon sx={{ mr: 0.5 }} /> Add Currency
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
                <CurrencyList search={search} callApi={callApi} setCurrencyLocale={setCurrencyLocale} currencyLocale={currencyLocale} />
            </MainCard>
            {openAdd && (
                <CommonDialog open={openAdd} title="Add Currency" onClose={() => setOpenAdd((prevState) => !prevState)} id="addCurrency">
                    <AddEditCurrency formId="addCurrency" onSubmit={submitHandler} currencyLocale={currencyLocale} />
                </CommonDialog>
            )}
        </>
    );
};

export default Index;
