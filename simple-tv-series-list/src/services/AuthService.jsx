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
            localStorage.setItem('user', JSON.stringify({
                email: payload.sub,
                username: payload.username || email.split('@')[0]
            }));
        } catch (e) {
            console.error('Error parsing JWT token:', e);
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
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

export const getCurrentUser = () => {
    if (!isAuthenticated()) {
        return null;
    }

    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('user');
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
    updateApiService,
    authAxios
};