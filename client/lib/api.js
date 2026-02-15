import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const createClip = async (content, expiryMinutes, password) => {
    const response = await api.post('/clips/create', { content, expiryMinutes, password });
    return response.data;
};

export const getClip = async (shortId, password) => {
    const params = password ? { password } : {};
    const response = await api.get(`/clips/${shortId}`, { params });
    return response.data;
};

export default api;
