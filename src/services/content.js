import api from './api';

export const contentService = {
    async getAll() {
        try {
            const response = await api.post('/api/bridge/query', {
                collection: 'marco_content',
                orderBy: { created_at: 'DESC' }
            });
            return response.data.data || response.data || [];
        } catch (error) {
            console.error('Error fetching content:', error);
            return [];
        }
    },

    async create(data) {
        const response = await api.post('/api/bridge/insert', {
            collection: 'marco_content',
            document: {
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        });
        return response.data;
    },

    async update(id, data) {
        const response = await api.post('/api/bridge/update', {
            collection: 'marco_content',
            where: { id },
            updates: {
                ...data,
                updated_at: new Date().toISOString()
            }
        });
        return response.data;
    },

    async delete(id) {
        const response = await api.post('/api/bridge/delete', {
            collection: 'marco_content',
            where: { id }
        });
        return response.data;
    }
};
