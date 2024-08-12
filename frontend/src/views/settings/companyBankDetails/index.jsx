import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Button, Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import useAuth from 'hooks/useAuth';
import { useTransition } from 'react';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import CommonDialog from 'utils/CommonDialog';
import AddEditBankDetails from './AddEditBankDetails';
import BankDetailsList from './BankDetailsList';

const initialFilter = {
    filterCompanyID: '0'
};

const Index = () => {
    const { checkRestriction } = useAuth();
    const [, startTransition] = useTransition();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(initialFilter);
    const [initData, setInitData] = useState({});
    const [openAdd, setOpenAdd] = useState(false);
    const [callApi, setCallApi] = useState(false);

    const handleSearch = (event) => {
        startTransition(() => setSearch(event.target.value));
    };

    const addData = () => {
        setOpenAdd((prevState) => !prevState);
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
                                    <Typography variant="column">Company Bank List</Typography>
                                </Grid>
                                {checkRestriction('CAN_ADD_COMPANY_BANK_DETAILS') && (
                                    <Grid item>
                                        <Button variant="contained" onClick={() => addData()}>
                                            <AddCircleOutlineOutlined sx={{ mr: 0.5 }} /> Add Bank Details
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
                <BankDetailsList search={search} callApi={callApi} filter={filter} setInitData={setInitData} initData={initData} />
            </MainCard>

            {openAdd && (
                <CommonDialog
                    open={openAdd}
                    title="Add Company Bank Detail"
                    onClose={() => setOpenAdd((prevState) => !prevState)}
                    id="addBankDetails"
                    sx={{
                        '& .MuiDialog-container ': {
                            justifyContent: 'flex-end',
                            '& .MuiPaper-root': {
                                m: 0,
                                p: 0,
                                borderRadius: '0px',
                                minWidth: { sm: '45%', xs: '100%' },
                                minHeight: '100%'
                            }
                        }
                    }}
                >
                    <AddEditBankDetails formID="addBankDetails" onSubmit={submitHandler} initData={initData} />
                </CommonDialog>
            )}
        </>
    );
};

export default Index;
