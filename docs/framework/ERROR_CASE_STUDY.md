# Caso de Estudio: Error de Auto-Registro de Plugin-Content

**Fecha**: 22 de Noviembre de 2025  
**Plugin Afectado**: plugin-content  
**Severidad**: Alta  
**Tiempo de Resolución**: ~4 horas

---

## 📋 Resumen Ejecutivo

Plugin-content no se registraba automáticamente en el marketplace a pesar de que el código parecía correcto. El problema raíz fue el uso de código diferente al plugin semilla oficial (plugin-auth), específicamente en la configuración de Redis.

---

## 🔍 Síntomas Observados

1. ✅ Plugin-auth funcionaba perfectamente
2. ❌ Plugin-content NO aparecía en marketplace
3. ✅ Plugin-content logs mostraban "Registered with Core"
4. ❌ Core logs NO mostraban registro de plugin-content
5. ✅ Plugin-content arrancaba sin errores
6. ❌ Base de datos NO tenía filas para plugin-content

---

## 🎯 Diagnóstico Paso a Paso

### Paso 1: Identificar el Patrón

**Observación:**
- plugin-auth: ✅ 4 plugins ONLINE
- plugin-content: ❌ 0 plugins en DB

**Conclusión:** El problema es específico de plugin-content.

### Paso 2: Comparar Logs

**Plugin-auth:**
```
✅ Redis connected
✅ Redis subscriber connected
📡 Registered with Core
```

**Plugin-content:**
```
✅ Redis connected
✅ Redis subscriptions configured
📡 Registered with Core
```

**Diferencia sutil:** "Redis subscriber connected" vs "Redis subscriptions configured"

### Paso 3: Verificar Logs del Core

```bash
docker logs gestas_core_system --tail 50 | grep "plugin"
```

**Resultado:**
```
✅ Discovery: Successfully registered plugin-auth (4 plugins)
❌ (NO hay logs de plugin-content)
```

**Conclusión:** El mensaje Redis NO está llegando al core.

### Paso 4: Comparar Código Bootstrap

```bash
fc packages/plugin-auth/src/bootstrap/redis.js packages/plugin-content/src/bootstrap/redis.js
```

**Diferencias encontradas:**

| Aspecto | plugin-auth ✅ | plugin-content ❌ |
|---------|---------------|-------------------|
| Estructura | Object literal | Class |
| Canal | `SYSTEM:CORE_READY` | `plugin:discovery` |
| Clientes | 2 (publisher + subscriber) | 1 (duplicado) |
| Método | `connectRedis()` | `connectRedis()` |

### Paso 5: Verificar REDIS_URL

**Plugin-auth:**
```javascript
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
```

**Plugin-content:**
```javascript
const REDIS_URL = process.env.REDIS_URL || 'redis://gestas_redis:6379';
```

**Problema:** `gestas_redis` no existe. Debería ser `gestas_event_bus`.

---

## 🔧 Causa Raíz

### Problema 1: Canal Redis Incorrecto

**Código incorrecto:**
```javascript
// plugin-content/src/bootstrap/redis.js
await subscriber.subscribe('plugin:discovery', (message) => {
    console.log('📢 Discovery event received');
    if (onDiscovery) onDiscovery();
});
```

**Código correcto:**
```javascript
// plugin-auth/src/bootstrap/redis.js
await this.redisSub.subscribe('SYSTEM:CORE_READY', (message) => {
    console.log('🔄 Core restarted. Re-registering...');
    onCoreReady();
});
```

**Impacto:** Plugin-content escuchaba un canal que el core nunca usa.

### Problema 2: Redis URL Incorrecta

**Código incorrecto:**
```javascript
const REDIS_URL = 'redis://gestas_redis:6379';
```

**Código correcto:**
```javascript
const REDIS_URL = process.env.REDIS_URL || 'redis://gestas_event_bus:6379';
```

**Impacto:** Plugin-content podría no conectarse al Redis correcto en algunos entornos.

### Problema 3: Estructura de Código Diferente

**Plugin-content usaba:**
- Class con métodos static
- Un solo cliente Redis duplicado
- Lógica personalizada

**Plugin-auth usaba:**
- Object literal
- Dos clientes Redis separados
- Código estándar probado

---

## ✅ Solución Aplicada

### 1. Copiar Código Exacto de Plugin-Auth

```bash
# Reemplazar redis.js
cp packages/plugin-auth/src/bootstrap/redis.js packages/plugin-content/src/bootstrap/redis.js

# Verificar plugin.js es idéntico
fc packages/plugin-auth/src/bootstrap/plugin.js packages/plugin-content/src/bootstrap/plugin.js
```

### 2. Corregir REDIS_URL

```javascript
// packages/plugin-content/src/index.js
const REDIS_URL = process.env.REDIS_URL || 'redis://gestas_event_bus:6379';
```

### 3. Reiniciar Plugin

```bash
docker restart gestas_plugin_content
```

### 4. Verificar Resultado

```bash
# Logs del core
docker logs gestas_core_system --tail 30 | grep "plugin-content"
```

**Resultado:**
```
✅ Discovery: Received registration from plugin-content
✅ Discovery: Successfully registered plugin-content (5 plugins)
```

---

## 📊 Resultados

### Antes

```sql
SELECT key, status FROM plugins WHERE key LIKE 'plugin-content%';
-- 0 rows
```

### Después

```sql
SELECT key, status FROM plugins WHERE key LIKE 'plugin-content%';
```

| key | status |
|-----|--------|
| plugin-content-content_management | ONLINE |
| plugin-content-blog | ONLINE |
| plugin-content-cms | ONLINE |
| plugin-content-posts | ONLINE |
| plugin-content-categories | ONLINE |

**5 plugins registrados correctamente** ✅

---

## 🎓 Lecciones Aprendidas

### 1. SIEMPRE Copiar de la Semilla Oficial

**❌ NO hacer:**
- Crear código desde cero
- "Mejorar" el código de la semilla
- Usar un plugin antiguo como base

**✅ HACER:**
- Copiar `packages/plugin-auth/` completo
- Mantener código bootstrap sin cambios
- Solo modificar lógica de negocio

### 2. Comparar con lo que Funciona

**Metodología:**
1. Identificar plugin que funciona (plugin-auth)
2. Comparar logs
3. Comparar código archivo por archivo
4. Identificar diferencias
5. Copiar código que funciona

### 3. No Confiar en "Parece Correcto"

**Error común:**
```javascript
// Esto "parece correcto" pero NO funciona
await subscriber.subscribe('plugin:discovery', ...)
```

**Verificación:**
```bash
# Buscar en código del core qué canales escucha
grep -r "subscribe" backend/system/src/services/
```

### 4. Verificar Nombres de Servicios Docker

**Error común:**
```javascript
redis://gestas_redis:6379  // ❌ No existe
redis://localhost:6379      // ❌ No funciona en Docker
```

**Verificación:**
```bash
# Ver servicios en docker-compose.yml
grep "gestas_" docker-compose.yml
```

### 5. Logs del Core son la Fuente de Verdad

**Plugin dice:** "Registered with Core" ✅  
**Core dice:** (nada) ❌

**Conclusión:** El mensaje NO llegó al core.

---

## 🔍 Metodología de Debugging Recomendada

### 1. Identificar el Patrón

```bash
# ¿Qué funciona?
docker exec -i gestas_system_db psql -U gestas_admin -d gestas_system \
  -c "SELECT key, status FROM plugins WHERE status = 'ONLINE';"

# ¿Qué NO funciona?
docker exec -i gestas_system_db psql -U gestas_admin -d gestas_system \
  -c "SELECT key, status FROM plugins WHERE status = 'OFFLINE' OR status IS NULL;"
```

### 2. Comparar Logs

```bash
# Plugin que funciona
docker logs gestas_plugin_auth --tail 20

# Plugin que NO funciona
docker logs gestas_plugin_nuevo --tail 20

# Core system
docker logs gestas_core_system --tail 50 | grep "plugin"
```

### 3. Comparar Código

```bash
# Archivos críticos
fc packages/plugin-auth/src/bootstrap/redis.js packages/plugin-nuevo/src/bootstrap/redis.js
fc packages/plugin-auth/src/bootstrap/plugin.js packages/plugin-nuevo/src/bootstrap/plugin.js
fc packages/plugin-auth/src/index.js packages/plugin-nuevo/src/index.js
```

### 4. Verificar Configuración

```bash
# Variables de entorno
docker exec gestas_plugin_nuevo env | grep REDIS

# Servicios Docker
docker ps --format "table {{.Names}}\t{{.Status}}"

# Conectividad Redis
docker exec gestas_plugin_nuevo redis-cli -h gestas_event_bus ping
```

### 5. Aislar el Problema

**Preguntas:**
- ¿El plugin se conecta a Redis? → Ver logs "Redis connected"
- ¿El plugin envía el mensaje? → Ver logs "Registered with Core"
- ¿El core recibe el mensaje? → Ver logs del core
- ¿El core procesa el mensaje? → Ver logs "Successfully registered"
- ¿Se guarda en DB? → Query a tabla plugins

---

## 🚫 Errores a Evitar

### 1. Modificar Código que Funciona

**❌ NO hacer:**
```javascript
// "Voy a mejorar esto"
class PluginBootstrap {
    static async registerPlugin() { ... }
}
```

**✅ HACER:**
```javascript
// Copiar exactamente lo que funciona
const PluginBootstrap = {
    async registerPlugin() { ... }
};
```

### 2. Asumir que "Debería Funcionar"

**❌ NO asumir:**
- "El canal debe ser `plugin:register`"
- "Redis debe estar en `localhost`"
- "El código se ve bien"

**✅ VERIFICAR:**
- ¿Qué canal usa plugin-auth?
- ¿Qué Redis URL usa plugin-auth?
- ¿El código es IDÉNTICO a plugin-auth?

### 3. Hardcodear Soluciones

**❌ NO hacer:**
```sql
-- "Voy a insertar manualmente"
INSERT INTO plugins (key, name, status) VALUES (...);
```

**✅ HACER:**
```javascript
// Arreglar el código para que funcione automáticamente
await this.redisClient.publish('SYSTEM:PLUGIN_REGISTER', ...);
```

### 4. Ignorar Diferencias Sutiles

**❌ Ignorar:**
- "Solo es un nombre de variable diferente"
- "Es solo un canal con otro nombre"
- "Es solo una clase en lugar de object literal"

**✅ COPIAR EXACTO:**
- Mismos nombres de variables
- Mismos canales
- Misma estructura

---

## 📝 Checklist de Prevención

Antes de crear un nuevo plugin:

- [ ] ¿Copié desde `packages/plugin-auth/`?
- [ ] ¿Mantuve `src/bootstrap/` sin cambios?
- [ ] ¿Verifiqué que REDIS_URL apunta a `gestas_event_bus`?
- [ ] ¿Comparé mi código con plugin-auth?
- [ ] ¿Probé que el plugin se registra?
- [ ] ¿Verifiqué logs del core?
- [ ] ¿Confirmé status='ONLINE' en DB?
- [ ] ¿Aparece en marketplace?

---

## 🎯 Conclusión

**Tiempo perdido:** ~4 horas  
**Causa:** No copiar exactamente de la semilla oficial  
**Solución:** Copiar código exacto de plugin-auth  
**Prevención:** Seguir guía de plugin seed estrictamente

**Regla de Oro:**
> "Si plugin-auth funciona, copia plugin-auth. NO inventes."

---

**Documentado por**: GestasAI Team  
**Fecha**: 22 de Noviembre de 2025  
**Propósito**: Evitar que este error se repita
