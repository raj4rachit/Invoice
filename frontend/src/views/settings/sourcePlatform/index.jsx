import { Card, CardContent, CardHeader, Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import useAuth from 'hooks/useAuth';
import { useState, useTransition } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import AddEditSourcePlatform from './AddEditSourcePlatform';
import SourcePlatformList from './SourcePlatformList';

const Index = () => {
    const { checkRestriction } = useAuth();
    const [search, setSearch] = useState('');
    const [callApi, setCallApi] = useState(false);
    const [, startTransition] = useTransition();

    const submitHandler = () => {
        setCallApi((prevState) => !prevState);
    };

    const handleSearch = (event) => {
        startTransition(() => setSearch(event.target.value));
    };
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} md={4}>
                <Card variant="outlined">
                    <CardHeader title="Add Source Platform" />
                    <CardContent>
                        {checkRestriction('CAN_ADD_SOURCE_PLATFORM') ? (
                            <AddEditSourcePlatform formID="addSourcePlatform" onSubmit={submitHandler} />
                        ) : (
                            <Typography
                                sx={{
                                    p: '8%'
                                }}
                                textAlign="center"
                                variant="h3"
                                color={'inherit'}
                            >
                                You don't have a permission
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={8}>
                <MainCard
                    title={
                        <Grid container spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                            <Grid item xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sx={{ flexGrow: 1 }}>
                                        <Typography variant="column">Source Platform List</Typography>
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
                    <SourcePlatformList search={search} callApi={callApi} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Index;
