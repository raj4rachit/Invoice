import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Link, Typography } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
// import NotificationSection from './NotificationSection';

// assets
import { IconMenu2 } from '@tabler/icons';
import CenterDialog from 'views/utilities/CenterDialog';
import { useDispatch, useSelector } from 'react-redux';
import CompanySection from './CompanySection';
import { OPEN_COMPANY } from 'store/actions';
import { ModeEditOutlineTwoTone } from '@mui/icons-material';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const companyReducer = useSelector((state) => state.company);
    const cart = useSelector((state) => state.account);

    const handleChangeCompany = async () => {
        dispatch({
            type: OPEN_COMPANY,
            isOpen: true
        });
    };

    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    // width: 228,
                    width: 270,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                <ButtonBase disableRipple sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        onClick={handleLeftDrawerToggle}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>

            {/* header search */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />
            {cart.user?.user_type !== 'SuperAdmin' && (
                <Typography align="center" variant="subtitle1">
                    {cart.company.company_id === '0'
                        ? `All Companies`
                        : `${cart.company.company_name} - ${cart.company.financial_year_name}`}

                    <Link
                        sx={{
                            ml: 1,
                            mr: 2,
                            '&:hover:not(.Mui-disabled)': {
                                cursor: 'pointer'
                            }
                        }}
                        color="primary"
                        underline="none"
                        onClick={handleChangeCompany}
                    >
                        <ModeEditOutlineTwoTone sx={{ mb: -0.5 }} />
                    </Link>
                </Typography>
            )}

            {/* notification & profile */}
            {/* <NotificationSection /> */}
            <ProfileSection />

            {/* Center Dialog */}
            <CenterDialog
                title="Select Company"
                open={companyReducer.isOpen}
                onClose={() =>
                    dispatch({
                        type: OPEN_COMPANY,
                        isOpen: false
                    })
                }
                id="changeCompany"
            >
                <CompanySection
                    isOpen={companyReducer.isOpen}
                    formID="changeCompany"
                    onSubmit={() => {
                        dispatch({
                            type: OPEN_COMPANY,
                            isOpen: false
                        });
                    }}
                />
            </CenterDialog>
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
