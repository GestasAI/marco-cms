import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://gestasai.com'),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const userToken = localStorage.getItem('marco_token');
    const pluginToken = localStorage.getItem('marco_plugin_token');

    // Determinamos qué token usar según la ruta
    const isUniversalPath = config.url.includes('/api/universal') || config.url.includes('/api/bridge') || config.url.includes('/api/data');

    // Para /api/data (usuarios, roles, etc.) usamos el token de USUARIO
    // Para /api/universal y /api/bridge usamos el token de plugin
    const isDataPath = config.url.includes('/api/data');
    const token = isDataPath ? (userToken || pluginToken) : (isUniversalPath ? (pluginToken || userToken) : (userToken || pluginToken));

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        const tokenType = (token === userToken) ? 'USER' : 'PLUGIN';
        console.log(`📡 [API] Request to ${config.url} with ${tokenType} token: ${token.substring(0, 10)}...`);
    } else {
        console.warn(`📡 [API] Request to ${config.url} WITHOUT token`);
    }
    return config;
});

export default api;
