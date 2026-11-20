import api from './client';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const getProfile = () => api.get('/auth/profile');
export const createUser = (data) => api.post('/users', data);
export const listUsers = () => api.get('/users');
