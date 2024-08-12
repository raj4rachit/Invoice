import { Grid, Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import ClientTab from './ClientTab';
import LifeTimeIncomeTab from './LifeTimeIncomeTab';

const Index = () => {
    const [currentTab, setCurrentTab] = useState('client_list');

    const handleChangeTab = (newValue) => {
        setCurrentTab(newValue);
    };

    const PROFILE_TABS = [
        {
            label: 'Client List',
            value: 'client_list',
            component: <ClientTab />
        },
        {
            label: 'Lifetime Income',
            value: 'lifetime_income',
            component: <LifeTimeIncomeTab />
        }
    ];

    return (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -3 }}>
                        <Grid item xs={12}>
                            <Tabs
                                value={currentTab}
                                scrollButtons="auto"
                                variant="scrollable"
                                // allowScrollButtonsMobile
                                onChange={(e, val) => handleChangeTab(val)}
                                TabIndicatorProps={{ style: { bottom: '3px' } }}
                                sx={{ marginTop: '-20px', marginBottom: '-28px' }}
                            >
                                {PROFILE_TABS.map((tab) => (
                                    <Tab disableRipple key={tab.value} value={tab.value} label={tab.label} iconPosition="start" />
                                ))}
                            </Tabs>
                        </Grid>
                    </Grid>
                }
                content={true}
            >
                {PROFILE_TABS.map((tab) => {
                    const isMatched = tab.value === currentTab;
                    return isMatched && <Box key={tab.value}>{tab.component}</Box>;
                })}
            </MainCard>
        </>
    );
};

export default Index;
