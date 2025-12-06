/**
 * Plugin Registry Service for Marco CMS
 * 
 * Handles registration and communication with GestasAI Universal API
 */

import api from './api';

export const pluginRegistry = {
    /**
     * Register Marco CMS with GestasAI Universal API
     * Endpoint: /api/universal/register
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
                    'universal_api:query',
                    'universal_api:insert',
                    'universal_api:update',
                    'universal_api:delete'
                ],
                permissions: [
                    'auth:login',
                    'content:read',
                    'content:write',
                    'content:delete',
                    'bridge:query',
                    'bridge:insert',
                    'bridge:update',
                    'bridge:delete'
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

            // Register via Universal API
            const response = await api.post('/api/universal/register', {
                manifest
            });

            console.log('✅ Marco CMS registered successfully!');
            console.log('Registration data:', response.data);

            // Store plugin token if provided
            if (response.data.token) {
                localStorage.setItem('marco_plugin_token', response.data.token);
            }

            return response.data;
        } catch (error) {
            console.error('❌ Error registering Marco CMS:', error.response?.data || error.message);
            // Don't throw - Marco CMS works standalone even if registration fails
            return null;
        }
    },

    /**
     * Send heartbeat to keep plugin alive
     * Endpoint: /api/universal/heartbeat
     */
    async heartbeat() {
        try {
            const response = await api.post('/api/universal/heartbeat', {
                key: 'marco-cms'
            });

            console.log('💓 Heartbeat sent:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Heartbeat error:', error.response?.data || error.message);
            return null;
        }
    },

    /**
     * Get list of all plugins
     * Endpoint: /api/universal/plugins
     */
    async listPlugins() {
        try {
            const response = await api.get('/api/universal/plugins');
            console.log('📋 Plugins list:', response.data);
            return response.data.plugins || [];
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
