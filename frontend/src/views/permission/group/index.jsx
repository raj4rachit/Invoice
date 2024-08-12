import { useState } from 'react';
// Constant
import { gridSpacing } from 'store/constant';

// Material UI
import { Button, Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { IconSearch } from '@tabler/icons';
import PermissionGroupList from './PermissionGroupList';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import CommonDialog from 'utils/CommonDialog';
import AddEditPermissionGroup from './AddEditPermissionGroup';
import useAuth from 'hooks/useAuth';
import { viewPermissionGroupApi } from 'apis/Permission';
import { apiErrorSnackBar, apiValidationSnackBar } from 'utils/SnackBar';
import { useTransition } from 'react';

const Index = () => {
    const { checkRestriction } = useAuth();
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [callApi, setCallApi] = useState(false);
    const [permissionData, setPermissionData] = useState([]);
    const [, startTransition] = useTransition();

    const addData = () => {
        setOpenAdd((prevState) => !prevState);
        viewPermissionGroupApi({ type: 'add' })
            .then((res) => {
                if (res.data && res.data.status === 1) {
                    setPermissionData(res.data.data.allPermissionList);
                } else {
                    apiValidationSnackBar(res);
                }
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
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
                                    <Typography variant="column">Permission Group List</Typography>
                                </Grid>
                                {checkRestriction('CAN_ADD_PERMISSION_GROUP') && (
                                    <Grid item>
                                        <Button variant="contained" onClick={() => addData()}>
                                            <AddCircleOutlineOutlined sx={{ mr: 0.5 }} /> Add Permission Group
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
                <PermissionGroupList
                    search={search}
                    callApi={callApi}
                    setPermissionData={setPermissionData}
                    permissionData={permissionData}
                />
            </MainCard>

            {openAdd && (
                <CommonDialog
                    open={openAdd}
                    title="Add Permission Group"
                    onClose={() => setOpenAdd((prevState) => !prevState)}
                    id="addPermissionGroup"
                >
                    <AddEditPermissionGroup formId="addPermissionGroup" onSubmit={submitHandler} permissions={permissionData} />
                </CommonDialog>
            )}
        </>
    );
};

export default Index;
