import { alpha, CircularProgress, styled } from '@mui/material';

const LoaderWrapper = styled('div')(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1301,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: alpha(theme.palette.primary.light, 0.1)
}));
const CircularLoader = ({ loading }) => {
    return (
        <>
            {loading ? (
                <LoaderWrapper>
                    <CircularProgress variant="indeterminate" value={25} />
                </LoaderWrapper>
            ) : null}
        </>
    );
};

export default CircularLoader;
