import api from '../api';
import { sessionService } from './sessionService';

export const authService = {
    /**
     * Resuelve el ID del tenant a partir de un slug o nombre
     */
    async resolveTenant(slug) {
        if (!slug) return null;
        try {
            const response = await api.get(`/api/plugins/plugin-auth/api/tenants/search?q=${encodeURIComponent(slug)}`);
            const data = response.data.data || response.data;
            const tenant = Array.isArray(data) ? data[0] : data;
            return tenant ? tenant.id : null;
        } catch (error) {
            console.warn('⚠️ Error resolviendo tenant:', error);
            return null;
        }
    },

    /**
     * Realiza el login usando el Plugin Auth de GestasAI
     */
    async login(email, password, tenantSlug = null) {
        try {
            console.log(`🔐 [Auth] Iniciando login para ${email}`);

            let tenantId = null;
            if (tenantSlug) {
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantSlug);
                if (isUuid) {
                    tenantId = tenantSlug;
                } else {
                    tenantId = await this.resolveTenant(tenantSlug);
                }
            }

            const response = await api.post('/api/plugins/plugin-auth/api/login', {
                email,
                password,
                tenantId
            });

            const resultData = response.data.data || response.data;
            const { token, user } = resultData;

            if (!token || !user) {
                throw new Error('Respuesta de login inválida.');
            }

            // Persistir sesión usando el servicio de sesión
            sessionService.setToken(token);
            sessionService.setUser(user);
            if (resultData.refreshToken) {
                sessionService.setRefreshToken(resultData.refreshToken);
            }

            // Intentar refrescar para obtener roles completos si el login no los dio
            // (Esto ayuda si el login inicial no trae toda la info de permisos)
            if (!user.roleName && !user.isSuperAdmin) {
                try {
                    await this.refreshSession();
                } catch (e) {
                    console.warn('⚠️ No se pudo refrescar la sesión tras login:', e);
                }
            }

            return { token, user: sessionService.getUser() || user };
        } catch (error) {
            console.error('❌ [Auth] Error:', error);
            const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al iniciar sesión.';
            throw new Error(message);
        }
    },

    /**
     * Refresca la información del usuario actual desde el servidor
     */
    async refreshSession() {
        try {
            console.log('🔄 [Auth] Refrescando sesión...');
            const response = await api.get('/api/plugins/plugin-auth/api/me');
            const userData = response.data.data || response.data;

            if (userData) {
                sessionService.setUser(userData);
                console.log('✅ [Auth] Sesión refrescada:', userData.email, userData.roleName);
                return userData;
            }
        } catch (error) {
            console.error('❌ [Auth] Error refrescando sesión:', error);
            throw error;
        }
    },

    logout() {
        sessionService.clear();
        window.location.href = '/login';
    },

    // Proxy methods for compatibility
    getUser: () => sessionService.getUser(),
    getToken: () => sessionService.getToken(),
    isAuthenticated: () => sessionService.isAuthenticated(),

    isSuperAdmin: (providedUser) => {
        const user = providedUser || sessionService.getUser();
        if (!user) return false;

        const roleName = (user.roleName || user.role_name || '').toLowerCase().replace(' ', '');
        const roles = user.roles || [];

        return user.isSuperAdmin === true ||
            user.is_super_admin === true ||
            roles.includes('super_admin') ||
            roles.includes('superadmin') ||
            roleName === 'superadmin';
    },

    isAdmin: (providedUser) => {
        const user = providedUser || sessionService.getUser();
        if (!user) return false;
        if (authService.isSuperAdmin(user)) return true;

        const roleName = (user.roleName || user.role_name || '').toLowerCase();
        const roles = user.roles || [];

        return roles.includes('admin') ||
            roles.includes('administrator') ||
            roleName === 'admin' ||
            roleName === 'administrador';
    },

    isEditor: (providedUser) => {
        const user = providedUser || sessionService.getUser();
        if (!user) return false;
        if (authService.isAdmin(user)) return true;

        const roleName = (user.roleName || user.role_name || '').toLowerCase();
        const roles = user.roles || [];

        return roles.includes('editor') || roleName === 'editor';
    },

    isViewer: (providedUser) => {
        const user = providedUser || sessionService.getUser();
        if (!user) return false;
        if (authService.isEditor(user)) return true;

        const roleName = (user.roleName || user.role_name || '').toLowerCase();
        const roles = user.roles || [];

        return roles.includes('viewer') || roles.includes('visor') ||
            roleName === 'viewer' || roleName === 'visor';
    },

    isClient: (providedUser) => {
        const user = providedUser || sessionService.getUser();
        if (!user) return false;

        const roleName = (user.roleName || user.role_name || '').toLowerCase();
        const roles = user.roles || [];

        return roles.includes('client') || roles.includes('cliente') ||
            roleName === 'client' || roleName === 'cliente';
    },

    /**
     * Verifica si el usuario tiene un permiso específico
     * @param {string} permission - Nombre del permiso (ej: 'users:create')
     */
    hasPermission: (permission, providedUser) => {
        const user = providedUser || sessionService.getUser();
        if (!user) return false;
        if (authService.isSuperAdmin(user)) return true;

        // Si el backend devuelve un array de strings en 'permissions'
        const permissions = user.permissions || [];
        if (permissions.includes(permission)) return true;

        // Lógica por defecto basada en roles si no hay permisos explícitos
        if (permission.startsWith('users:')) return authService.isAdmin(user);
        if (permission.startsWith('settings:')) return authService.isAdmin(user);
        if (permission.startsWith('content:')) return authService.isEditor(user);

        return false;
    }
};
