import api from '../api';

export const roleService = {
    async getAllRoles() {
        const response = await api.get('/api/admin/roles');
        return response.data.data || response.data || [];
    },

    async createRole(roleData) {
        const response = await api.post('/api/admin/roles', roleData);
        return response.data.data || response.data;
    },

    async updateRole(id, roleData) {
        const response = await api.put(`/api/admin/roles/${id}`, roleData);
        return response.data.data || response.data;
    },

    async deleteRole(id) {
        const response = await api.delete(`/api/admin/roles/${id}`);
        return response.data;
    }
};
