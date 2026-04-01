import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
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
export const getServices = () => api.get('/services');
export const getService = (id) => api.get(`/services/${id}`);

// Auth APIs
export const login = (data) => api.post('/login', data);
export const register = (data) => api.post('/register', data);
export const logout = () => api.post('/logout');
export const getUser = () => api.get('/user');

export default api;
