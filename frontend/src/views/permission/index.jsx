import { Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import PermissionList from './PermissionList';

const Index = () => {
    const [search, setSearch] = useState('');
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };
    return (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item sx={{ flexGrow: 1 }}>
                                    <Typography variant="column">Permission List</Typography>
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
                <PermissionList search={search} />
            </MainCard>
        </>
    );
};

export default Index;
