import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import TVSeriesForm from './components/TVSeriesForm';
import TVSeriesList from './components/TVSeriesList';
import BackToTop from './components/BackToTop';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { fetchSeries, createSeries, updateSeries, deleteSeries } from './services/TVSeriesApiService';
import { isAuthenticated } from './services/AuthService';
import './index.css';

export default function App() {
    const [series, setSeries] = useState([]);
    const [editingSeries, setEditingSeries] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const loadSeries = useCallback(async () => {
        if (loading || isDataLoaded) return;

        try {
            setLoading(true);
            setError(null);
            const data = await fetchSeries();
            setSeries(data);
            setIsDataLoaded(true);
        } catch (err) {
            console.error('Failed to load series:', err);
            setError('Failed to load TV series. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [loading, isDataLoaded]);

    const addSeries = async (newSeries) => {
        try {
            setLoading(true);
            setError(null);
            const addedSeries = await createSeries(newSeries);
            setSeries(prevSeries => [...prevSeries, addedSeries]);
        } catch (err) {
            console.error('Failed to add series:', err);
            setError('Failed to add TV series. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const removeSeries = async (id) => {
        try {
            setLoading(true);
            setError(null);
            await deleteSeries(id);
            setSeries(prevSeries => prevSeries.filter(s => s.id !== id));
        } catch (err) {
            console.error('Failed to remove series:', err);
            setError('Failed to remove TV series. Please try again later.');
        } finally {
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
            const updatedSeries = await updateSeries(updatedSeriesData);
            setSeries(prevSeries => prevSeries.map(s => s.id === id ? updatedSeries : s));
        } catch (err) {
            console.error('Failed to rate series:', err);
            setError('Failed to update rating. Please try again later.');
        } finally {
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
            const result = await updateSeries(updatedSeries);
            setSeries(prevSeries => prevSeries.map(s => s.id === updatedSeries.id ? result : s));
            setEditingSeries(null);
        } catch (err) {
            console.error('Failed to update series:', err);
            setError('Failed to update TV series. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const Dashboard = () => {
        useEffect(() => {
            if (!isDataLoaded) {
                loadSeries();
            }
        }, [isDataLoaded, loadSeries]);

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
                        isMobile={isMobile}
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
                        isMobile={isMobile}
                    />
                )}
            </div>
        );
    };

    const handleLogout = () => {
        setIsDataLoaded(false);
        setSeries([]);
    };

    return (
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

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>

                <BackToTop />
            </div>
        </Router>
    );
}