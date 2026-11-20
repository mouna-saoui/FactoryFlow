import api from './client';

export const getAll = () => api.get('/raw-materials');
export const getAlerts = () => api.get('/raw-materials/alerts');
export const getById = (id) => api.get(`/raw-materials/${id}`);
export const create = (data) => api.post('/raw-materials', data);
export const update = (id, data) => api.patch(`/raw-materials/${id}`, data);
