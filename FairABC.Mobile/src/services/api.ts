import axios from 'axios';
import { API_CONFIG } from '../config/api';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const checkHealth = async () => {
    try {
        const response = await api.get(API_CONFIG.ENDPOINTS.HEALTH);
        return response.data;
    } catch (error) {
        console.error('API Health Check Error:', error);
        throw error;
    }
};

export default api; 