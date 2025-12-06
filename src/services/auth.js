import api from './api';

export const authService = {
    /**
     * Resuelve el ID del tenant a partir de un slug o nombre
     */
    async resolveTenant(slug) {
        if (!slug) return null;
        try {
            // Intentamos buscar a través del endpoint del plugin auth
            const response = await api.get(`/api/plugins/plugin-auth/api/tenants/search?q=${encodeURIComponent(slug)}`);
            const data = response.data.data || response.data;

            // Asumiendo que devuelve una lista o un objeto tenant
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
            console.log(`🔐 [Auth] Iniciando login para ${email} (Tenant: ${tenantSlug || 'Global/System'})`);

            let tenantId = null;

            // Solo si se proporciona un slug explícito intentamos resolverlo
            if (tenantSlug) {
                // Si el slug ya parece un UUID, lo usamos directamente
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantSlug);

                if (isUuid) {
                    tenantId = tenantSlug;
                } else {
                    const resolvedId = await this.resolveTenant(tenantSlug);
                    if (resolvedId) {
                        console.log(`✅ Tenant "${tenantSlug}" resuelto a ID: ${resolvedId}`);
                        tenantId = resolvedId;
                    } else {
                        console.warn(`⚠️ No se pudo resolver el tenant "${tenantSlug}". Se intentará login sin tenant.`);
                        // IMPORTANTE: No enviar el slug string si falló la resolución, enviar null
                        tenantId = null;
                    }
                }
            }

            // 2. Llamada al endpoint de login del Plugin Auth
            // Ruta confirmada en docs/plugin-auth/src/routes/auth.routes.js
            const response = await api.post('/api/plugins/plugin-auth/api/login', {
                email,
                password,
                tenantId: tenantId // Enviará null si no hay tenant, evitando error UUID
            });

            console.log('✅ [Auth] Login exitoso');

            // La respuesta del AuthController es { status: 'success', data: { token, user } }
            // Axios pone el body en response.data
            const resultData = response.data.data || response.data;
            const { token, user } = resultData;

            if (!token || !user) {
                console.error('Respuesta login malformada:', response.data);
                throw new Error('Respuesta de login inválida (falta token o usuario).');
            }

            // 3. Persistir sesión
            localStorage.setItem('marco_token', token);
            localStorage.setItem('marco_user', JSON.stringify(user));

            // Si hay un refresh token, lo guardamos también
            if (resultData.refreshToken) {
                localStorage.setItem('marco_refresh_token', resultData.refreshToken);
            }

            return { token, user };

        } catch (error) {
            console.error('❌ [Auth] Error:', error);

            const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al iniciar sesión.';

            if (error.response?.status === 404) {
                throw new Error('Servicio de autenticación no encontrado (404). Verifica que el plugin-auth esté activo.');
            }

            throw new Error(message);
        }
    },

    logout() {
        localStorage.removeItem('marco_token');
        localStorage.removeItem('marco_user');
        localStorage.removeItem('marco_refresh_token');
        window.location.href = '/login';
    },

    getUser() {
        const userStr = localStorage.getItem('marco_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken() {
        return localStorage.getItem('marco_token');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};
