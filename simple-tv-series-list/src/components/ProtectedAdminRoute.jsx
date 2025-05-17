import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdmin } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

export default function ProtectedAdminRoute() {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const { authenticated, user } = useAuth();

    useEffect(() => {
        const checkAdminAccess = async () => {
            if (!authenticated) {
                setHasAccess(false);
                setLoading(false);
                return;
            }

            try {
                if (user && user.role === 'ADMIN') {
                    setHasAccess(true);
                    setLoading(false);
                    return;
                }

                const adminStatus = await isAdmin();
                setHasAccess(adminStatus);
                setLoading(false);
            } catch (error) {
                console.error('Error checking admin status:', error);
                setHasAccess(false);
                setLoading(false);
            }
        };

        checkAdminAccess();
    }, [authenticated, user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
            </div>
        );
    }

    return hasAccess ? <Outlet /> : <Navigate to="/dashboard" />;
}