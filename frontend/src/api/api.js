import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'https://queen-bay.vercel.app/api';
const API_BASE_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

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

export const getCategories = () => api.get('/categories');
export const getDresses = (params) => api.get('/dresses', { params });
export const getDress = (id) => api.get(`/dresses/${id}`);
export const getCategory = (id) => api.get(`/categories/${id}`);

// Dress Management
export const createDress = (formData) => api.post('/admin/dresses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateDress = (id, formData) => api.post(`/admin/dresses/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteDress = (id) => api.delete(`/admin/dresses/${id}`);

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

// Admin User/Vendor Management
export const adminGetUsers = () => api.get('/admin/users');
export const adminGetVendors = (params) => api.get('/admin/vendors', { params });
export const updateUserStatus = (id, status) => api.put(`/admin/users/${id}/status`, { status });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Public Settings
export const getSiteSettings = () => api.get('/settings');

// Ratings
export const submitRating = (type, id, rating) => api.post('/ratings', { type, id, rating });

export default api;
