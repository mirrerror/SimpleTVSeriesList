import { authAxios } from './AuthService';

const API_URL = '/api/series';

export const fetchSeries = async (page = 0, size = 10, sortBy = 'status', sortDirection = 'desc', status = '') => {
    try {
        console.log('Fetching series with params:', { page, size, sortBy, sortDirection, status });
        const response = await authAxios.get(API_URL, {
            params: {
                page,
                size,
                sortBy,
                sortDirection,
                status: status !== 'all' ? status : ''
            }
        });

        console.log('Raw API response:', response.data);

        if (response.data) {
            const seriesArray = response.data.series || [];
            const totalPages = response.data.totalPages || 0;
            const totalElements = response.data.totalElements || 0;

            console.log('Processed series array:', seriesArray);
            console.log('Pagination info:', { totalPages, totalElements });

            return {
                content: seriesArray.map(transformSeriesFromBackend),
                pagination: {
                    page,
                    size,
                    sortBy,
                    sortDirection,
                    status,
                    totalPages,
                    totalElements
                }
            };
        } else {
            console.warn('Received empty response data');
            return {
                content: [],
                pagination: {
                    page,
                    size,
                    sortBy,
                    sortDirection,
                    status,
                    totalPages: 0,
                    totalElements: 0
                }
            };
        }
    } catch (error) {
        console.error('Error fetching series:', error);
        throw error;
    }
};

export const createSeries = async (series) => {
    try {
        const seriesDto = transformSeriesToBackend(series);
        console.log('Sending to backend:', seriesDto);
        const response = await authAxios.post(API_URL, seriesDto);
        console.log('Backend response:', response.data);
        return transformSeriesFromBackend(response.data);
    } catch (error) {
        console.error('Error creating series:', error);
        throw error;
    }
};

export const updateSeries = async (series) => {
    try {
        const seriesDto = transformSeriesToBackend(series);
        console.log('Updating series:', seriesDto);
        const response = await authAxios.put(`${API_URL}/${series.id}`, seriesDto);
        console.log('Backend response after update:', response.data);
        return transformSeriesFromBackend(response.data);
    } catch (error) {
        console.error('Error updating series:', error);
        throw error;
    }
};

export const deleteSeries = async (id) => {
    try {
        await authAxios.delete(`${API_URL}/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting series:', error);
        throw error;
    }
};

const transformSeriesToBackend = (series) => {
    return {
        title: series.title || '',
        genre: series.genre || '',
        status: series.status ? mapStatusToBackend(series.status) : 'WATCHING',
        imageLink: series.imageLink || '',
        link: series.link || '',
        rating: series.rating ? parseInt(series.rating) : null
    };
};

const transformSeriesFromBackend = (series) => {
    if (!series) {
        console.warn('Received undefined or null series data from backend');
        return {
            id: 'temp-' + Date.now(),
            title: '',
            genre: '',
            status: 'Watching',
            imageLink: '',
            link: '',
            rating: null,
            dateAdded: new Date().toISOString()
        };
    }

    return {
        id: series.id ? series.id.toString() : 'temp-' + Date.now(),
        title: series.title || '',
        genre: series.genre || '',
        status: mapStatusFromBackend(series.status) || 'Watching',
        imageLink: series.imageLink || '',
        link: series.link || '',
        rating: series.rating ? series.rating.toString() : null,
        dateAdded: series.createdAt ? new Date(series.createdAt).toISOString() : new Date().toISOString()
    };
};

const mapStatusToBackend = (status) => {
    switch (status) {
        case 'Watching':
            return 'WATCHING';
        case 'Watched':
            return 'WATCHED';
        case 'Plan to Watch':
            return 'PLAN_TO_WATCH';
        default:
            return 'WATCHING';
    }
};

const mapStatusFromBackend = (status) => {
    const statusStr = typeof status === 'string' ? status :
        (status && status.toString) ? status.toString() : 'WATCHING';

    switch (statusStr) {
        case 'WATCHING':
            return 'Watching';
        case 'WATCHED':
            return 'Watched';
        case 'PLAN_TO_WATCH':
            return 'Plan to Watch';
        default:
            return 'Watching';
    }
};

export default {
    fetchSeries,
    createSeries,
    updateSeries,
    deleteSeries
};