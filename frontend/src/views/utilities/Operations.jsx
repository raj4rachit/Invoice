import propTypes from 'prop-types';
import { Menu, ButtonBase, IconButton } from '@mui/material';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import { useState } from 'react';

const Operations = ({ children }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <ButtonBase
                className="more-button"
                sx={{ borderRadius: '12px' }}
                onClick={handleClick}
                aria-controls="menu-comment"
                aria-haspopup="true"
            >
                <IconButton component="span" size="small" disableRipple>
                    <MoreVertTwoToneIcon fontSize="inherit" />
                </IconButton>
            </ButtonBase>
            <Menu
                id="menu-comment"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                variant="selectedMenu"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                onBlur={() => {
                    setAnchorEl(null);
                }}
            >
                {children}
            </Menu>
        </>
    );
};

Operations.propTypes = {
    children: propTypes.node
};

export default Operations;
