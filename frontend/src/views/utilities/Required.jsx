import { useTheme } from '@mui/material';
import propTypes from 'prop-types';

const Required = ({ title }) => {
    const theme = useTheme();
    return (
        <>
            {title}
            <span style={{ color: theme.palette.error.main }}>*</span>
        </>
    );
};

Required.propTypes = {
    title: propTypes.string.isRequired
};

export default Required;
