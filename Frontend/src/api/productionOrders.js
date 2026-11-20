import api from './client';

export const getAll = (params) => api.get('/production-orders', { params });
export const getById = (id) => api.get(`/production-orders/${id}`);
export const create = (data) => api.post('/production-orders', data);
export const update = (id, data) => api.patch(`/production-orders/${id}`, data);
export const cancel = (id) => api.patch(`/production-orders/${id}/cancel`);
