import { authAxios } from './AuthService';

const API_URL = '/api/users';

export const getAllUsers = async () => {
    try {
        const response = await authAxios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await authAxios.delete(`${API_URL}/delete/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export default {
    getAllUsers,
    deleteUser
};