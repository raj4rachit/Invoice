import PropTypes from 'prop-types';

// material-ui
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import InvoiceChartSkeleton from './Skeleton/InvoiceChartSkeleton';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const InvoiceChart = ({ isLoading, chartDataObj, setCurrencyData, currencyData, currencyList, setCurrencyStatus }) => {
    const chartData = chartDataObj ?? false;

    return (
        <>
            {isLoading ? (
                <InvoiceChartSkeleton />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="h3">Yearly Invoice Chart</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    {/* <Typography variant="h3">$2,324.00</Typography> */}
                                    <FormControl size="small" fullWidth>
                                        {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={currencyData.id}
                                            // label="Age"
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                const index = currencyList.findIndex((a) => a.id === id);
                                                const action = currencyList[index].action;
                                                setCurrencyData({
                                                    id: id,
                                                    action: action
                                                });
                                                setCurrencyStatus((prev) => !prev);
                                            }}
                                        >
                                            {currencyList.map((i, idx) => (
                                                <MenuItem value={i.id} key={idx}>
                                                    {i.short_code}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart {...chartData} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

InvoiceChart.propTypes = {
    isLoading: PropTypes.bool,
    chartDataObj: PropTypes.object,
    callApi: PropTypes.bool,
    setCurrencyData: PropTypes.func,
    currencyData: PropTypes.object,
    currencyList: PropTypes.array,
    setCurrencyStatus: PropTypes.func
};

export default InvoiceChart;
