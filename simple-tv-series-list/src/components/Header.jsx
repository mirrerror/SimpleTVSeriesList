import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/AuthService';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';

export default function Header({ onLogout }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navigate = useNavigate();
    const { authenticated, user, updateAuthState } = useAuth();

    const handleLogout = () => {
        logout();
        updateAuthState(false);
        setShowDropdown(false);
        setShowMobileMenu(false);

        if (onLogout && typeof onLogout === 'function') {
            onLogout();
        }

        navigate('/login');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    return (
        <>
            <div
                className="bg-white dark:bg-zinc-800 shadow-md py-2 z-10 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center px-4"
                style={{ position: 'fixed', top: 0, left: 0, right: 0 }}
            >
                <Link to="/" className="text-lg font-bold text-black dark:text-white truncate max-w-[180px] sm:max-w-none">TV Series Tracker</Link>

                <button
                    className="md:hidden flex items-center"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>

                <div className="hidden md:flex items-center space-x-4">
                    {authenticated && user?.role === 'ADMIN' && (
                        <Link
                            to="/admin"
                            className="text-sm px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                            </svg>
                            Admin
                        </Link>
                    )}

                    <ThemeToggle />

                    {authenticated ? (
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center space-x-1 text-sm px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700"
                            >
                                <span className="font-medium">{user?.username || 'User'}</span>
                                {user?.role === 'ADMIN' && (
                                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300">
                                        Admin
                                    </span>
                                )}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showDropdown && (
                                <div
                                    className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-zinc-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-zinc-700"
                                >
                                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-zinc-700">
                                        Signed in as <span className="font-semibold">{user?.email}</span>
                                    </div>
                                    {user?.role === 'ADMIN' && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setShowDropdown(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link
                                to="/login"
                                className="text-sm px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm px-3 py-1 bg-fuchsia-700 text-white rounded hover:bg-fuchsia-600"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {showMobileMenu && (
                <div className="md:hidden fixed top-[52px] left-0 right-0 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 shadow-lg z-10">
                    <div className="flex flex-col p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Theme</span>
                            <ThemeToggle />
                        </div>

                        {authenticated ? (
                            <>
                                <div className="py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-zinc-700">
                                    Signed in as <span className="font-semibold">{user?.email}</span>
                                </div>

                                {user?.role === 'ADMIN' && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setShowMobileMenu(false)}
                                        className="flex items-center space-x-2 py-2 text-sm text-gray-700 dark:text-gray-200"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                            />
                                        </svg>
                                        <span>Admin Panel</span>
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left py-2 text-sm text-gray-700 dark:text-gray-200"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2">
                                <Link
                                    to="/login"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="text-sm px-3 py-2 rounded text-center hover:bg-gray-100 dark:hover:bg-zinc-700"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="text-sm px-3 py-2 bg-fuchsia-700 text-white rounded text-center hover:bg-fuchsia-600"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="h-14"></div>
        </>
    );
}