import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GuestGuard = ({ children }) => {
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/', { replace: true });
        }
        // else if (!isLoggedIn) {
        //     navigate('/login', { replace: true });
        // }
    }, [isLoggedIn, user, navigate]);
    return children;
};

export default GuestGuard;
