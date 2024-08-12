import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Button, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import CommonDialog from 'utils/CommonDialog';
import AddEditRestriction from './AddEditRestriction';
import RestrictionList from './RestrictionList';

const Index = () => {
    const [search, setSearch] = useState('');
    const [permissionFilter, setPermissionFilter] = useState('0');
    const [callApi, setCallApi] = useState(false);
    const [permissionData, setPermissionData] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);

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
    return (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item sx={{ flexGrow: 1 }}>
                                    <Typography variant="column">Restriction List</Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" onClick={() => addData()}>
                                        <AddCircleOutlineOutlined sx={{ mr: 0.5 }} /> Add Restriction
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <FormControl size="small" sx={{ minWidth: '100px' }}>
                                        <InputLabel id="permission">Permissions</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="permission"
                                            id="permission"
                                            label="Permissions"
                                            defaultValue="0"
                                            onChange={(e) => {
                                                setPermissionFilter(e.target.value);
                                            }}
                                            MenuProps={{
                                                style: {
                                                    maxHeight: 500
                                                }
                                            }}
                                        >
                                            <MenuItem value="0">All</MenuItem>
                                            {permissionData.map((item, idx) => (
                                                <MenuItem value={item.id} key={idx}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
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
                <RestrictionList
                    search={search}
                    permissionFilter={permissionFilter}
                    callApi={callApi}
                    setPermissionData={setPermissionData}
                    permissionData={permissionData}
                />
            </MainCard>
            {openAdd && (
                <CommonDialog
                    open={openAdd}
                    title="Add Restriction"
                    onClose={() => setOpenAdd((prevState) => !prevState)}
                    id="addRestriction"
                >
                    <AddEditRestriction formId="addRestriction" onSubmit={submitHandler} permissions={permissionData} />
                </CommonDialog>
            )}
        </>
    );
};

export default Index;
