import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/AuthService';

export default function ProtectedRoute() {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}