# 🛠️ Guía de Desarrollo de Plugins v2.0 (GestasAI)

Esta guía detalla los estándares actualizados para el desarrollo de plugins en GestasAI, incluyendo el nuevo sistema de configuración unificado.

## 1. Estructura del Plugin

Todo plugin debe seguir esta estructura mínima:

```
plugin-name/
├── config/
│   └── plugin-config.yaml  # (Generado automáticamente)
├── src/
│   ├── routes/
│   │   ├── config.routes.js # ✅ OBLIGATORIO
│   │   └── health.routes.js # ✅ OBLIGATORIO
│   ├── index.js
│   └── manifest.json
├── Dockerfile
└── package.json
```

## 2. Sistema de Configuración (Nuevo)

Todos los plugins deben implementar un endpoint `/api/config` para permitir su configuración desde el Marketplace.

### Dependencias Requeridas
En `package.json`:
```json
"dependencies": {
  "yaml": "^2.3.4",
  "express": "^4.18.2"
}
```

### Implementación (`src/routes/config.routes.js`)

```javascript
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const yaml = require('yaml');

// GET /api/config
router.get('/api/config', async (req, res) => {
    try {
        const configPath = path.join(__dirname, '../../config/plugin-config.yaml');
        try {
            const configFile = await fs.readFile(configPath, 'utf8');
            const config = yaml.parse(configFile);
            res.json({ status: 'success', data: config });
        } catch (err) {
            // Configuración por defecto
            res.json({
                status: 'success',
                data: {
                    addon_description: 'Descripción por defecto',
                    enabled: true,
                    last_updated: null
                }
            });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /api/config
router.put('/api/config', async (req, res) => {
    try {
        const { addon_description, enabled } = req.body;
        const config = {
            addon_description: addon_description || '',
            enabled: enabled !== undefined ? enabled : true,
            last_updated: new Date().toISOString()
        };
        
        const configPath = path.join(__dirname, '../../config/plugin-config.yaml');
        await fs.mkdir(path.dirname(configPath), { recursive: true });
        await fs.writeFile(configPath, yaml.stringify(config), 'utf8');
        
        res.json({ status: 'success', data: config });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
```

### Registro en `index.js`

```javascript
const configRoutes = require('./routes/config.routes');
app.use(express.json()); // Importante para PUT
app.use(configRoutes);
```

## 3. Docker y Puertos

Si el plugin necesita ser accedido directamente (fuera del Gateway) para debug, exponer el puerto en `docker-compose.yml`:

```yaml
ports:
  - "300X:300X"
```

Sin embargo, la comunicación estándar debe ser a través del Gateway:
`http://localhost:3000/api/plugins/{plugin-key}/api/config`

## 4. Manifest.json

Asegurar que el `key` del manifest coincida con la ruta esperada por el Gateway.

```json
{
    "key": "mi-plugin",
    "network": {
        "host": "gestas_plugin_mi_plugin",
        "port": 3000
    }
}
```
