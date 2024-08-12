import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { CalendarMonthTwoTone } from '@mui/icons-material';
import DateRangePicker from 'react-bootstrap-daterangepicker';
// import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { useEffect } from 'react';
import { CardDataByDateApi } from 'apis/Dashboard';
import moment from 'moment';
import { useSelector } from 'react-redux';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading, yearData, monthData, callApi }) => {
    const theme = useTheme();
    const [monthName, setMonthName] = useState(moment().format('MMMM'));
    const [month, setMonth] = useState({});
    const [year, setYear] = useState({});
    const cart = useSelector((state) => state.account);
    const displayYear =
        cart.company.company_id === '0'
            ? `${moment(cart.company.start_date).format('YYYY')} - ${moment(cart.company.end_date).format('YYYY')}`
            : `${cart.company.financial_year_name}`;
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        setMonth(monthData);
        setYear(yearData);
    }, [isLoading, callApi]);

    const changeHandler = (objData) => {
        CardDataByDateApi(objData)
            .then((res) => {
                setMonth(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <DateRangePicker
                                            initialSettings={{
                                                startDate: moment().startOf('month').format('MM/DD/YYYY'),
                                                endDate: moment().endOf('month').format('MM/DD/YYYY')
                                            }}
                                            onApply={(event, picker) => {
                                                const obj = {
                                                    startDate: moment(picker.startDate).format('YYYY-MM-DD'),
                                                    endDate: moment(picker.endDate).format('YYYY-MM-DD')
                                                };
                                                setMonthName(`${obj.startDate}  to  ${obj.endDate}`);
                                                changeHandler(obj);
                                            }}
                                        >
                                            <CalendarMonthTwoTone />
                                        </DateRangePicker>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h4">{monthName}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container direction="column">
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1" color="inherit">
                                                    Invoice
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="inherit">
                                                            {month && month.InvoiceCount !== null ? month.InvoiceCount : 0}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {displayYear}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {year && year.InvoiceCount !== null ? year.InvoiceCount : 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 1.5 }} />
                                <Grid container direction="column">
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1" color="inherit">
                                                    Sales
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="inherit">
                                                            {month && month.TotalSales !== null ? month.TotalSales : 0}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {displayYear}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {year && year.TotalSales !== null ? year.TotalSales : 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 1.5 }} />
                                <Grid container direction="column">
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1" color="inherit">
                                                    TAX/GST/VAT
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="inherit">
                                                            {month && month.TotalTax !== null ? month.TotalTax : 0}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {displayYear}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {year && year.TotalTax !== null ? year.TotalTax : 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 1.5 }} />
                                <Grid container direction="column">
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1" color="inherit">
                                                    TDS
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="inherit">
                                                            {month && month.Tds !== null ? month.Tds : 0}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {displayYear}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {year && year.Tds !== null ? year.Tds : 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 1.5 }} />
                                <Grid container direction="column">
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1" color="inherit">
                                                    Received
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="inherit">
                                                            {month && month.Received !== null ? month.Received : 0}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {displayYear}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {year && year.Received !== null ? year.Received : 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* Demo */}
                                <Divider sx={{ my: 1.5 }} />
                                <Grid container direction="column">
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1" color="inherit">
                                                    Bad Debt
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="inherit">
                                                            {month && month.BadDebt !== null ? month.BadDebt : 0}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {displayYear}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {year && year.BadDebt !== null ? year.BadDebt : 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 1.5 }} />
                                <Grid container direction="column">
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1" color="inherit">
                                                    Due
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="inherit">
                                                            {month && month.Due !== null ? month.Due : 0}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {displayYear}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {year && year.Due !== null ? year.Due : 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 1.5 }} />
                                <Grid container direction="column">
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1" color="inherit">
                                                    Previous Year Dues
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="inherit">
                                                            {month && month.PreviousYearDue !== null ? month.PreviousYearDue : 0}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {displayYear}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {year && year.PreviousYearDue !== null ? year.PreviousYearDue : 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 1.5 }} />
                                <Grid container direction="column">
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1" color="inherit">
                                                    Expenses
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="inherit">
                                                            {month && month.expenses !== null ? month.expenses : 0}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {displayYear}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.success.dark }}>
                                                    {year && year.expenses !== null ? year.expenses : 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                    {/* <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                        <Button size="small" disableElevation>
                            View All
                            <ChevronRightOutlinedIcon />
                        </Button>
                    </CardActions> */}
                </MainCard>
            )}
        </>
    );
};

PopularCard.propTypes = {
    isLoading: PropTypes.bool
};

export default PopularCard;
