const db = require('../db');

/**
 * Controlador de configuración del sistema
 * Por ahora usa valores en memoria, pero preparado para persistencia en DB
 */

// Configuración por defecto del sistema
const DEFAULT_SETTINGS = {
    general: {
        siteName: 'GestasAI Platform',
        siteDescription: 'Plataforma de gestión empresarial inteligente',
        supportEmail: 'soporte@gestas.ai',
        language: 'es',
        timezone: 'Europe/Madrid',
        maintenanceMode: false
    },
    security: {
        passwordMinLength: 8,
        requireSpecialChar: true,
        requireNumbers: true,
        sessionTimeout: 60, // minutos
        maxLoginAttempts: 5,
        enable2FA: false
    },
    email: {
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
        smtpUser: 'notifications@gestas.ai',
        smtpSecure: true,
        senderName: 'GestasAI Notificaciones'
    },
    integrations: {
        googleAnalyticsId: '',
        slackWebhookUrl: '',
        sentryDsn: ''
    }
};

// Cache de configuración en memoria (temporal)
let settingsCache = { ...DEFAULT_SETTINGS };

// Obtener toda la configuración
exports.getAllSettings = async (req, res) => {
    try {
        // TODO: En el futuro, obtener de la base de datos
        // const result = await db.query('SELECT * FROM system_settings');

        res.json({
            status: 'success',
            data: settingsCache
        });
    } catch (error) {
        console.error('Error getting settings:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Obtener configuración por categoría
exports.getSettingsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!settingsCache[category]) {
            return res.status(404).json({
                status: 'error',
                message: `Categoría '${category}' no encontrada`
            });
        }

        res.json({
            status: 'success',
            data: settingsCache[category]
        });
    } catch (error) {
        console.error('Error getting settings by category:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Actualizar configuración
exports.updateSettings = async (req, res) => {
    try {
        const updates = req.body;

        // Validar que las categorías existan
        for (const category in updates) {
            if (!DEFAULT_SETTINGS.hasOwnProperty(category)) {
                return res.status(400).json({
                    status: 'error',
                    message: `Categoría '${category}' no válida`
                });
            }
        }

        // Validaciones específicas
        if (updates.security) {
            const { passwordMinLength, sessionTimeout, maxLoginAttempts } = updates.security;

            if (passwordMinLength && (passwordMinLength < 6 || passwordMinLength > 32)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'La longitud mínima de contraseña debe estar entre 6 y 32 caracteres'
                });
            }

            if (sessionTimeout && (sessionTimeout < 5 || sessionTimeout > 1440)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El timeout de sesión debe estar entre 5 y 1440 minutos'
                });
            }

            if (maxLoginAttempts && (maxLoginAttempts < 3 || maxLoginAttempts > 10)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Los intentos máximos de login deben estar entre 3 y 10'
                });
            }
        }

        if (updates.general) {
            const { supportEmail, language } = updates.general;

            if (supportEmail && !isValidEmail(supportEmail)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email de soporte no válido'
                });
            }

            if (language && !['es', 'en', 'fr'].includes(language)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Idioma no soportado. Valores permitidos: es, en, fr'
                });
            }
        }

        if (updates.email) {
            const { smtpPort, smtpUser } = updates.email;

            if (smtpPort && ![25, 587, 465, 2525].includes(smtpPort)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Puerto SMTP no válido. Valores permitidos: 25, 587, 465, 2525'
                });
            }

            if (smtpUser && !isValidEmail(smtpUser)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Usuario SMTP debe ser un email válido'
                });
            }
        }

        // Actualizar configuración en cache
        for (const category in updates) {
            settingsCache[category] = {
                ...settingsCache[category],
                ...updates[category]
            };
        }

        // TODO: Guardar en base de datos
        // await db.query('UPDATE system_settings SET settings = $1 WHERE category = $2', ...);

        res.json({
            status: 'success',
            message: 'Configuración actualizada correctamente',
            data: settingsCache
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Resetear configuración a valores por defecto
exports.resetSettings = async (req, res) => {
    try {
        const { category } = req.body;

        if (category) {
            // Resetear categoría específica
            if (!DEFAULT_SETTINGS.hasOwnProperty(category)) {
                return res.status(400).json({
                    status: 'error',
                    message: `Categoría '${category}' no válida`
                });
            }

            settingsCache[category] = { ...DEFAULT_SETTINGS[category] };
        } else {
            // Resetear toda la configuración
            settingsCache = { ...DEFAULT_SETTINGS };
        }

        // TODO: Actualizar en base de datos

        res.json({
            status: 'success',
            message: category
                ? `Configuración de '${category}' restablecida`
                : 'Toda la configuración restablecida',
            data: settingsCache
        });
    } catch (error) {
        console.error('Error resetting settings:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Función auxiliar para validar emails
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
