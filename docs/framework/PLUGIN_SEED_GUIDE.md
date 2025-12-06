# Guía Definitiva del Plugin Semilla

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025  
**Estado**: PRODUCCIÓN

---

## 🎯 Plugin Semilla Oficial

**EL ÚNICO PLUGIN QUE DEBE USARSE COMO BASE:**

```
packages/plugin-auth/
```

**NUNCA copiar de:**
- ❌ plugin-content (puede tener código antiguo)
- ❌ plugin-system (puede tener código antiguo)
- ❌ Cualquier otro plugin

**SIEMPRE copiar de:**
- ✅ `packages/plugin-auth/` - Semilla oficial verificada

---

## 📋 Proceso de Creación de Nuevo Plugin

### Paso 1: Copiar la Semilla

```bash
# Copiar plugin-auth completo
cp -r packages/plugin-auth packages/plugin-{nombre}
cd packages/plugin-{nombre}
```

### Paso 2: Actualizar manifest.json

**SOLO cambiar estos campos:**

```json
{
    "key": "plugin-{nombre}",
    "name": "Nombre Descriptivo",
    "description": "Descripción completa del plugin",
    "category": "WEB|SYSTEM|INTEGRATION|AI",
    "author": "Tu Nombre",
    "homepage": "/plugins/{nombre}",
    "icon": "IconName",
    "type": "FEATURE|SERVICE|INTEGRATION",
    "capabilities": ["cap1", "cap2"],
    "network": {
        "host": "gestas_plugin_{nombre}",
        "port": 50XX  // Asignar puerto libre 5000-5999
    }
}
```

### Paso 3: NO Modificar Estos Archivos

**MANTENER EXACTAMENTE IGUAL:**

- ✅ `src/bootstrap/plugin.js` - Protocolo de registro
- ✅ `src/bootstrap/redis.js` - Conexión Redis
- ✅ `src/bootstrap/database.js` - Conexión DB
- ✅ `src/index.js` - Flujo de inicio (solo cambiar rutas)

### Paso 4: Actualizar package.json

```json
{
    "name": "@gestasai/plugin-{nombre}",
    "version": "1.0.0",
    "description": "Descripción del plugin"
}
```

### Paso 5: Crear Rutas Específicas

En `src/routes/`, crear tus rutas de negocio:

```javascript
// src/routes/tuRuta.routes.js
const express = require('express');
const router = express.Router();

router.get('/api/tu-endpoint', (req, res) => {
    res.json({ message: 'Tu lógica aquí' });
});

module.exports = router;
```

### Paso 6: Actualizar src/index.js

**SOLO cambiar:**

```javascript
// Importar tus rutas
const tuRuta = require('./routes/tuRuta.routes');

// Agregar tus rutas
app.use(tuRuta);
```

**NO cambiar:**
- ❌ Flujo de inicio (Redis → DB → Plugin Bootstrap)
- ❌ Configuración de Redis
- ❌ Registro de plugin
- ❌ Heartbeat

---

## 🔧 Código Crítico que NO Debe Modificarse

### 1. src/bootstrap/redis.js

```javascript
const { createClient } = require('redis');

const RedisBootstrap = {
    redisClient: null,
    redisSub: null,

    async connectRedis(redisUrl) {
        this.redisClient = createClient({ url: redisUrl });
        this.redisSub = createClient({ url: redisUrl });

        await this.redisClient.connect();
        console.log('✅ Redis connected');

        await this.redisSub.connect();
        console.log('✅ Redis subscriber connected');
    },

    async setupSubscriptions(onCoreReady) {
        // ✅ CRÍTICO: Canal SYSTEM:CORE_READY
        await this.redisSub.subscribe('SYSTEM:CORE_READY', (message) => {
            console.log('🔄 Core restarted. Re-registering...');
            onCoreReady();
        });
    },

    getClient() {
        return this.redisClient;
    },

    getSubscriber() {
        return this.redisSub;
    }
};

module.exports = RedisBootstrap;
```

**Puntos críticos:**
- ✅ Dos clientes: `redisClient` (publisher) y `redisSub` (subscriber)
- ✅ Canal: `SYSTEM:CORE_READY` (NO cambiar)
- ✅ Object literal (NO class)

### 2. src/bootstrap/plugin.js

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
            ...manifest,  // ✅ Spread completo
            network: {
                ...manifest.network,
                host: process.env.HOST_IP || manifest.network.host,
                port: this.port
            }
        };

        // ✅ CRÍTICO: Canal SYSTEM:PLUGIN_REGISTER
        await this.redisClient.publish('SYSTEM:PLUGIN_REGISTER', JSON.stringify(payload));
        console.log('📡 Registered with Core');
    },

    setupHeartbeat() {
        setInterval(() => {
            // ✅ CRÍTICO: Canal SYSTEM:PLUGIN_HEARTBEAT
            this.redisClient.publish('SYSTEM:PLUGIN_HEARTBEAT', JSON.stringify({ 
                key: manifest.key 
            }));
        }, 30000);
    }
};

module.exports = PluginBootstrap;
```

**Puntos críticos:**
- ✅ `const manifest = require()` (NO fs.readFileSync)
- ✅ `...manifest` (spread completo)
- ✅ Canales: `SYSTEM:PLUGIN_REGISTER` y `SYSTEM:PLUGIN_HEARTBEAT`
- ✅ Heartbeat cada 30s

### 3. src/index.js - Flujo de Inicio

```javascript
const PORT = process.env.PORT || 3004;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function start() {
    try {
        console.log('🚀 Starting Plugin...');

        // 1. Conectar a Redis
        await RedisBootstrap.connectRedis(REDIS_URL);

        // 2. Esperar y configurar base de datos
        await DatabaseBootstrap.waitForDb();
        await DatabaseBootstrap.initDb();

        // 3. Inicializar plugin bootstrap
        PluginBootstrap.init(RedisBootstrap.getClient(), PORT);

        // 4. Configurar suscripciones
        await RedisBootstrap.setupSubscriptions(() => {
            PluginBootstrap.registerPlugin();
        });

        // 5. Iniciar servidor
        app.listen(PORT, async () => {
            console.log(`🔐 Plugin running on port ${PORT}`);

            // 6. Registrar plugin
            await PluginBootstrap.registerPlugin();

            // 7. Configurar heartbeat
            PluginBootstrap.setupHeartbeat();
        });
    } catch (err) {
        console.error('💥 Fatal error during startup:', err);
        process.exit(1);
    }
}

start();
```

**Orden CRÍTICO:**
1. Redis
2. Database
3. Plugin Bootstrap init
4. Subscriptions
5. Server listen
6. Register plugin
7. Setup heartbeat

---

## ⚠️ Errores Comunes y Cómo Evitarlos

### Error 1: Canal Redis Incorrecto

**❌ INCORRECTO:**
```javascript
await subscriber.subscribe('plugin:discovery', ...)
await publisher.publish('plugin:register', ...)
```

**✅ CORRECTO:**
```javascript
await this.redisSub.subscribe('SYSTEM:CORE_READY', ...)
await this.redisClient.publish('SYSTEM:PLUGIN_REGISTER', ...)
```

**Síntoma:** Plugin dice "Registered with Core" pero NO aparece en logs del core.

**Solución:** Copiar `src/bootstrap/redis.js` de plugin-auth.

---

### Error 2: Redis URL Incorrecta

**❌ INCORRECTO:**
```javascript
const REDIS_URL = 'redis://gestas_redis:6379';
const REDIS_URL = 'redis://localhost:6379';
```

**✅ CORRECTO:**
```javascript
const REDIS_URL = process.env.REDIS_URL || 'redis://gestas_event_bus:6379';
```

**Síntoma:** Plugin no puede conectarse a Redis o mensajes no llegan al core.

**Solución:** Usar `gestas_event_bus` (nombre del servicio en docker-compose).

---

### Error 3: Estructura de Payload Incorrecta

**❌ INCORRECTO:**
```javascript
const payload = {
    key: manifest.key,
    name: manifest.name,
    manifest: manifest  // ❌ Anidado
};
```

**✅ CORRECTO:**
```javascript
const payload = {
    ...manifest,  // ✅ Spread completo
    network: {
        ...manifest.network,
        host: process.env.HOST_IP || manifest.network.host,
        port: this.port
    }
};
```

**Síntoma:** DiscoveryService no encuentra campos como `category`, `author`, etc.

**Solución:** Usar spread operator `...manifest`.

---

### Error 4: Leer Manifest con fs.readFileSync

**❌ INCORRECTO:**
```javascript
const manifestPath = path.join(__dirname, '../../manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
```

**✅ CORRECTO:**
```javascript
const manifest = require('../../manifest.json');
```

**Síntoma:** Código más complejo, posibles errores de path.

**Solución:** Usar `require()` directamente.

---

### Error 5: Class en lugar de Object Literal

**❌ INCORRECTO:**
```javascript
class PluginBootstrap {
    static redisClient = null;
    static async registerPlugin() { ... }
}
```

**✅ CORRECTO:**
```javascript
const PluginBootstrap = {
    redisClient: null,
    async registerPlugin() { ... }
};
```

**Síntoma:** Puede funcionar pero no es consistente con la semilla.

**Solución:** Usar object literal como plugin-auth.

---

## 🔍 Metodología de Debugging

### Paso 1: Identificar el Plugin que Funciona

```bash
# Ver qué plugins están ONLINE
docker exec -i gestas_system_db psql -U gestas_admin -d gestas_system \
  -c "SELECT key, status FROM plugins WHERE status = 'ONLINE';"
```

**Resultado esperado:**
- plugin-auth: ✅ ONLINE
- plugin-nuevo: ❌ OFFLINE o no aparece

### Paso 2: Comparar Logs

```bash
# Plugin que funciona
docker logs gestas_plugin_auth --tail 20

# Plugin que NO funciona
docker logs gestas_plugin_nuevo --tail 20
```

**Buscar:**
- ✅ "Redis connected"
- ✅ "Redis subscriber connected"
- ✅ "Registered with Core"

### Paso 3: Verificar Logs del Core

```bash
docker logs gestas_core_system --tail 50 | grep "plugin-nuevo"
```

**Si NO aparece:** El mensaje Redis no está llegando al core.

**Posibles causas:**
1. Canal Redis incorrecto
2. Redis URL incorrecta
3. Payload mal formado

### Paso 4: Comparar Archivos Críticos

```bash
# Comparar bootstrap/redis.js
fc packages/plugin-auth/src/bootstrap/redis.js packages/plugin-nuevo/src/bootstrap/redis.js

# Comparar bootstrap/plugin.js
fc packages/plugin-auth/src/bootstrap/plugin.js packages/plugin-nuevo/src/bootstrap/plugin.js
```

**Buscar diferencias en:**
- Canales Redis
- Estructura de código
- Nombres de variables

### Paso 5: Verificar Variables de Entorno

```bash
# Ver variables del plugin
docker exec gestas_plugin_nuevo env | grep REDIS
```

**Debe mostrar:**
```
REDIS_URL=redis://gestas_event_bus:6379
```

---

## 📊 Checklist de Verificación

Antes de considerar un plugin completo:

- [ ] Copiado desde `packages/plugin-auth/`
- [ ] `manifest.json` actualizado con metadata completa
- [ ] Puerto asignado en rango 5000-5999
- [ ] `src/bootstrap/` SIN modificar
- [ ] `src/index.js` solo cambió rutas de negocio
- [ ] REDIS_URL apunta a `gestas_event_bus`
- [ ] Canales Redis: `SYSTEM:PLUGIN_REGISTER` y `SYSTEM:PLUGIN_HEARTBEAT`
- [ ] Plugin arranca sin errores
- [ ] Aparece en logs del core: "Successfully registered"
- [ ] Status='ONLINE' en base de datos
- [ ] Aparece en marketplace
- [ ] Heartbeat funciona cada 30s

---

## 🎯 Reglas de Oro

1. **SIEMPRE copiar de plugin-auth** - Es la semilla oficial
2. **NUNCA modificar bootstrap/** - Código sagrado
3. **NUNCA hardcodear** - Usar variables de entorno
4. **SIEMPRE verificar logs** - Core debe mostrar "Successfully registered"
5. **SIEMPRE comparar con lo que funciona** - Si algo falla, comparar con plugin-auth
6. **NUNCA inventar** - Seguir el protocolo exacto
7. **SIEMPRE documentar** - Si encuentras un error, documentarlo aquí

---

## 📝 Plantilla de Commit

Cuando crees un nuevo plugin:

```
feat(plugins): add plugin-{nombre}

- Copied from plugin-auth (official seed)
- Updated manifest.json with {nombre} metadata
- Assigned port {puerto}
- Added business routes in src/routes/
- Verified auto-registration works
- Status: ONLINE in marketplace

Checklist:
✅ Auto-registration
✅ Heartbeat working
✅ Marketplace display
✅ All tests passing
```

---

**Última actualización**: 22 de Noviembre de 2025  
**Mantenido por**: GestasAI Team  
**Versión del protocolo**: 1.0
