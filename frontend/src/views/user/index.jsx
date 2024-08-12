import { AddCircleOutlineOutlined as AddCircleOutlineOutlinedIcon, FilterAlt } from '@mui/icons-material';
import { Button, ButtonBase, Grid, InputAdornment, MenuItem, OutlinedInput, TextField, Typography, useTheme } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import CommonDialog from 'utils/CommonDialog';
import AddEditUser from './AddEditUser';
import UserList from './UserList';
import { useLocation } from 'react-router-dom';
import Transitions from 'ui-component/extended/Transitions';
// import useAuth from 'hooks/useAuth';

const initialFilter = {
    filterSource: '',
    filterType: '',
    filterPriority: '',
    filterStatus: ''
};

const User = () => {
    const theme = useTheme();
    const location = useLocation();
    // const { checkRestriction } = useAuth();
    const [search, setSearch] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filter, setFilter] = useState(initialFilter);
    const [roleList, setRoleList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [callApi, setCallApi] = useState(false);
    const employer = location.state?.employerData ?? '';
    const addData = () => {
        setOpenAdd((prevState) => !prevState);
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
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
    };

    return (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item sx={{ flexGrow: 1 }}>
                                    <Typography variant="column">{employer && employer.name} Users List</Typography>
                                </Grid>
                                {/* {checkRestriction('CAN_ADD_USER') && !employer && ( */}
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
                                <Grid item>
                                    <Button variant="contained" onClick={() => addData()}>
                                        <AddCircleOutlineOutlinedIcon sx={{ mr: 0.5 }} /> Add User
                                    </Button>
                                </Grid>
                                {/* )} */}
                                {/* <Grid item>
                                    <FormControl size="small" sx={{ minWidth: '100px' }}>
                                        <InputLabel id="employer">Employers</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="employer"
                                            id="employer"
                                            label="Employers"
                                            defaultValue="0"
                                            onChange={(e) => {
                                                setEmployerFilter(e.target.value);
                                            }}
                                        >
                                            <MenuItem value="0">Select</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid> */}
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
                                        label="Priority"
                                        fullWidth
                                        id="filterPriority"
                                        select
                                        value={filter.filterPriority}
                                        onChange={(e) => handleFilter('filterPriority', e)}
                                    >
                                        <MenuItem key={100} value="low">
                                            Low
                                        </MenuItem>
                                        <MenuItem key={101} value="medium">
                                            Medium
                                        </MenuItem>
                                        <MenuItem key={102} value="high">
                                            High
                                        </MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <TextField
                                        size="small"
                                        label="Status"
                                        fullWidth
                                        id="filterStatus"
                                        select
                                        value={filter.filterStatus}
                                        onChange={(e) => handleFilter('filterStatus', e)}
                                    >
                                        <MenuItem key={101} value="In Progress">
                                            In Progress
                                        </MenuItem>
                                        <MenuItem key={102} value="Open">
                                            Open
                                        </MenuItem>
                                        <MenuItem key={103} value="On Hold">
                                            On Hold
                                        </MenuItem>
                                        <MenuItem key={104} value="Accepted">
                                            Accepted
                                        </MenuItem>
                                        <MenuItem key={105} value="Submitted">
                                            Submitted
                                        </MenuItem>
                                        <MenuItem key={106} value="Reviewed">
                                            Reviewed
                                        </MenuItem>
                                        <MenuItem key={107} value="Completed">
                                            Completed
                                        </MenuItem>
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

                <UserList
                    search={search}
                    callApi={callApi}
                    setRoleList={setRoleList}
                    roleList={roleList}
                    employerId={employer && employer.id}
                    setCompanyList={setCompanyList}
                    companyList={companyList}
                />
            </MainCard>

            {openAdd && (
                <CommonDialog
                    open={openAdd}
                    title="Add User"
                    onClose={() => setOpenAdd((prevState) => !prevState)}
                    id="addUser"
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
                    <AddEditUser formId="addUser" onSubmit={submitHandler} roleList={roleList} companyList={companyList} />
                </CommonDialog>
            )}
        </>
    );
};
export default User;
