import axios from 'axios';

const API_URL = '/api/auth';

export const authAxios = axios.create();

authAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

authAxios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('expiresAt');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const register = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        });

        const { token, expiresIn } = response.data;

        const expiresAt = new Date().getTime() + expiresIn * 1000;
        localStorage.setItem('token', token);
        localStorage.setItem('expiresAt', expiresAt.toString());

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));

            const minimalUser = {
                email: payload.sub,
                username: payload.username || email.split('@')[0],
            };

            localStorage.setItem('user', JSON.stringify(minimalUser));

            await fetchUserDetails();
        } catch (e) {
            console.error('Error parsing JWT token:', e);
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const fetchUserDetails = async () => {
    try {
        const response = await authAxios.get('/api/users/me');
        const userData = response.data;

        const currentUser = {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            role: userData.role
        };

        localStorage.setItem('user', JSON.stringify(currentUser));

        window.currentUser = currentUser;

        return currentUser;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');

    if (!token || !expiresAt) {
        return false;
    }

    return new Date().getTime() < parseInt(expiresAt);
};

export const getCurrentUser = async (forceRefresh = false) => {
    if (!isAuthenticated()) {
        return null;
    }

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (forceRefresh || (user && !user.role)) {
        return await fetchUserDetails();
    }

    if (user) {
        window.currentUser = user;
    }

    return user;
};

export const hasRole = async (role) => {
    const user = await getCurrentUser();
    return user && user.role === role;
};

export const isAdmin = async () => {
    return await hasRole('ADMIN');
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('user');
    window.currentUser = null;
};

export const updateApiService = () => {
    return {
        getAuthHeader: () => {
            const token = localStorage.getItem('token');
            return token ? { Authorization: `Bearer ${token}` } : {};
        }
    };
};

export default {
    register,
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    hasRole,
    isAdmin,
    updateApiService,
    authAxios,
    fetchUserDetails
};