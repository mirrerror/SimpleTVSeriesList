import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, isAuthenticated } from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authTrigger, setAuthTrigger] = useState(0);

    useEffect(() => {
        const checkAuth = () => {
            const auth = isAuthenticated();
            setAuthenticated(auth);
            setUser(auth ? getCurrentUser() : null);
            setLoading(false);
        };

        checkAuth();

        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, [authTrigger]);

    const updateAuthState = (isAuth) => {
        setAuthenticated(isAuth);
        setUser(isAuth ? getCurrentUser() : null);
        setAuthTrigger(prev => prev + 1);
    };

    const value = {
        authenticated,
        user,
        loading,
        updateAuthState,
        authTrigger
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;