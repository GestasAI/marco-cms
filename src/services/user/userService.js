import api from '../api';

export const userService = {
    async getMe() {
        const response = await api.get('/api/plugins/plugin-auth/api/me');
        return response.data.data || response.data;
    },

    async getAllUsers() {
        const response = await api.get('/api/admin/users');
        return response.data.data || response.data || [];
    },

    async getUserById(id) {
        const response = await api.get(`/api/admin/users/${id}`);
        return response.data.data || response.data;
    },

    async createUser(userData) {
        const roleId = userData.role_id;
        const roles = userData.roles || (roleId ? [roleId] : ['viewer']);
        const fullName = userData.full_name || userData.fullName || userData.name;

        const payload = {
            name: fullName,
            fullName: fullName,
            email: userData.email,
            password: userData.password,
            roles: roles,
            roleId: roleId,
            status: userData.status || 'active',
            tenantId: userData.tenant_id || userData.tenantId || '00000000-0000-0000-0000-000000000000'
        };

        const response = await api.post('/api/admin/users', payload);
        return response.data.data || response.data;
    },

    async updateUser(id, userData) {
        const roleId = userData.role_id;
        const roles = userData.roles || (roleId ? [roleId] : undefined);
        const fullName = userData.full_name || userData.fullName || userData.name;

        const updates = {
            name: fullName,
            fullName: fullName,
            email: userData.email,
            roles: roles,
            roleId: roleId,
            status: userData.status,
            tenantId: userData.tenant_id || userData.tenantId
        };

        if (userData.password) {
            updates.password = userData.password;
        }

        Object.keys(updates).forEach(key => {
            if (updates[key] === undefined) delete updates[key];
        });

        const response = await api.put(`/api/admin/users/${id}`, updates);
        return response.data.data || response.data;
    },

    async deleteUser(id) {
        const response = await api.delete(`/api/admin/users/${id}`);
        return response.data;
    }
};
