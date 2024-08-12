import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import { SELECTED_COLLAPSE } from 'store/actions';

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level, selectedMenu }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const customization = useSelector((state) => state.customization);
    const menuCollapse = useSelector((state) => state.menu.selectedCollapse);

    const handleClick = () => {
        const menuIndex = menuCollapse.findIndex((i) => i.id === menu.id);
        if (menuIndex > -1) {
            const menuValue = menuCollapse[menuIndex];
            menuCollapse.splice(menuIndex, 1, { id: menu.id, open: menuValue.id === menu.id && menuValue.open ? false : true });
            dispatch({
                type: SELECTED_COLLAPSE,
                selectedCollapse: menuCollapse
            });
        } else {
            const newMenuCollapse = [...menuCollapse, { id: menu.id, open: true }];
            dispatch({
                type: SELECTED_COLLAPSE,
                selectedCollapse: newMenuCollapse
            });
        }
    };

    let selectedItem;
    const selectedIndex = menuCollapse.findIndex((i) => i.id === menu.id);
    if (selectedIndex > -1) {
        selectedItem = menuCollapse[selectedIndex];
    }

    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === menu.id);
        if (currentIndex > -1) {
            handleClick();
        }
    }, []);

    // menu collapse & item
    const menus = menu.children?.map((item) => {
        switch (item.type) {
            case 'collapse':
                return <NavCollapse key={item.id} menu={item} level={level + 1} selectedMenu={selectedMenu} />;
            case 'item':
                return <NavItem key={item.id} item={item} level={level + 1} isChild={true} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    const Icon = menu.icon;
    const menuIcon = menu.icon ? (
        <Icon strokeWidth={1.5} size="1.3rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: selectedMenu.id === menu.id ? 8 : 6,
                height: selectedMenu.id === menu.id ? 8 : 6
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    );

    return (
        <>
            <ListItemButton
                sx={{
                    borderRadius: `${customization.borderRadius}px`,
                    mb: 0.5,
                    alignItems: 'flex-start',
                    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                    py: level > 1 ? 1 : 1.25,
                    pl: `${level * 24}px`
                }}
                selected={selectedItem?.id === menu.id && selectedItem?.open === true && true}
                onClick={handleClick}
            >
                <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>{menuIcon}</ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant={selectedItem?.id === menu.id ? 'h5' : 'body1'} color="inherit" sx={{ my: 'auto' }}>
                            {menu.title}
                        </Typography>
                    }
                    secondary={
                        menu.caption && (
                            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                {menu.caption}
                            </Typography>
                        )
                    }
                />
                {selectedItem?.id === menu.id && selectedItem?.open === true ? (
                    <IconChevronUp stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                ) : (
                    <IconChevronDown stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                )}
            </ListItemButton>
            <Collapse in={selectedItem?.id === menu.id && selectedItem?.open === true && true} timeout="auto" unmountOnExit>
                <List
                    component="div"
                    disablePadding
                    sx={{
                        position: 'relative',
                        '&:after': {
                            content: "''",
                            position: 'absolute',
                            left: '32px',
                            top: 0,
                            height: '100%',
                            width: '1px',
                            opacity: 1,
                            background: theme.palette.primary.light
                        }
                    }}
                >
                    {menus}
                </List>
            </Collapse>
        </>
    );
};

NavCollapse.propTypes = {
    menu: PropTypes.object,
    level: PropTypes.number,
    selectedMenu: PropTypes.object,
    isChild: PropTypes.bool
};

export default NavCollapse;
