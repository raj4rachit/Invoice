import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Button, Grid, InputAdornment, OutlinedInput } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import { InitPaymentApi } from 'apis/Invoice';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { apiErrorSnackBar } from 'utils/SnackBar';
import CenterDialog from 'views/utilities/CenterDialog';
import AddEditPayment from './AddEditPayment';
import PaymentList from './PaymentList';

const Index = ({ invoiceID }) => {
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [callApi, setCallApi] = useState(false);
    const [invoiceData, setInvoiceData] = useState({});
    const [currencyRateData, setCurrencyRate] = useState({});

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const addData = () => {
        InitPaymentApi({ type: 'add', invoice_id: invoiceID })
            .then((res) => {
                setInvoiceData(res.data.data.invoiceData);
                setCurrencyRate(res.data.data.currency_rate);
                setOpenAdd((prevState) => !prevState);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
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
                                    {/* <Typography variant="column">Payment List</Typography> */}
                                </Grid>

                                <Grid item>
                                    <Button variant="contained" onClick={() => addData()}>
                                        <AddCircleOutlineOutlined sx={{ mr: 0.5 }} /> Add Payment
                                    </Button>
                                </Grid>
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
                <PaymentList search={search} invoiceID={invoiceID} callApi={callApi} />
            </MainCard>

            {/* Invoice Payment */}
            {openAdd && (
                <CenterDialog
                    title={`Add Invoice Payment`}
                    open={openAdd}
                    onClose={() => setOpenAdd((prevState) => !prevState)}
                    id="addPayment"
                    sx={{
                        '&>div:nth-of-type(3)': {
                            '&>div': {
                                minWidth: { md: '40%', xs: '90%' }
                            }
                        }
                    }}
                >
                    <AddEditPayment
                        formId="addPayment"
                        invoiceData={invoiceData}
                        currencyRateData={currencyRateData}
                        onSubmit={submitHandler}
                    />
                </CenterDialog>
            )}
        </>
    );
};

export default Index;
