import api from './api';

export const userService = {
    // AUTH CHECK
    async getMe() {
        const response = await api.get('/api/plugins/plugin-auth/api/me');
        return response.data.data || response.data;
    },

    // USUARIOS (Users) - Usar /api/admin directamente
    async getAllUsers() {
        const response = await api.get('/api/admin/users');
        return response.data.data || response.data || [];
    },

    async getUserById(id) {
        const response = await api.get(`/api/admin/users/${id}`);
        return response.data.data || response.data;
    },

    async createUser(userData) {
        const payload = {
            name: userData.full_name || userData.fullName || userData.name,
            email: userData.email,
            password: userData.password,
            roles: userData.role_id ? [userData.role_id] : (userData.roles || ['viewer']),
            status: userData.status || 'active',
            tenantId: userData.tenant_id || userData.tenantId || '00000000-0000-0000-0000-000000000000'
        };

        const response = await api.post('/api/admin/users', payload);
        return response.data.data || response.data;
    },

    async updateUser(id, userData) {
        const updates = {
            name: userData.full_name || userData.fullName || userData.name,
            email: userData.email,
            roles: userData.role_id ? [userData.role_id] : userData.roles,
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
    },

    // ROLES
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
    },

    // PERMISOS
    async getAllPermissions() {
        try {
            const response = await api.get('/api/admin/permissions');
            let perms = response.data.data || response.data || [];

            if (perms.length > 0 && typeof perms[0] === 'object') {
                perms = perms.map(p => p.name);
            }

            return Array.isArray(perms) ? perms.sort() : [];
        } catch (error) {
            console.error('❌ Error obteniendo permisos:', error);
            // Fallback
            return [
                'users:read', 'users:create', 'users:update', 'users:delete',
                'roles:read', 'roles:create', 'roles:update', 'roles:delete',
                'content:read', 'content:create', 'content:update', 'content:delete',
                'media:read', 'media:upload', 'media:delete',
                'settings:read', 'settings:update'
            ].sort();
        }
    }
};
