import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, fetchUserDetails } from '../services/AuthService';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authTrigger, setAuthTrigger] = useState(0);

    useEffect(() => {
        const initializeAuth = async () => {
            const authStatus = isAuthenticated();
            setAuthenticated(authStatus);

            if (authStatus) {
                try {
                    const userData = await getCurrentUser();

                    if (!userData?.role) {
                        const freshUserData = await fetchUserDetails();
                        setUser(freshUserData);
                    } else {
                        setUser(userData);
                    }
                } catch (error) {
                    console.error("Failed to get user data:", error);
                    setAuthenticated(false);
                    setUser(null);
                }
            }

            setLoading(false);
        };

        initializeAuth();
    }, [authTrigger]);

    const updateAuthState = (isAuthenticated, userData = null) => {
        setAuthenticated(isAuthenticated);
        if (userData) {
            setUser(userData);
        } else if (!isAuthenticated) {
            setUser(null);
        }
        setAuthTrigger(prev => prev + 1);
    };

    const value = {
        authenticated,
        user,
        updateAuthState,
        loading,
        authTrigger
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}