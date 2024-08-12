import propTypes from 'prop-types';
import { Info as InfoIcon } from '@mui/icons-material';
import { IconButton, styled } from '@mui/material';
import MuiTooltip, { tooltipClasses } from '@mui/material/Tooltip';

export const LightTooltip = styled(({ className, ...props }) => <MuiTooltip arrow {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.primary.light,
            color: 'rgba(0, 0, 0, 0.87)',
            boxShadow: theme.shadows[1],
            fontSize: 14,
            fontWeight: 200
        }
    })
);
const CustomTooltip = ({ title, Icon }) => (
    <LightTooltip title={title}>
        {Icon || (
            <IconButton color="inherit" sx={{ p: '0 5px' }}>
                <InfoIcon color="action" sx={{ fontSize: '18px' }} />
            </IconButton>
        )}
    </LightTooltip>
);

CustomTooltip.propTypes = {
    title: propTypes.string,
    Icon: propTypes.node
};

export default CustomTooltip;
