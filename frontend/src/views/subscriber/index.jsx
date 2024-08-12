import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Button, Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import CommonDialog from 'utils/CommonDialog';
import AddEditSubscriber from './AddEditSubscriber';
import SubscriberList from './SubscriberList';

const Index = () => {
    const { checkRestriction } = useAuth();
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [callApi, setCallApi] = useState(false);
    const [subscriberCountryList, setSubscriberCountryList] = useState([]);
    const [subscriberCurrencyList, setSubscriberCurrencyList] = useState([]);

    // ========== SearchBar ========== //

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    // ========== Add Button ========== //

    const addData = () => {
        setOpenAdd((prevState) => !prevState);
    };

    // ========== Submit ========== //

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
                                    <Typography variant="column">Subscriber List</Typography>
                                </Grid>
                                {checkRestriction('CAN_ADD_SUBSCRIBER') && (
                                    <Grid item>
                                        <Button variant="contained" onClick={() => addData()}>
                                            <AddCircleOutlineOutlined sx={{ mr: 0.5 }} /> Add Subscriber
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
                <SubscriberList
                    search={search}
                    callApi={callApi}
                    subscriberCountryList={subscriberCountryList}
                    setSubscriberCountryList={setSubscriberCountryList}
                    subscriberCurrencyList={subscriberCurrencyList}
                    setSubscriberCurrencyList={setSubscriberCurrencyList}
                />
            </MainCard>

            {openAdd && (
                <CommonDialog
                    open={openAdd}
                    title="Add Subscriber"
                    onClose={() => setOpenAdd((prevState) => !prevState)}
                    id="addSubscriber"
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
                    <AddEditSubscriber
                        subscriberCountryList={subscriberCountryList}
                        subscriberCurrencyList={subscriberCurrencyList}
                        formId="addSubscriber"
                        onSubmit={submitHandler}
                    />
                </CommonDialog>
            )}
        </>
    );
};

export default Index;
