/**
 * Plugin Registry Service for Marco CMS
 * 
 * Handles registration and communication with GestasAI System Service
 */

import api from './api';

export const pluginRegistry = {
    /**
     * Register Marco CMS with GestasAI System Service
     * Endpoint: /api/plugins/register
     */
    async register() {
        try {
            console.log('📦 Marco CMS: Registering with GestasAI...');

            // Manifest definition
            const manifest = {
                key: 'marco-cms',
                name: 'Marco CMS',
                version: '1.0.0',
                description: 'Sistema de Gestión de Contenidos moderno y potente. Cliente web standalone que se integra con GestasAI para autenticación y almacenamiento de contenidos vía GestasCore-ACIDE.',
                category: 'WEB',
                author: 'GestasAI Team',
                homepage: '/marco',
                license: 'MIT',
                icon: 'FileText',
                type: 'CLIENT',
                capabilities: [
                    'content:create',
                    'content:read',
                    'content:update',
                    'content:delete',
                    'auth:client',
                    'admin:users',
                    'admin:roles',
                    'admin:permissions'
                ],
                permissions: [
                    'auth:login',
                    'content:read',
                    'content:write',
                    'content:delete',
                    'users:read',
                    'users:write',
                    'roles:read',
                    'permissions:read'
                ],
                network: {
                    strategy: 'external_client',
                    host: window.location.hostname,
                    port: window.location.port || 80,
                    health_check: '/'
                },
                ai: {
                    enabled: true,
                    description: 'Sistema de gestión de contenidos que utiliza GestasAI para autenticación (Plugin Auth) y almacenamiento (GestasCore-ACIDE). Permite crear, editar y publicar contenidos de forma intuitiva.',
                    tools: [
                        'marco_create_content',
                        'marco_edit_content',
                        'marco_delete_content',
                        'marco_list_contents',
                        'marco_publish_content'
                    ],
                    context_endpoint: '/api/marco/context'
                }
            };

            // Register via System Service
            const response = await api.post('/api/plugins/register', manifest);

            console.log('✅ Marco CMS registered successfully!');
            console.log('Registration data:', response.data);

            // Store plugin token if provided
            if (response.data.token) {
                localStorage.setItem('marco_plugin_token', response.data.token);
            }

            return response.data;
        } catch (error) {
            console.warn('⚠️ Plugin registration failed (Marco CMS works standalone):', error.response?.data || error.message);
            // Don't throw - Marco CMS works standalone even if registration fails
            return null;
        }
    },

    /**
     * Get list of all plugins
     * Endpoint: /api/system/plugins
     */
    async listPlugins() {
        try {
            const response = await api.get('/api/system/plugins');
            console.log('📋 Plugins list:', response.data);
            return response.data || [];
        } catch (error) {
            console.error('❌ Error listing plugins:', error.response?.data || error.message);
            return [];
        }
    },

    /**
     * Get current manifest
     */
    getManifest() {
        return {
            key: 'marco-cms',
            name: 'Marco CMS',
            version: '1.0.0',
            description: 'Sistema de Gestión de Contenidos moderno y potente.',
            category: 'WEB',
            type: 'CLIENT',
            ai: {
                enabled: true
            }
        };
    }
};

// Auto-register on module load (optional)
// Uncomment if you want automatic registration
// pluginRegistry.register();
