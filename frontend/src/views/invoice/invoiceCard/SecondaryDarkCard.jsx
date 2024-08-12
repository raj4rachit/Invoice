import propTypes from 'prop-types';
import { TableChartOutlined } from '@mui/icons-material';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, styled, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import MainCard from 'ui-component/cards/MainCard';
import CardSkeleton from './CardSkeleton';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.secondary.light,
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.secondary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.secondary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const SecondaryDarkCard = ({ isLoading, title, count, amount, handleFilter, status }) => {
    const theme = useTheme();
    return (
        <>
            {isLoading ? (
                <CardSkeleton />
            ) : (
                <CardWrapper border={false} content={false} sx={{ cursor: 'pointer' }} onClick={() => handleFilter('filterStatus', status)}>
                    <Box sx={{ p: 2 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: theme.palette.secondary[800],
                                            color: '#fff'
                                        }}
                                    >
                                        <TableChartOutlined fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    primary={
                                        <Typography variant="h4" sx={{ color: '#fff' }}>
                                            {amount}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                            {title}
                                        </Typography>
                                    }
                                />
                                <ListItemText
                                    primary={
                                        <Typography variant="h2" sx={{ color: '#fff' }} textAlign="right">
                                            {count}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

SecondaryDarkCard.propTypes = {
    isLoading: propTypes.bool,
    title: propTypes.string,
    count: propTypes.string,
    amount: propTypes.string,
    handleFilter: propTypes.func,
    status: propTypes.string
};

export default SecondaryDarkCard;
