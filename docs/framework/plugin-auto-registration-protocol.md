# Protocolo de Auto-Registro de Plugins

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025  
**Estado**: DEFINITIVO

---

## 🎯 Objetivo

Garantizar que **CUALQUIER plugin nuevo** se registre automáticamente en el sistema sin intervención manual, siguiendo un protocolo estándar que TODOS los plugins deben cumplir.

---

## 📋 Protocolo Obligatorio

### 1. Estructura del Plugin

Todo plugin DEBE tener:

```
packages/plugin-{nombre}/
├── manifest.json          # Metadata completa del plugin
├── src/
│   ├── bootstrap/
│   │   ├── plugin.js     # Registro automático (SEMILLA)
│   │   └── redis.js      # Conexión Redis
│   └── index.js          # Entry point
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

### 2. manifest.json (Metadata Completa)

**TODOS los campos son OBLIGATORIOS** para marketplace:

```json
{
    "key": "plugin-{nombre}",
    "name": "Nombre del Plugin",
    "version": "1.0.0",
    "description": "Descripción completa...",
    "category": "WEB|SYSTEM|INTEGRATION|AI|OTHER",
    "author": "Nombre del Autor",
    "homepage": "https://...",
    "icon": "IconName",
    "type": "FEATURE|SERVICE|INTEGRATION",
    "capabilities": ["capability1", "capability2"],
    "network": {
        "strategy": "docker_internal",
        "host": "gestas_plugin_{nombre}",
        "port": 5XXX,
        "health_check": "/health"
    },
    "ui": { ... },
    "database": { ... },
    "ai": { ... }
}
```

### 3. bootstrap/plugin.js (SEMILLA PERFECTA)

**Código estándar que TODOS los plugins deben copiar exactamente:**

```javascript
const manifest = require('../../manifest.json');

const PluginBootstrap = {
    redisClient: null,
    port: null,

    init(redisClient, port) {
        this.redisClient = redisClient;
        this.port = port;
    },

    async registerPlugin() {
        const payload = {
            ...manifest,  // ✅ Spread completo del manifest
            network: {
                ...manifest.network,
                host: process.env.HOST_IP || 'gestas_plugin_{nombre}',
                port: this.port
            }
        };

        // ✅ Canal estándar: SYSTEM:PLUGIN_REGISTER
        await this.redisClient.publish('SYSTEM:PLUGIN_REGISTER', JSON.stringify(payload));
        console.log('📡 Registered with Core');
    },

    setupHeartbeat() {
        setInterval(() => {
            // ✅ Canal estándar: SYSTEM:PLUGIN_HEARTBEAT
            this.redisClient.publish('SYSTEM:PLUGIN_HEARTBEAT', JSON.stringify({ 
                key: manifest.key 
            }));
        }, 30000);
    }
};

module.exports = PluginBootstrap;
```

### 4. Canales Redis Estándar

**OBLIGATORIO** - Todos los plugins usan:
- 5003+: Nuevos plugins

---

## 🔄 Flujo Automático

```
1. Plugin arranca
   ↓
2. Lee manifest.json completo
   ↓
3. Publica en Redis: SYSTEM:PLUGIN_REGISTER
   (con TODOS los campos del manifest)
   ↓
4. DiscoveryService escucha
   ↓
5. Inserta en DB:
   - Tabla addons (con category, author, homepage, etc.)
   - Tabla plugins (con status='ONLINE' desde el inicio)
   ↓
6. MarketplaceController lee de DB
   (WHERE p.status = 'ONLINE')
   ↓
7. Frontend muestra en marketplace
   ↓
8. Plugin envía heartbeat cada 30s
```

---

## ✅ Checklist de Validación

Antes de considerar un plugin "completo", verificar:

- [ ] `manifest.json` tiene TODOS los campos obligatorios
- [ ] `bootstrap/plugin.js` usa código de la SEMILLA exacto
- [ ] Usa canales Redis estándar (`SYSTEM:PLUGIN_REGISTER`)
- [ ] Puerto asignado en rango 5000-5999
- [ ] Se auto-registra al arrancar (sin intervención manual)
- [ ] Aparece en marketplace automáticamente
- [ ] Status = 'ONLINE' en base de datos
- [ ] Heartbeat funciona cada 30s

---

## 🚫 Errores Comunes a Evitar

### ❌ NO HACER:

1. **Canales Redis personalizados**
   ```javascript
   // ❌ MAL
   publish('plugin:register', ...)
   
   // ✅ BIEN
   publish('SYSTEM:PLUGIN_REGISTER', ...)
   ```

2. **Payload incompleto**
   ```javascript
   // ❌ MAL
   const payload = {
       key: manifest.key,
       name: manifest.name
   };
   
   // ✅ BIEN
   const payload = {
       ...manifest,  // Todo el manifest
       network: { ... }
   };
   ```

3. **Hardcodear valores**
   ```javascript
   // ❌ MAL
   UPDATE plugins SET status = 'ONLINE' WHERE ...
   
   // ✅ BIEN
   INSERT ... VALUES (..., 'ONLINE', NOW())
   ```

4. **Leer manifest.json múltiples veces**
   ```javascript
   // ❌ MAL (plugin-content antiguo)
   const manifest = JSON.parse(fs.readFileSync(...))
   
   // ✅ BIEN (plugin-auth)
   const manifest = require('../../manifest.json');
   ```

---

## 📝 Plantilla de Creación

Al crear un nuevo plugin:

1. **Copiar** `packages/plugin-auth/` como base
2. **Renombrar** todos los archivos y referencias
3. **Actualizar** `manifest.json` con metadata del nuevo plugin
4. **Asignar** puerto en rango 5000-5999
5. **NO modificar** `bootstrap/plugin.js` (usar tal cual)
6. **Verificar** que sigue el protocolo completo

---

## 🔧 DiscoveryService (Core)

El sistema core DEBE:

```javascript
// ✅ Insertar con status='ONLINE' desde el inicio
INSERT INTO plugins (
    addon_id, key, name, type, base_price, capabilities,
    network_config, ai_config, status, last_heartbeat
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ONLINE', NOW())
ON CONFLICT (key) DO UPDATE SET
    status = 'ONLINE',
    last_heartbeat = NOW()
```

---

## 📊 Verificación Post-Registro

Después de arrancar un plugin, verificar:

```sql
-- Verificar addon registrado
SELECT key, name, category, author FROM addons WHERE key = 'plugin-{nombre}';

-- Verificar plugins ONLINE
SELECT key, status FROM plugins WHERE key LIKE 'plugin-{nombre}%';

-- Verificar en marketplace
GET /api/marketplace
```

---

## 🎯 Resultado Esperado

**CERO intervención manual**:
- ✅ Plugin arranca
- ✅ Se auto-registra
- ✅ Aparece en marketplace
- ✅ Status = ONLINE
- ✅ Funciona en cualquier servidor

**NO se permite**:
- ❌ UPDATE manual de base de datos
- ❌ Configuración manual de rutas
- ❌ Hardcodeo de valores
- ❌ Intervención del desarrollador

---

**Última actualización**: 22 de Noviembre de 2025  
**Mantenido por**: GestasAI Team
