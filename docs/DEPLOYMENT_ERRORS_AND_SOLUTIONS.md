# 🚨 GestasAI Deployment - Errores y Soluciones Completas

## 📋 Resumen Ejecutivo

Este documento detalla **TODOS** los errores encontrados durante el despliegue de GestasAI en producción (VPS) y sus soluciones definitivas. Sirve como referencia para evitar repetir estos problemas.

---

## 🔴 ERROR 1: Gateway Auth Proxy - Rutas Duplicadas

### Síntomas
```
GET /api/auth/tenants 404 (Not Found)
GET /api/auth/tenant/detect 404 (Not Found)
```

### Causa Raíz
El gateway estaba eliminando **TODO** el prefijo `/api/auth`, pero el plugin-auth espera rutas con `/api`:

```javascript
// ❌ INCORRECTO
pathRewrite: {
    '^/api/auth': ''  // Elimina /api/auth completo
}
// Resultado: /api/auth/tenants → /tenants (404)
```

### Solución
```javascript
// ✅ CORRECTO
pathRewrite: {
    '^/api/auth': '/api'  // Solo elimina /auth, mantiene /api
}
// Resultado: /api/auth/tenants → /api/tenants (200)
```

### Archivo Afectado
- [`backend/gateway/src/index.js`](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/backend/gateway/src/index.js#L108-L121)

### Commit
- `f12684b` - "fix: Gateway auth proxy - keep /api prefix for plugin-auth routes"

---

## 🔴 ERROR 2: Rutas Absolutas en Navegación

### Síntomas
- Click en enlaces del sidebar → Redirige a `/` (home)
- URL cambia de `/app/admin/users` a `/admin/users` → 404 → Redirect a `/`

### Causa Raíz
Los enlaces de administración tenían rutas **absolutas** en lugar de **relativas**:

```jsx
// ❌ INCORRECTO
<Link to="/admin/overview">Dashboard</Link>
// Desde /app → Va a /admin/overview (fuera de /app)
```

### Solución
```jsx
// ✅ CORRECTO
<Link to="admin/overview">Dashboard</Link>
// Desde /app → Va a /app/admin/overview
```

### Archivos Afectados
- [`frontend/shell/src/components/layout/MainLayout.jsx`](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/frontend/shell/src/components/layout/MainLayout.jsx#L63-L92)

### Commit
- `ea5da90` - "fix: Use relative paths for admin links in sidebar"

---

## 🔴 ERROR 3: Navegación del Config con Rutas Absolutas

### Síntomas
- Enlaces del menú superior (Sistema, Marketplace, etc.) redirigen a `/`

### Causa Raíz
El hook `useConfig` sanitizaba solo `routes` pero NO `navigation`:

```javascript
// ❌ INCORRECTO - Solo sanitiza routes
if (loadedConfig.routes) {
    loadedConfig.routes = loadedConfig.routes.map(r => ({
        ...r,
        path: r.path.startsWith('/') ? r.path.substring(1) : r.path
    }));
}
// navigation NO se sanitiza → rutas absolutas
```

### Solución
```javascript
// ✅ CORRECTO - Sanitiza routes Y navigation
if (loadedConfig.routes) { /* ... */ }
if (loadedConfig.navigation) {
    loadedConfig.navigation = loadedConfig.navigation.map(n => ({
        ...n,
        path: n.path.startsWith('/') ? n.path.substring(1) : n.path
    }));
}
```

### Archivo Afectado
- [`frontend/shell/src/hooks/useConfig.js`](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/frontend/shell/src/hooks/useConfig.js#L16-L30)

### Commit
- `79081d0` - "fix: Sanitize navigation paths to be relative"

---

## 🔴 ERROR 4: PluginRouter con Registro Hardcodeado

### Síntomas
```
[PLUGIN ROUTER] Plugin plugin-auth not found or not active
GET /api/plugins/plugin-auth/data 404
```

### Causa Raíz
El `PluginRouter` tenía un registro **hardcodeado** con solo 2 plugins inexistentes:

```javascript
// ❌ INCORRECTO
const registry = {
    'google-workspace': 'http://plugin-google:3000',
    'lms-core': 'http://plugin-lms:3000'  // No existe
};
return registry[key];  // plugin-auth → undefined
```

### Solución
Usar `PluginDiscovery` para resolver dinámicamente:

```javascript
// ✅ CORRECTO
const PluginDiscovery = require('./PluginDiscovery');
const discovery = new PluginDiscovery();
const plugins = await discovery.discoverPlugins();
const plugin = plugins.find(p => p.key === key);

if (plugin && plugin.network) {
    const url = `http://${plugin.network.host}:${plugin.network.port}`;
    return url;
}
```

### Archivo Afectado
- [`backend/gateway/src/services/PluginRouter.js`](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/backend/gateway/src/services/PluginRouter.js#L11-L45)

### Commit
- `c65fd2e` - "fix: Use dynamic plugin discovery instead of hardcoded registry"

---

## 🔴 ERROR 5: Plugins Duplicados en Discovery

### Síntomas
```
Checking plugin plugin-auth at http://gestas_plugin_auth:3004/api/config ✅
Checking plugin plugin-auth at http://localhost:3000/api/config ❌ 404
```

### Causa Raíz
`PluginDiscovery` cargaba plugins de **DOS fuentes** sin deduplicar:

1. **Filesystem** (manifests locales) → Hosts correctos
2. **Base de datos** (plugins registrados) → Hosts incorrectos (`localhost`)

```javascript
// ❌ INCORRECTO
const externalPlugins = await this.fetchExternalPlugins();
plugins.push(...externalPlugins);  // Duplicados
```

### Solución
```javascript
// ✅ CORRECTO
const externalPlugins = await this.fetchExternalPlugins();
const filesystemKeys = new Set(plugins.map(p => p.key));
const uniqueExternalPlugins = externalPlugins.filter(
    p => !filesystemKeys.has(p.key)
);
plugins.push(...uniqueExternalPlugins);
```

### Archivo Afectado
- [`backend/gateway/src/services/PluginDiscovery.js`](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/backend/gateway/src/services/PluginDiscovery.js#L51-L63)

### Commit
- `c65fd2e` - "fix: Remove duplicate plugins in PluginDiscovery"

---

## 🔴 ERROR 6: Tenant Search Endpoint Inexistente

### Síntomas
```
GET /api/auth/tenants/search?q=sonnativeai 404 (Not Found)
Organización no encontrada. Verifica el nombre.
```

### Causa Raíz
El frontend llamaba a un endpoint que **NO existía** en el backend:

```javascript
// Frontend
const searchRes = await connectionManager.get(
    `/api/auth/tenants/search?q=${encodeURIComponent(selectedTenantId)}`
);
```

Pero el backend solo tenía:
- `/api/tenants` (listar)
- `/api/tenant/detect` (detectar por hostname)

### Solución
Crear el endpoint en el backend:

```javascript
// TenantController.js
async searchTenant(req, res) {
    const { q } = req.query;
    const query = `
        SELECT id, name, slug, domain, created_at
        FROM tenants
        WHERE LOWER(name) = LOWER($1) OR LOWER(slug) = LOWER($1)
        LIMIT 1
    `;
    const result = await req.db.query(query, [q]);
    // ...
}

// tenant.routes.js
router.get('/api/tenants/search', TenantController.searchTenant);
```

### Archivos Afectados
- [`packages/plugin-auth/src/controllers/TenantController.js`](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/packages/plugin-auth/src/controllers/TenantController.js#L46-L88)
- [`packages/plugin-auth/src/routes/tenant.routes.js`](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/packages/plugin-auth/src/routes/tenant.routes.js#L12-L13)

### Commit
- `ce091aa` - "feat: Add tenant search endpoint - complete implementation"

---

## 🔴 ERROR 7: Base de Datos Vacía en Producción

### Síntomas
```
Organización no encontrada
No hay tenants en la base de datos
```

### Causa Raíz
PostgreSQL detectó que el volumen ya existía y **NO ejecutó** el `schema.sql`:

```
PostgreSQL Database directory appears to contain a database; Skipping initialization
```

### Solución
Eliminar el volumen viejo y recrear:

```bash
docker compose -f docker-compose.prod.yml down
docker volume rm gestasai_system_db_data
docker compose -f docker-compose.prod.yml up -d
```

El `schema.sql` se ejecuta automáticamente en la primera inicialización.

### Archivo Afectado
- [`backend/system/src/db/schema.sql`](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/backend/system/src/db/schema.sql) (contiene datos seed)

---

## 📊 Resumen de Commits Críticos

| Commit | Descripción | Impacto |
|--------|-------------|---------|
| `f12684b` | Fix gateway auth proxy | 🔴 CRÍTICO - Login funcionando |
| `ea5da90` | Fix relative paths in sidebar | 🟡 ALTO - Navegación funcionando |
| `79081d0` | Sanitize navigation paths | 🟡 ALTO - Menú superior funcionando |
| `c65fd2e` | Dynamic plugin discovery | 🔴 CRÍTICO - Plugins cargando |
| `ce091aa` | Add tenant search endpoint | 🔴 CRÍTICO - Login con búsqueda |

---

## ✅ Estado Final

**TODOS los errores resueltos. Sistema 100% funcional en producción.**

- ✅ Login funcionando
- ✅ Navegación funcionando
- ✅ Plugins cargando correctamente
- ✅ Rutas dinámicas sin hardcodeo
- ✅ Base de datos con datos seed
- ✅ Sistema completamente agnóstico

---

## 🔗 Referencias

- [Gateway Index](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/backend/gateway/src/index.js)
- [PluginRouter](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/backend/gateway/src/services/PluginRouter.js)
- [PluginDiscovery](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/backend/gateway/src/services/PluginDiscovery.js)
- [MainLayout](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/frontend/shell/src/components/layout/MainLayout.jsx)
- [useConfig Hook](file:///c:/Users/infoj/Documents/Proyectoscambio/gestasai/frontend/shell/src/hooks/useConfig.js)
