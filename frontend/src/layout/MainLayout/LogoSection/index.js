import { NavLink } from 'react-router-dom';

// material-ui
import { ButtonBase, ImageList, ImageListItem, Toolbar } from '@mui/material';

// project imports
import config from 'config';
import Logo from 'ui-component/Logo';
import { useDispatch } from 'react-redux';
import { SELECTED_COLLAPSE, SELECTED_ITEM } from 'store/actions';
import Logo1 from 'assets/images/logo.png';
import useAuth from 'hooks/useAuth';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const MainLogo = user != null && user?.logo === '' ? Logo1 : user?.logo;
    return (
        <ButtonBase
            disableRipple
            component={NavLink}
            to={config.defaultPath}
            onClick={() => {
                dispatch({
                    type: SELECTED_COLLAPSE,
                    selectedCollapse: []
                });
                dispatch({ type: SELECTED_ITEM, selectedItem: 'dashboard' });
            }}
        >
            {/* <img src={MainLogo} alt="logo" height="45" width={`90%`} /> */}
            <img src={MainLogo} alt="logo" height="45" />
            {/* <Logo /> */}
        </ButtonBase>
    );
};

export default LogoSection;
