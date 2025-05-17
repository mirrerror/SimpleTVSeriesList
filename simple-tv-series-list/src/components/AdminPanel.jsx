import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, deleteUser } from '../services/AdminService';

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }

        fetchUsers();
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to load users:', err);
            setError('Failed to load users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                setLoading(true);
                await deleteUser(userId);
                setUsers(users.filter(user => user.id !== userId));

                alert('User deleted successfully');
            } catch (err) {
                console.error('Failed to delete user:', err);
                setError('Failed to delete user. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                        Admin Panel
                    </h1>
                    <p className="mt-2 sm:mt-3 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 dark:text-gray-300">
                        Manage users and system settings
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-800 shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-4 sm:py-5 sm:px-6 border-b border-gray-200 dark:border-zinc-700">
                        <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            Users
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                            {users.length} registered users
                        </p>
                    </div>
                    <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
                        {users.map((user) => (
                            <li key={user.id} className="px-4 py-4 sm:px-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900 flex items-center justify-center">
                                            <span className="text-fuchsia-700 dark:text-fuchsia-300 font-medium">
                                                {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user.username || 'No Username'}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 break-all">
                                                {user.email}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    {user.role}
                                                </span>
                                                {user.birthDate && (
                                                    <span className="inline-block">
                                                        Birth date: {new Date(user.birthDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:mt-0">
                                        {user.id !== (window.currentUser?.id) && (
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={loading}
                                                className="w-full sm:w-auto inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                        {users.length === 0 && !loading && (
                            <li className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 sm:px-6">
                                No users found
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}