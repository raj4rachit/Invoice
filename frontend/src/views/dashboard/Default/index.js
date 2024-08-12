import useAuth from 'hooks/useAuth';
import SuperAdminDashboard from './adminDashboard';
import SubscriberDashboard from './subscriberDashboard';
import UserDashboard from './userDashboard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const { user } = useAuth();
    return (
        <>
            {user.user_type === 'SuperAdmin' && <SuperAdminDashboard />}
            {user.user_type === 'Subscriber' && <SubscriberDashboard />}
            {user.user_type === 'User' && <UserDashboard />}
        </>
    );
};

export default Dashboard;
