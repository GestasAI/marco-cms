import axios from 'axios';
import { API_URL } from '../config';

/**
 * Servicio para gestionar temas en Marco CMS
 * Usa GestasCore-ACIDE para almacenar configuraciones
 */
class ThemeService {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Interceptor para agregar token
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('marco_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    /**
     * Obtiene la configuración del tema activo
     */
    async getSettings() {
        try {
            const response = await this.api.post('/api/bridge/query', {
                collection: 'theme_settings',
                where: { id: 'current-theme' },
                limit: 1
            });

            const settings = response.data.data?.[0];

            if (!settings) {
                // Si no existe, crear configuración por defecto
                return await this.createDefaultSettings();
            }

            return settings;
        } catch (error) {
            console.error('Error loading theme settings:', error);
            return await this.getDefaultSettings();
        }
    }

    /**
     * Guarda la configuración del tema
     */
    async saveSettings(settings) {
        try {
            const existing = await this.api.post('/api/bridge/query', {
                collection: 'theme_settings',
                where: { id: 'current-theme' },
                limit: 1
            });

            if (existing.data.data?.length > 0) {
                // Actualizar existente
                await this.api.post('/api/bridge/update', {
                    collection: 'theme_settings',
                    where: { id: 'current-theme' },
                    updates: {
                        ...settings,
                        updated_at: new Date().toISOString()
                    }
                });
            } else {
                // Crear nuevo
                await this.api.post('/api/bridge/insert', {
                    collection: 'theme_settings',
                    document: {
                        ...settings,
                        id: 'current-theme',
                        created_at: new Date().toISOString()
                    }
                });
            }

            return true;
        } catch (error) {
            console.error('Error saving theme settings:', error);
            throw error;
        }
    }

    /**
     * Obtiene la configuración por defecto del tema GestasAI
     */
    getDefaultSettings() {
        return {
            id: 'current-theme',
            theme_key: 'gestasai-default',
            theme_name: 'GestasAI Default',
            colors: {
                primary: '#3B82F6',      // Blue
                secondary: '#8B5CF6',    // Purple
                accent: '#10B981',       // Green
                background: '#FFFFFF',   // White
                surface: '#F9FAFB',      // Light Gray
                text: '#1F2937',         // Dark Gray
                textLight: '#6B7280',    // Medium Gray
                border: '#E5E7EB',       // Light Border
                success: '#10B981',      // Green
                warning: '#F59E0B',      // Amber
                error: '#EF4444',        // Red
                info: '#3B82F6'          // Blue
            },
            typography: {
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                headingFont: "'Outfit', 'Inter', sans-serif",
                monoFont: "'Fira Code', 'Courier New', monospace",
                fontSize: {
                    xs: '0.75rem',       // 12px
                    sm: '0.875rem',      // 14px
                    base: '1rem',        // 16px
                    lg: '1.125rem',      // 18px
                    xl: '1.25rem',       // 20px
                    '2xl': '1.5rem',     // 24px
                    '3xl': '1.875rem',   // 30px
                    '4xl': '2.25rem',    // 36px
                    '5xl': '3rem',       // 48px
                    '6xl': '3.75rem',    // 60px
                    '7xl': '4.5rem',     // 72px
                    '8xl': '6rem'        // 96px
                },
                fontWeight: {
                    light: 300,
                    normal: 400,
                    medium: 500,
                    semibold: 600,
                    bold: 700,
                    extrabold: 800
                },
                lineHeight: {
                    tight: 1.25,
                    normal: 1.5,
                    relaxed: 1.75,
                    loose: 2
                }
            },
            layout: {
                containerWidth: '1280px',
                containerPadding: '1.5rem',
                spacing: {
                    xs: '0.25rem',
                    sm: '0.5rem',
                    md: '1rem',
                    lg: '1.5rem',
                    xl: '2rem',
                    '2xl': '3rem',
                    '3xl': '4rem'
                },
                borderRadius: {
                    sm: '0.25rem',
                    md: '0.5rem',
                    lg: '0.75rem',
                    xl: '1rem',
                    '2xl': '1.5rem',
                    full: '9999px'
                },
                shadows: {
                    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }
            },
            header: {
                fixed: true,
                height: '4rem',
                transparent: false,
                blur: true
            },
            footer: {
                showSocial: true,
                showNewsletter: true,
                columns: 4
            },
            animations: {
                enabled: true,
                duration: 300,
                easing: 'ease-in-out'
            }
        };
    }

    /**
     * Crea la configuración por defecto en la base de datos
     */
    async createDefaultSettings() {
        const defaultSettings = this.getDefaultSettings();
        await this.saveSettings(defaultSettings);
        return defaultSettings;
    }

    /**
     * Resetea el tema a la configuración por defecto
     */
    async resetToDefault() {
        const defaultSettings = this.getDefaultSettings();
        await this.saveSettings(defaultSettings);
        return defaultSettings;
    }
}

export const themeService = new ThemeService();
