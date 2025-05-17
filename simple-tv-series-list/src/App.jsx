import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import TVSeriesForm from './components/TVSeriesForm';
import TVSeriesList from './components/TVSeriesList';
import BackToTop from './components/BackToTop';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { fetchSeries, createSeries, updateSeries, deleteSeries } from './services/TVSeriesApiService';
import { isAuthenticated } from './services/AuthService';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

function Dashboard() {
    const [series, setSeries] = useState([]);
    const [editingSeries, setEditingSeries] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(0);
    const { authTrigger } = useAuth();
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        sortBy: 'status',
        sortDirection: 'desc',
        status: 'all',
        totalPages: 0,
        totalElements: 0
    });

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchSeries(
                    pagination.page,
                    pagination.size,
                    pagination.sortBy,
                    pagination.sortDirection,
                    pagination.status
                );

                if (!controller.signal.aborted) {
                    setSeries(data.content);
                    setPagination(prevPagination => ({
                        ...prevPagination,
                        totalPages: data.pagination.totalPages,
                        totalElements: data.pagination.totalElements
                    }));
                    setIsDataLoaded(true);
                    setLoading(false);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Failed to load series:', err);
                    setError('Failed to load TV series. Please try again later.');
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => controller.abort();
    }, [pagination.page, pagination.size, pagination.sortBy, pagination.sortDirection, pagination.status, forceRefresh, authTrigger]);

    const handlePaginationChange = (newPagination) => {
        setPagination(prevPagination => ({
            ...prevPagination,
            ...newPagination
        }));
    };

    const triggerRefresh = () => {
        setForceRefresh(prev => prev + 1);
    };

    const addSeries = async (newSeries) => {
        try {
            setLoading(true);
            setError(null);
            await createSeries(newSeries);
            triggerRefresh();
        } catch (err) {
            console.error('Failed to add series:', err);
            setError('Failed to add TV series. Please try again later.');
            setLoading(false);
        }
    };

    const removeSeries = async (id) => {
        try {
            setLoading(true);
            setError(null);
            await deleteSeries(id);
            triggerRefresh();
        } catch (err) {
            console.error('Failed to remove series:', err);
            setError('Failed to remove TV series. Please try again later.');
            setLoading(false);
        }
    };

    const rateSeries = async (id, rating) => {
        try {
            const seriesToUpdate = series.find(s => s.id === id);
            if (!seriesToUpdate) return;

            const updatedSeriesData = { ...seriesToUpdate, rating };
            setLoading(true);
            setError(null);
            await updateSeries(updatedSeriesData);
            triggerRefresh();
        } catch (err) {
            console.error('Failed to rate series:', err);
            setError('Failed to update rating. Please try again later.');
            setLoading(false);
        }
    };

    const editSeries = (seriesData) => {
        setEditingSeries(seriesData);
    };

    const updateSeriesData = async (updatedSeries) => {
        if (!updatedSeries) {
            setEditingSeries(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await updateSeries(updatedSeries);
            setEditingSeries(null);
            triggerRefresh();
        } catch (err) {
            console.error('Failed to update series:', err);
            setError('Failed to update TV series. Please try again later.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto" style={{ paddingTop: '60px' }}>
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="mb-4 sm:mb-6">
                <TVSeriesForm
                    onAdd={addSeries}
                    editSeries={editingSeries}
                    onUpdate={updateSeriesData}
                    isMobile={window.innerWidth < 768}
                />
            </div>

            {loading && (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
                </div>
            )}

            {!loading && (
                <TVSeriesList
                    series={series}
                    onRate={rateSeries}
                    onRemove={removeSeries}
                    onEdit={editSeries}
                    isMobile={window.innerWidth < 768}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                />
            )}
        </div>
    );
}

export default function App() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLogout = () => {
    };

    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
                    <Header onLogout={handleLogout} />

                    <Routes>
                        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>

                        <Route element={<ProtectedAdminRoute />}>
                            <Route path="/admin" element={<AdminPanel />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>

                    <BackToTop />
                </div>
            </Router>
        </AuthProvider>
    );
}