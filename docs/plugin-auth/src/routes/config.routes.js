const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const yaml = require('yaml');

/**
 * GET /api/config
 * Obtiene la configuración actual del plugin
 */
router.get('/api/config', async (req, res) => {
    try {
        const configPath = path.join(__dirname, '../../config/plugin-config.yaml');

        // Intentar leer el archivo de configuración
        try {
            const configFile = await fs.readFile(configPath, 'utf8');
            const config = yaml.parse(configFile);
            res.json({
                status: 'success',
                data: config
            });
        } catch (err) {
            // Si no existe, devolver configuración por defecto
            res.json({
                status: 'success',
                data: {
                    addon_description: 'Sistema de autenticación multi-tenant con soporte para roles y permisos.',
                    enabled: true,
                    last_updated: null
                }
            });
        }
    } catch (error) {
        console.error('Error reading config:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * PUT /api/config
 * Actualiza la configuración del plugin
 */
router.put('/api/config', async (req, res) => {
    try {
        const { addon_description, enabled } = req.body;

        const config = {
            addon_description: addon_description || '',
            enabled: enabled !== undefined ? enabled : true,
            last_updated: new Date().toISOString()
        };

        const configPath = path.join(__dirname, '../../config/plugin-config.yaml');
        const configDir = path.dirname(configPath);

        // Crear directorio si no existe
        await fs.mkdir(configDir, { recursive: true });

        // Guardar configuración
        const yamlContent = yaml.stringify(config);
        await fs.writeFile(configPath, yamlContent, 'utf8');

        console.log('✅ Plugin configuration updated:', config);

        res.json({
            status: 'success',
            data: config,
            message: 'Configuración actualizada correctamente'
        });
    } catch (error) {
        console.error('Error saving config:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
