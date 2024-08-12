import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import CircularLoader from 'ui-component/CircularLoader';
import Snackbar from 'ui-component/extended/Snackbar';
import { AuthProvider } from 'contexts/AuthContext';

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);
    const loader = useSelector((state) => state.loader);

    return (
        <>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={themes(customization)}>
                    <CssBaseline />
                    <NavigationScroll>
                        <AuthProvider>
                            <Routes />
                            <Snackbar />
                        </AuthProvider>
                    </NavigationScroll>
                </ThemeProvider>
            </StyledEngineProvider>
            <CircularLoader loading={loader.isLoading} />
        </>
    );
};

export default App;
