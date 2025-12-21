/**
 * ACIDE Service - Hybrid Client (Static Read / Dynamic Write)
 * 
 * ARCHITECTURE COMPLIANCE:
 * - Reads: Fetch static JSON files directly (ZERO PHP)
 * - Writes: Call ACIDE-PHP backend (Admin only)
 */

const API_URL = '/acide/index.php';

// Determine base URL for static assets (deploy agnostic)
const BASE_URL = import.meta.env.BASE_URL;
const CLEAN_BASE = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
const DATA_URL = `${CLEAN_BASE}data`;

export const acideService = {

    /**
     * PRIVATE: Low-level request to PHP Backend (Admin Write Operations)
     */
    async _phpRequest(action, collection, id = null, data = null) {
        const payload = { action, collection, id, data };
        const headers = { 'Content-Type': 'application/json' };

        // Use 'marco_token' to match authService convention
        const token = localStorage.getItem('marco_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Try to read error text
                const errorText = await response.text();
                throw new Error(`ACIDE Error ${response.status}: ${errorText}`);
            }

            const json = await response.json();
            if (json.status === 'error') throw new Error(json.message);

            return json.data;
        } catch (error) {
            console.error("ACIDE Write Error:", error);
            throw error;
        }
    },

    /**
     * PUBLIC: Read static JSON file (Visitor Read Operations)
     * Bypasses PHP completely.
     */
    async _staticRead(collection, filename) {
        // Cache busting only if explicitly needed, otherwise let browser cache
        // For 'current.json' logic, we might want fresh data.
        const url = `${DATA_URL}/${collection}/${filename}.json?t=${Date.now()}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) return null; // Not found
                throw new Error(`Static Read Error ${response.status}`);
            }

            // ROBUSTNESS: Check if response is HTML (happens on 404 fallback)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.warn(`Failed to read static file: ${url}`, error);
            return null; // Return null on any parse/fetch error to avoid crashing
        }
    },

    // =========================================================================
    // CRUD INTERFACE
    // =========================================================================

    // READ (Static)
    get: async (collection, id) => {
        const data = await acideService._staticRead(collection, id);
        if (!data) throw new Error(`Document not found: ${collection}/${id}`);
        return data;
    },

    // LIST (Static - Reads _index.json)
    list: async (collection) => {
        // Try to read the generated index
        const indexData = await acideService._staticRead(collection, '_index');
        return indexData || [];
    },

    // QUERY (Static - Reads index + Client-side Filter)
    query: async (collection, params = {}) => {
        let items = await acideService.list(collection);

        // 1. Filtering
        if (params.where) {
            items = items.filter(item => {
                return params.where.every(([field, operator, value]) => {
                    if (operator === '==') return item[field] == value;
                    if (operator === 'contains') return item[field]?.includes(value);
                    return true;
                });
            });
        }

        // 2. Sorting
        if (params.orderBy) {
            const [field, direction] = Object.entries(params.orderBy)[0];
            items.sort((a, b) => {
                const valA = a[field];
                const valB = b[field];
                if (valA < valB) return direction === 'asc' ? -1 : 1;
                if (valA > valB) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // 3. Pagination
        if (params.limit || params.offset) {
            const offset = params.offset || 0;
            const limit = params.limit || items.length;
            items = items.slice(offset, offset + limit);
        }

        return items;
    },

    // WRITE OPERATIONS (Dynamic - calls PHP)

    update: async (collection, id, data) => {
        return acideService._phpRequest('update', collection, id, data);
    },

    create: async (collection, data) => { // Alias
        const id = data.id || null;
        return acideService._phpRequest('update', collection, id, data); // PHP 'update' handles creation
    },

    delete: async (collection, id) => {
        return acideService._phpRequest('delete', collection, id);
    },

    upload: async (file) => {
        // Validation handled by backend, but we need FormData
        const formData = new FormData();
        formData.append('action', 'upload');
        formData.append('file', file);

        const headers = {};
        const token = localStorage.getItem('marco_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        if (json.status === 'error') throw new Error(json.message);
        return json.data;
    },

    // Theme Management
    listThemes: async () => acideService._phpRequest('list_themes'),
    activateTheme: async (themeId) => {
        const payload = { action: 'activate_theme', theme_id: themeId };
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('marco_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ACIDE Error ${response.status}: ${errorText}`);
        }

        const json = await response.json();
        if (json.status === 'error') throw new Error(json.message);
        return json.data;
    },

    // Theme Parts Management
    saveThemePart: async (themeId, partName, data) => {
        return acideService._phpRequest('save_theme_part', null, null, {
            theme_id: themeId,
            part_name: partName,
            ...data
        });
    },
    loadThemePart: async (themeId, partName) => {
        return acideService._phpRequest('load_theme_part', null, null, {
            theme_id: themeId,
            part_name: partName
        });
    },

    // Plugin Management (Local)
    listPlugins: async () => acideService.list('plugins'),

    
    
    // Theme Home Page
    getActiveThemeHome: async () => {
        const payload = { action: 'get_active_theme_home' };
        const headers = { 'Content-Type': 'application/json' };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        if (json.status === 'error') throw new Error(json.message);
        return json.data;
    },

    getActiveThemeId: async () => {
        const payload = { action: 'get_active_theme_id' };
        const headers = { 'Content-Type': 'application/json' };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        if (json.status === 'error') throw new Error(json.message);
        return json.data;
    },

    // Static Site Generation
    buildSite: async () => {
        const payload = { action: 'build_site' };
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('marco_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        if (json.status === 'error') throw new Error(json.message);
        return json.data;
    },

    generateSitemap: async (baseUrl = 'https://example.com') => {
        const payload = { action: 'generate_sitemap', base_url: baseUrl };
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('marco_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        if (json.status === 'error') throw new Error(json.message);
        return json.data;
    },

    // Legacy Aliases
    request: async (action, collection, id, data) => acideService._phpRequest(action, collection, id, data),
    findById: async (collection, id) => acideService.get(collection, id)
};




