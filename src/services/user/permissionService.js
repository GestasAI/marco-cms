import api from '../api';

export const permissionService = {
    async getAllPermissions() {
        try {
            const response = await api.get('/api/admin/permissions');
            const data = response.data.data || response.data || [];

            let flatPermissions = [];

            if (Array.isArray(data)) {
                // Si es un array simple de strings o objetos
                flatPermissions = data.map(p => typeof p === 'string' ? p : (p.name || p.id));
            } else if (typeof data === 'object') {
                // Si es un objeto agrupado (como devuelve el controlador de GestasAI)
                Object.values(data).forEach(group => {
                    if (group.actions && Array.isArray(group.actions)) {
                        group.actions.forEach(action => {
                            flatPermissions.push(action.id || action.name);
                        });
                    }
                });
            }

            return flatPermissions.length > 0 ? flatPermissions.sort() : this.getFallbackPermissions();
        } catch (error) {
            console.error('❌ Error obteniendo permisos:', error);
            return this.getFallbackPermissions();
        }
    },

    getFallbackPermissions() {
        return [
            'users:read', 'users:create', 'users:update', 'users:delete',
            'roles:read', 'roles:create', 'roles:update', 'roles:delete',
            'content:read', 'content:create', 'content:update', 'content:delete',
            'media:read', 'media:upload', 'media:delete',
            'settings:read', 'settings:update'
        ].sort();
    }
};
