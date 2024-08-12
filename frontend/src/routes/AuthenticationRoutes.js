import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import GuestGuard from 'utils/route-guard/GuestGuard';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const ForgotPassword = Loadable(lazy(() => import('views/pages/authentication/authentication3/ForgotPassword')));
const ChangePassword = Loadable(lazy(() => import('views/pages/authentication/authentication3/ChangePassword')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: (
        <GuestGuard>
            <MinimalLayout />
        </GuestGuard>
    ),
    children: [
        {
            path: '/login',
            element: <AuthLogin3 />
        },
        {
            path: '/register',
            element: <AuthRegister3 />
        },
        {
            path: '/forgot-password',
            element: <ForgotPassword />
        },
        {
            path: '/change-password/:id',
            element: <ChangePassword />
        }
    ]
};

export default AuthenticationRoutes;
