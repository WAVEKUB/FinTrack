import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('Authorization');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || 'An unexpected error occurred';
        toast.error(message);
        return Promise.reject(error);
    }
);

export default api;
