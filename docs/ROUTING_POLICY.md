# 🛡️ GestasAI - Política de Rutas Inquebrantable

## 🎯 Objetivo

**NUNCA MÁS** tener problemas de rutas hardcodeadas, absolutas o duplicadas que rompan el sistema en producción.

---

## 📜 REGLAS FUNDAMENTALES

### ⚖️ REGLA 1: Sistema 100% Agnóstico

> **El sistema DEBE funcionar en CUALQUIER entorno sin cambios de código**

#### ✅ Permitido
```javascript
// Rutas relativas
<Link to="admin/users">Usuarios</Link>

// API calls relativas
await api.get("/api/auth/login")

// Hosts de Docker
const host = process.env.DB_HOST || "postgres-system"
```

#### ❌ PROHIBIDO
```javascript
// Rutas absolutas hardcodeadas
<Link to="/admin/users">Usuarios</Link>

// URLs completas hardcodeadas
await fetch("http://localhost:3000/api/login")

// IPs o dominios hardcodeados
const host = "192.168.1.100"
const url = "https://gestasai.com/api"
```

---

### ⚖️ REGLA 2: Rutas Relativas en Frontend

> **TODAS las rutas del frontend DEBEN ser relativas al contexto actual**

#### ✅ Correcto
```jsx
// En App.jsx - Rutas anidadas bajo /app
<Route path="/app" element={<MainLayout />}>
    <Route path="admin/overview" element={<OverviewPage />} />
    <Route path="admin/users" element={<UsersPage />} />
</Route>

// En MainLayout.jsx - Links relativos
<Link to="admin/overview">Dashboard</Link>
<Link to="admin/users">Usuarios</Link>
```

#### ❌ Incorrecto
```jsx
// Rutas absolutas que salen del contexto
<Route path="/admin/overview" element={<OverviewPage />} />

// Links absolutos
<Link to="/admin/overview">Dashboard</Link>
```

---

### ⚖️ REGLA 3: Sanitización Obligatoria

> **TODO config/data externo DEBE sanitizarse antes de usar**

#### ✅ Correcto
```javascript
// useConfig.js
if (loadedConfig.routes) {
    loadedConfig.routes = loadedConfig.routes.map(r => ({
        ...r,
        path: r.path.startsWith('/') ? r.path.substring(1) : r.path
    }));
}

if (loadedConfig.navigation) {
    loadedConfig.navigation = loadedConfig.navigation.map(n => ({
        ...n,
        path: n.path.startsWith('/') ? n.path.substring(1) : n.path
    }));
}
```

#### ❌ Incorrecto
```javascript
// Usar directamente sin sanitizar
const routes = loadedConfig.routes;  // Pueden tener /
```

---

### ⚖️ REGLA 4: NO Hardcodear Registros

> **NUNCA hardcodear listas de plugins, servicios o rutas**

#### ✅ Correcto
```javascript
// PluginRouter.js - Discovery dinámico
const PluginDiscovery = require('./PluginDiscovery');
const discovery = new PluginDiscovery();
const plugins = await discovery.discoverPlugins();
const plugin = plugins.find(p => p.key === key);
```

#### ❌ Incorrecto
```javascript
// Registro hardcodeado
const registry = {
    'plugin-auth': 'http://plugin-auth:3004',
    'plugin-content': 'http://plugin-content:5001'
};
```

---

### ⚖️ REGLA 5: Deduplicación Obligatoria

> **Si cargas datos de múltiples fuentes, DEBES deduplicar**

#### ✅ Correcto
```javascript
// PluginDiscovery.js
const externalPlugins = await this.fetchExternalPlugins();
const filesystemKeys = new Set(plugins.map(p => p.key));
const uniqueExternalPlugins = externalPlugins.filter(
    p => !filesystemKeys.has(p.key)
);
plugins.push(...uniqueExternalPlugins);
```

#### ❌ Incorrecto
```javascript
// Agregar sin deduplicar
const externalPlugins = await this.fetchExternalPlugins();
plugins.push(...externalPlugins);  // Duplicados
```

---

### ⚖️ REGLA 6: PathRewrite Consciente

> **Al usar proxies, SÉ CONSCIENTE de qué prefijos eliminas**

#### ✅ Correcto
```javascript
// Gateway proxy para /api/auth
app.use('/api/auth', createProxyMiddleware({
    target: 'http://plugin-auth:3004',
    pathRewrite: {
        '^/api/auth': '/api'  // Mantiene /api, solo quita /auth
    }
}));
// /api/auth/login → /api/login ✅
```

#### ❌ Incorrecto
```javascript
// Elimina TODO el prefijo
pathRewrite: {
    '^/api/auth': ''  // Elimina /api/auth completo
}
// /api/auth/login → /login ❌ (404)
```

---

### ⚖️ REGLA 7: Variables de Entorno para Hosts

> **SIEMPRE usar variables de entorno para hosts/URLs**

#### ✅ Correcto
```javascript
// docker-compose.prod.yml
environment:
  - DATABASE_URL=postgres://gestas_admin:password@postgres-system:5432/gestas_system
  - REDIS_URL=redis://redis-bus:6379

// En código
const dbUrl = process.env.DATABASE_URL;
const redisUrl = process.env.REDIS_URL;
```

#### ❌ Incorrecto
```javascript
const dbUrl = "postgres://user:pass@localhost:5432/db";
const redisUrl = "redis://localhost:6379";
```

---

## 🔍 Checklist de Revisión

Antes de hacer commit, verifica:

- [ ] ¿Hay rutas absolutas en componentes React? → Cambiar a relativas
- [ ] ¿Hay `localhost` o IPs hardcodeadas? → Usar variables de entorno
- [ ] ¿Se carga config externo? → Sanitizar rutas
- [ ] ¿Se usa un registro hardcodeado? → Usar discovery dinámico
- [ ] ¿Se cargan datos de múltiples fuentes? → Deduplicar
- [ ] ¿Se usa proxy con pathRewrite? → Verificar qué se elimina
- [ ] ¿Funciona en local Y producción sin cambios? → Debe ser SÍ

---

## 🚨 Señales de Alerta

Si ves esto en el código, **DETENTE Y REVISA**:

```javascript
// 🚨 ALERTA: Ruta absoluta
<Link to="/admin/users">

// 🚨 ALERTA: URL hardcodeada
fetch("http://localhost:3000/api")

// 🚨 ALERTA: Registro hardcodeado
const registry = { ... }

// 🚨 ALERTA: Sin sanitizar
const routes = config.routes  // Usar directamente

// 🚨 ALERTA: Sin deduplicar
plugins.push(...externalPlugins)

// 🚨 ALERTA: PathRewrite peligroso
pathRewrite: { '^/api/auth': '' }
```

---

## 📚 Recursos

- [Errores y Soluciones Completas](file:///C:/Users/infoj/.gemini/antigravity/brain/3d4771e1-56b6-4013-9509-f41860417136/DEPLOYMENT_ERRORS_AND_SOLUTIONS.md)
- [React Router - Relative Routes](https://reactrouter.com/en/main/start/concepts#relative-routes)
- [http-proxy-middleware - pathRewrite](https://github.com/chimurai/http-proxy-middleware#pathrewrite-objectfunction)

---

## ✅ Validación

**El sistema es agnóstico si:**

1. ✅ Funciona en `localhost` sin cambios
2. ✅ Funciona en Docker local sin cambios
3. ✅ Funciona en VPS con dominio sin cambios
4. ✅ No hay `localhost`, IPs o dominios hardcodeados
5. ✅ Todas las rutas son relativas o dinámicas
6. ✅ Los plugins se descubren automáticamente
7. ✅ No hay registros hardcodeados

---

## 🎯 Mantra del Desarrollador

> **"Si hardcodeo una ruta, rompo el sistema en producción"**
> 
> **"Si uso rutas absolutas, rompo la navegación"**
> 
> **"Si no sanitizo, rompo el routing"**
> 
> **"Si no deduplico, rompo el discovery"**

**SIEMPRE RELATIVO. SIEMPRE DINÁMICO. SIEMPRE AGNÓSTICO.**
