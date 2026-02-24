import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const trackerAPI = {
    getAll: () => api.get('/trackers'),
    getById: (id) => api.get(`/trackers/${id}`),
    update: (id, data) => api.put(`/trackers/${id}`, data),
};

export const entryAPI = {
    getForMonth: (trackerId, year, month) =>
        api.get(`/trackers/${trackerId}/entries`, { params: { year, month } }),
    upsert: (data) => api.post('/entries', data),
    updateStatus: (id, status) => api.put(`/entries/${id}/status`, { status }),
    delete: (id) => api.delete(`/entries/${id}`),
};

export const taskAPI = {
    getForEntry: (entryId) => api.get(`/entries/${entryId}/tasks`),
    create: (data) => api.post('/tasks', data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    delete: (id) => api.delete(`/tasks/${id}`),
};

export const statsAPI = {
    getMonthly: (trackerId, year, month) =>
        api.get(`/stats/tracker/${trackerId}`, { params: { year, month } }),
    getAll: (trackerIds, year, month) =>
        api.get('/stats/all', { params: { tracker_ids: trackerIds.join(','), year, month } }),
};

export default api;
