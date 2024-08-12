import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { DashboardApi } from 'apis/Dashboard';
import useAuth from 'hooks/useAuth';
import DashboardInvoiceList from './DashboardInvoiceList';
import AmountCard from './AmountCard';
import InvoiceChart from './InvoiceChart';
import IncomeExpenseCard from './IncomeExpenseCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const initApiData = {
    chartData: {},
    yearData: {},
    monthData: {},
    incomeExpense: [],
    currencyList: []
};

const params = {
    id: 0,
    action: 'subscriber'
};

const SubscriberDashboard = () => {
    const { recall } = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [callApi, setCallApi] = useState(true);
    const [currencyStatus, setCurrencyStatus] = useState(true);
    const [currencyData, setCurrencyData] = useState({});

    useEffect(() => {
        params.id = currencyData.id;
        params.action = currencyData.action;

        DashboardApi(params)
            .then((res) => {
                initApiData.currencyList = res.data.data.currencyList;
                initApiData.yearData = res.data.data.yearCard;
                initApiData.monthData = res.data.data.monthCard;
                initApiData.incomeExpense = res.data.data.income_expense;

                initApiData.chartData = {
                    // height: 582,
                    height: 630,
                    type: 'line',
                    options: {
                        chart: {
                            id: 'bar-chart',
                            stacked: true,
                            toolbar: {
                                show: false
                            },
                            zoom: {
                                enabled: false
                            }
                        },
                        stroke: {
                            curve: 'smooth',
                            width: [0, 0, 0, 0, 0, 3]
                        },
                        responsive: [
                            {
                                breakpoint: 582,
                                options: {
                                    legend: {
                                        position: 'bottom',
                                        offsetX: -10,
                                        offsetY: 0
                                    }
                                }
                            }
                        ],
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                columnWidth: '50%'
                            }
                        },
                        xaxis: {
                            type: 'category',
                            categories: res.data.data.chartData.month
                        },
                        legend: {
                            show: true,
                            fontSize: '14px',
                            fontFamily: `'Roboto', sans-serif`,
                            position: 'bottom',
                            offsetX: 20,
                            labels: {
                                useSeriesColors: false
                            },
                            markers: {
                                width: 16,
                                height: 16,
                                radius: 5
                            },
                            itemMargin: {
                                horizontal: 15,
                                vertical: 8
                            }
                        },
                        fill: {
                            type: 'solid'
                        },
                        dataLabels: {
                            enabled: false
                        },
                        grid: {
                            show: true
                        }
                    },
                    series: res.data.data.chartData.series.map((MData) => ({
                        ...MData,
                        data: MData.data.map((dataPoint) => parseInt(dataPoint))
                    }))
                };
                setCurrencyData(res.data.data.currencyData);
                setCallApi((prevState) => !prevState);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [recall, currencyStatus]);
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <InvoiceChart
                            isLoading={isLoading}
                            chartDataObj={initApiData.chartData}
                            setCurrencyData={setCurrencyData}
                            currencyData={currencyData}
                            currencyList={initApiData.currencyList}
                            setCurrencyStatus={setCurrencyStatus}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <AmountCard
                            isLoading={isLoading}
                            yearData={initApiData.yearData}
                            monthData={initApiData.monthData}
                            callApi={callApi}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DashboardInvoiceList isLoading={isLoading} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <IncomeExpenseCard isLoading={isLoading} data={initApiData.incomeExpense} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SubscriberDashboard;
