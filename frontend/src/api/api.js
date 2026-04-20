import axios from 'axios';

export const BASE_URL = 'https://queenn.vercel.app';
const API_BASE_URL = BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
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

export const getCategories = () => api.get('/api/categories');
export const getDresses = (params) => api.get('/api/dresses', { params });
export const getDress = (id) => api.get(`/api/dresses/${id}`);
export const getCategory = (id) => api.get(`/api/categories/${id}`);

// Dress Management
export const createDress = (formData) => api.post('/api/admin/dresses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateDress = (id, formData) => api.post(`/api/admin/dresses/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteDress = (id) => api.delete(`/api/admin/dresses/${id}`);

// Services APIs
export const getServices = (params) => api.get('/api/services', { params });
export const getService = (id) => api.get(`/api/services/${id}`);

// Vendor APIs
export const getVendors = (params) => api.get('/vendors', { params });
export const getVendor = (id) => api.get(`/vendors/${id}`);

// Auth APIs
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/api/register', data);
export const logout = () => api.post('/api/logout');
export const getUser = () => api.get('/api/user');

// Notifications
export const getNotifications = () => api.get('/api/notifications');
export const markNotificationRead = (id) => api.put(`/api/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/api/notifications/mark-all-read');
export const clearAllNotifications = () => api.delete('/api/notifications');

// Favorites
export const getFavorites = () => api.get('/api/favorites');
export const toggleFavorite = (type, id) => api.post('/api/favorites/toggle', { type, id });

// Admin Settings
export const getAdminSettings = () => api.get('/api/admin/settings');
export const updateSettings = (formData) => api.post('/api/admin/settings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Admin User/Vendor Management
export const adminGetUsers = () => api.get('/api/admin/users');
export const adminGetVendors = (params) => api.get('/api/admin/vendors', { params });
export const updateUserStatus = (id, status) => api.put(`/api/admin/users/${id}/status`, { status });
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);

// Public Settings
export const getSiteSettings = () => api.get('/api/settings');

// Ratings
export const submitRating = (type, id, rating) => api.post('/api/ratings', { type, id, rating });

export default api;
