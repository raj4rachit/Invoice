import { AccountCircleTwoTone, LockTwoTone, PersonAddAltTwoTone } from '@mui/icons-material';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import ChangePassword from './ChangePassword';
import { ProfileDetails } from './ProfileDetails';
import { Subscriber } from './Subscriber';

const Index = () => {
    const cart = useSelector((state) => state.account);
    const user = cart.user;
    const [currentTab, setCurrentTab] = useState('profile');

    const handleChangeTab = (newValue) => {
        setCurrentTab(newValue);
    };

    const PROFILE_TABS = [
        {
            label: 'Profile',
            value: 'profile',
            icon: <AccountCircleTwoTone fontSize="small" />,
            component: <ProfileDetails />,
            display: 'both',
            isDisplay: true
        },
        {
            label: 'Change Password',
            value: 'change_password',
            icon: <LockTwoTone fontSize="small" />,
            component: <ChangePassword />,
            display: 'edit',
            isDisplay: true
        },
        {
            label: 'Subscriber',
            value: 'subscriber',
            icon: <PersonAddAltTwoTone fontSize="small" />,
            component: <Subscriber />,
            display: 'edit',
            isDisplay: user['user_type'] === 'Subscriber' && true
        }
    ];
    return (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -4 }}>
                        <Grid item xs={12}>
                            <Tabs
                                value={currentTab}
                                scrollButtons="auto"
                                variant="scrollable"
                                // allowScrollButtonsMobile
                                onChange={(e, val) => handleChangeTab(val)}
                                TabIndicatorProps={{ style: { bottom: '10px' } }}
                                sx={{ marginTop: '-20px', marginBottom: '-28px' }}
                            >
                                {PROFILE_TABS.map(
                                    (tab) =>
                                        tab.isDisplay && (
                                            <Tab
                                                disableRipple
                                                key={tab.value}
                                                value={tab.value}
                                                icon={tab.icon}
                                                label={tab.label}
                                                iconPosition="start"
                                            />
                                        )
                                )}
                            </Tabs>
                        </Grid>
                    </Grid>
                }
                content={true}
            >
                {PROFILE_TABS.map((tab) => {
                    const isMatched = tab.value === currentTab;
                    return isMatched && tab.isDisplay && <Box key={tab.value}>{tab.component}</Box>;
                })}
            </MainCard>
        </>
    );
};

export default Index;
