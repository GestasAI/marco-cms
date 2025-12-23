import axios from 'axios';

/**
 * API Service - Centralized Axios Instance
 * 
 * Handles:
 * 1. Base URL configuration (Dev vs Prod)
 * 2. Token injection (User vs Plugin)
 * 3. Request/Response logging
 */

const api = axios.create({
    baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://gestasai.com'),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to determine which token to use
const getAuthToken = (config) => {
    const userToken = localStorage.getItem('marco_token');
    const pluginToken = localStorage.getItem('marco_plugin_token');

    const url = config.url || '';

    // 1. Universal/Bridge/Data paths usually prefer Plugin Token
    const isUniversal = url.includes('/api/universal') || url.includes('/api/bridge');
    const isData = url.includes('/api/data');

    if (isUniversal) return pluginToken || userToken;
    if (isData) return userToken || pluginToken;

    // 2. Admin paths usually prefer User Token
    const isAdmin = url.includes('/api/admin');
    if (isAdmin) return userToken || pluginToken;

    // 3. Default fallback
    return userToken || pluginToken;
};

// Request Interceptor
api.interceptors.request.use((config) => {
    const token = getAuthToken(config);

    // Always send the plugin key if we have it
    config.headers['X-Plugin-Key'] = 'marco-cms';

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;

        // Debug logging (only in dev)
        if (import.meta.env.DEV) {
            const userToken = localStorage.getItem('marco_token');
            const tokenType = (token === userToken) ? 'USER' : 'PLUGIN';
            console.log(`📡 [API] ${config.method?.toUpperCase()} ${config.url} | Token: ${tokenType}`);
        }
    } else {
        console.warn(`📡 [API] ${config.method?.toUpperCase()} ${config.url} | NO TOKEN`);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response, config } = error;
        if (response) {
            console.error(`❌ [API] ${config.method?.toUpperCase()} ${config.url} | Status: ${response.status} | Error:`, response.data);
            if (response.status === 401) {
                console.error('❌ [API] 401 Unauthorized - Session might be expired');
            }
        } else {
            console.error(`❌ [API] ${config?.method?.toUpperCase()} ${config?.url} | Network Error:`, error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
