# 🐛 Errores Comunes Durante Refactorización - Backend

**Fecha**: 22 de Noviembre de 2025

---

## Error: Plugin no se registra correctamente después de refactorización

### 🔴 Síntoma
- Error 502 Bad Gateway al intentar acceder a endpoints del plugin
- Gateway no puede conectarse al plugin
- Logs del core muestran que el plugin no está registrado o tiene hostname incorrecto

### 🔍 Causa Raíz
Durante la refactorización con granularidad extrema, se crearon archivos bootstrap pero:
1. El archivo `bootstrap/plugin.js` tiene hostname incorrecto (copiado de otro plugin)
2. Los archivos bootstrap no existen en el contenedor Docker
3. El contenedor no se reinició después de crear los archivos

### ✅ Solución Completa

#### 1. Verificar que existan los archivos bootstrap

```bash
docker exec gestas_plugin_system ls -la src/bootstrap/
```

Debe mostrar:
```
database.js
redis.js
plugin.js
```

#### 2. Verificar el hostname en plugin.js

```bash
docker exec gestas_plugin_system cat src/bootstrap/plugin.js | grep -A 2 "host:"
```

Debe mostrar:
```javascript
host: process.env.HOST_IP || 'gestas_plugin_system',  // ✅ Nombre correcto
```

**NO debe mostrar:**
```javascript
host: process.env.HOST_IP || 'gestas_plugin_auth',  // ❌ Nombre de otro plugin
```

#### 3. Reiniciar servicios en orden

```bash
# 1. Reiniciar el plugin
docker restart gestas_plugin_system

# 2. Esperar 5 segundos
Start-Sleep -Seconds 5

# 3. Reiniciar el core
docker restart gestas_core_system

# 4. Esperar 5 segundos
Start-Sleep -Seconds 5

# 5. Reiniciar el gateway
docker restart gestas_gateway

# 6. Esperar 10 segundos antes de probar
Start-Sleep -Seconds 10
```

#### 4. Verificar registro correcto

```bash
docker logs gestas_core_system --tail 30 | grep "plugin-system"
```

Debe mostrar:
```
📌 Cached base route: plugin-system -> http://gestas_plugin_system:3003
✅ Plugin registered: plugin-system
```

#### 5. Verificar que el plugin responde

```bash
curl http://localhost:3000/api/plugins/plugin-system/health
```

Debe responder:
```json
{"status":"UP"}
```

---

## Error: Archivos bootstrap copiados con datos incorrectos

### 🔴 Síntoma
- Plugin se registra con nombre/puerto/hostname incorrecto
- Conflictos entre plugins
- Rutas que apuntan al plugin equivocado

### 🔍 Causa
Al copiar archivos bootstrap de un plugin a otro, se mantienen valores del plugin original.

### ✅ Solución

**Checklist al copiar archivos bootstrap:**

1. **En `bootstrap/plugin.js`:**
   - [ ] Hostname correcto: `gestas_plugin_NOMBRE`
   - [ ] Puerto correcto (debe coincidir con manifest.json)
   - [ ] Referencia correcta a `manifest.json`

2. **En `bootstrap/database.js`:**
   - [ ] Ruta correcta a `schema.sql` si existe
   - [ ] Conexión a DB correcta

3. **En `bootstrap/redis.js`:**
   - [ ] URL de Redis correcta
   - [ ] Suscripciones correctas

4. **En `manifest.json`:**
   - [ ] `key` correcto: `plugin-NOMBRE`
   - [ ] `name` correcto
   - [ ] `network.host` correcto: `gestas_plugin_NOMBRE`
   - [ ] `network.port` correcto y único

5. **En `docker-compose.yml`:**
   - [ ] Nombre del servicio correcto: `gestas_plugin_NOMBRE`
   - [ ] Puerto mapeado correctamente
   - [ ] Variables de entorno correctas

---

## Error: Módulos bootstrap no se importan correctamente

### 🔴 Síntoma
- Error al iniciar el plugin
- `Cannot find module './bootstrap/database'`
- Plugin se cae al arrancar

### 🔍 Causa
Los archivos bootstrap se crearon pero no se importan en `index.js` o tienen rutas incorrectas.

### ✅ Solución

**Verificar imports en `index.js`:**

```javascript
const DatabaseBootstrap = require('./bootstrap/database');
const RedisBootstrap = require('./bootstrap/redis');
const PluginBootstrap = require('./bootstrap/plugin');
```

**Verificar que se usen correctamente:**

```javascript
async function start() {
    // 1. Redis
    await RedisBootstrap.connectRedis(REDIS_URL);
    
    // 2. Database
    await DatabaseBootstrap.waitForDb();
    await DatabaseBootstrap.initDb();
    
    // 3. Plugin
    PluginBootstrap.init(RedisBootstrap.getClient(), PORT);
    
    // 4. Suscripciones
    await RedisBootstrap.setupSubscriptions(() => {
        PluginBootstrap.registerPlugin();
    });
    
    // 5. Servidor
    app.listen(PORT, async () => {
        await PluginBootstrap.registerPlugin();
        PluginBootstrap.setupHeartbeat();
    });
}
```

---

## 🎯 Prevención de Errores en Refactorización

### Checklist Pre-Refactorización

1. **Backup del código original:**
```bash
cp -r packages/plugin-NOMBRE packages/plugin-NOMBRE.backup
```

2. **Documentar funcionalidad actual:**
   - Endpoints que funcionan
   - Tests que pasan
   - Comportamiento esperado

3. **Plan de refactorización:**
   - Listar archivos a crear
   - Identificar dependencias
   - Orden de implementación

### Checklist Post-Refactorización

1. **Verificar estructura:**
```bash
tree packages/plugin-NOMBRE/src
```

2. **Verificar imports:**
```bash
grep -r "require(" packages/plugin-NOMBRE/src/
```

3. **Verificar configuración:**
   - [ ] manifest.json correcto
   - [ ] package.json correcto
   - [ ] docker-compose.yml correcto

4. **Probar funcionalidad:**
   - [ ] Plugin arranca sin errores
   - [ ] Se registra correctamente
   - [ ] Endpoints responden
   - [ ] Tests pasan

5. **Verificar logs:**
```bash
docker logs gestas_plugin_NOMBRE --tail 50
```

---

## 📝 Patrón de Refactorización Segura

### Paso 1: Crear archivos nuevos SIN borrar los viejos

```bash
# Crear nuevos archivos granulares
# NO borrar archivos originales todavía
```

### Paso 2: Actualizar imports gradualmente

```javascript
// Comentar código viejo, usar código nuevo
// const oldService = require('./services/OldService');
const NewService = require('./services/NewService');
```

### Paso 3: Probar cada cambio

```bash
docker restart gestas_plugin_NOMBRE
# Verificar que funciona
```

### Paso 4: Solo cuando todo funciona, borrar código viejo

```bash
# Ahora sí, borrar archivos viejos
rm packages/plugin-NOMBRE/src/services/OldService.js
```

---

**Última actualización**: 22 de Noviembre de 2025
