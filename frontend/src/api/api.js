import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getCategories = () => api.get('/categories');
export const getDresses = (params) => api.get('/dresses', { params });
export const getDress = (id) => api.get(`/dresses/${id}`);
export const getCategory = (id) => api.get(`/categories/${id}`);

// Services APIs
export const getServices = (params) => api.get('/services', { params });
export const getService = (id) => api.get(`/services/${id}`);

// Vendor APIs
export const getVendors = (params) => api.get('/vendors', { params });
export const getVendor = (id) => api.get(`/vendors/${id}`);

// Auth APIs
export const login = (data) => api.post('/login', data);
export const register = (data) => api.post('/register', data);
export const logout = () => api.post('/logout');
export const getUser = () => api.get('/user');

// Notifications
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/notifications/mark-all-read');
export const clearAllNotifications = () => api.delete('/notifications');

// Favorites
export const getFavorites = () => api.get('/favorites');
export const toggleFavorite = (type, id) => api.post('/favorites/toggle', { type, id });

// Admin Settings
export const getAdminSettings = () => api.get('/admin/settings');
export const updateSettings = (formData) => api.post('/admin/settings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Public Settings
export const getSiteSettings = () => api.get('/settings');

// Ratings
export const submitRating = (type, id, rating) => api.post('/ratings', { type, id, rating });

export default api;
