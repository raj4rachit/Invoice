import {
    Grid,
    InputAdornment,
    OutlinedInput,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography
} from '@mui/material';
import { IconSearch } from '@tabler/icons';
import { LifetimeIncomeListApi } from 'apis/Client';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

const params = {
    search: '',
    displayLength: 10,
    displayStart: 0,
    orderDir: 'ASC',
    orderColumn: 0,
    from_date: null,
    to_date: null,
    group_id: '0',
    source_by: '0',
    source_from: '0'
};

let recordsTotal = 0;
const LifeTimeIncomeTab = () => {
    const { recall } = useAuth();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('0');

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const getData = () => {
        LifetimeIncomeListApi(params)
            .then((res) => {
                recordsTotal = res.data.data.totalCount;
                setData(res.data.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
        params.search = search;
        params.displayLength = rowsPerPage;
        params.displayStart = rowsPerPage * page;
        params.orderDir = order?.toUpperCase() ?? params.orderDir;
        params.orderColumn = Number(orderBy);
        getData();
    }, [page, rowsPerPage, order, orderBy, search, recall]);

    return (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item sx={{ flexGrow: 1 }}>
                                    <Typography variant="column">Lifetime Income List</Typography>
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
                <TableContainer>
                    <Table>
                        <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                        <TableBody>
                            {data.map((item, Index) => (
                                <TableRow key={Index}>
                                    <TableCell align="left">
                                        {item.client_name}
                                        <Typography variant="subtitle2">{item.client_company_name}</Typography>
                                    </TableCell>
                                    <TableCell align="left">{item.enrollment_date}</TableCell>
                                    <TableCell align="right">{item.lifeTime}</TableCell>
                                    <TableCell align="right">{item.thisYear}</TableCell>
                                    <TableCell align="right">{item.lastYear}</TableCell>
                                    <TableCell align="right">{item.thisMonth}</TableCell>
                                    <TableCell align="right">{item.lastMonth}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={Number(recordsTotal)}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </MainCard>
        </>
    );
};

export default LifeTimeIncomeTab;
function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };
    return (
        <TableHead>
            <TableRow>
                <TableCell key="client_name">
                    <TableSortLabel active={orderBy === '0'} direction={orderBy === '0' ? order : 'asc'} onClick={createSortHandler('0')}>
                        Name
                    </TableSortLabel>
                </TableCell>
                <TableCell key="enrollment_date">
                    <TableSortLabel active={orderBy === '1'} direction={orderBy === '1' ? order : 'asc'} onClick={createSortHandler('1')}>
                        Enrollment Date
                    </TableSortLabel>
                </TableCell>
                <TableCell key="lifeTime" align="right">
                    <TableSortLabel active={orderBy === '2'} direction={orderBy === '2' ? order : 'asc'} onClick={createSortHandler('2')}>
                        Lifetime Bill
                    </TableSortLabel>
                </TableCell>
                <TableCell key="thisYear" align="right">
                    <TableSortLabel active={orderBy === '3'} direction={orderBy === '3' ? order : 'asc'} onClick={createSortHandler('3')}>
                        This Year Bill
                    </TableSortLabel>
                </TableCell>
                <TableCell key="lastYear" align="right">
                    <TableSortLabel active={orderBy === '4'} direction={orderBy === '4' ? order : 'asc'} onClick={createSortHandler('4')}>
                        Last Year Bill
                    </TableSortLabel>
                </TableCell>
                <TableCell key="thisMonth" align="right">
                    <TableSortLabel active={orderBy === '5'} direction={orderBy === '5' ? order : 'asc'} onClick={createSortHandler('5')}>
                        This Month Bill
                    </TableSortLabel>
                </TableCell>
                <TableCell key="lastMonth" align="right">
                    <TableSortLabel active={orderBy === '6'} direction={orderBy === '6' ? order : 'asc'} onClick={createSortHandler('6')}>
                        Last Month Bill
                    </TableSortLabel>
                </TableCell>
            </TableRow>
        </TableHead>
    );
}
