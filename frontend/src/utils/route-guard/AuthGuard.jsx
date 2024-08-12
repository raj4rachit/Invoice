import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';

const AuthGuard = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else if (document.location.pathname === '/login') {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    return children;
};

export default AuthGuard;
