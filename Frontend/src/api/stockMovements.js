import api from './client';

export const getAll = (params) => api.get('/stock-movements', { params });
export const create = (data) => api.post('/stock-movements', data);
