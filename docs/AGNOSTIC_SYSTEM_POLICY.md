# 🛡️ GestasAI - Política de Sistema Agnóstico (DECRETO INQUEBRANTABLE)

## 📜 DECRETO FUNDAMENTAL

**El sistema GestasAI DEBE funcionar en CUALQUIER entorno con UN SOLO COMANDO:**

```bash
docker compose up -d
```

**Sin configuración. Sin cambios. Sin hardcodeo. PUNTO.**

---

## 🎯 PRINCIPIOS FUNDAMENTALES

### 1. AGNOSTICISMO TOTAL

> **El sistema NO debe conocer DÓNDE está corriendo**

#### ✅ PERMITIDO
```javascript
// Rutas relativas
const apiUrl = "/api/auth/login"

// Variables de entorno
const dbHost = process.env.DB_HOST || "postgres-system"

// Nombres de contenedores Docker
DATABASE_URL=postgres://user:pass@postgres-system:5432/db
```

#### ❌ PROHIBIDO
```javascript
// URLs absolutas
const apiUrl = "http://localhost:3000/api/login"
const apiUrl = "https://gestasai.com/api/login"

// IPs hardcodeadas
const dbHost = "192.168.1.100"
const dbHost = "127.0.0.1"

// Dominios hardcodeados
const domain = "gestasai.com"
```

---

### 2. MODULARIDAD

> **Cada componente DEBE ser independiente y reemplazable**

#### Reglas:
- ✅ Cada plugin es un contenedor independiente
- ✅ Comunicación SOLO vía API/Redis
- ✅ Sin dependencias directas entre plugins
- ❌ NO importar código de otros plugins
- ❌ NO asumir que un plugin específico existe

---

### 3. GRANULARIDAD

> **Cada servicio hace UNA cosa y la hace bien**

#### Separación de responsabilidades:
- **Gateway**: Solo routing
- **Plugin-Auth**: Solo autenticación
- **Plugin-Content**: Solo contenido
- **Backend-System**: Solo registro y discovery

#### ❌ PROHIBIDO:
- Mezclar responsabilidades
- Servicios monolíticos
- Lógica duplicada

---

## 🚫 ERRORES PROHIBIDOS

### ERROR 1: Hardcodear URLs/IPs

```javascript
// ❌ NUNCA HACER ESTO
const API_URL = "http://localhost:3000"
const API_URL = "https://gestasai.com"
fetch("http://192.168.1.100:3000/api/data")
```

**Solución:**
```javascript
// ✅ SIEMPRE HACER ESTO
const API_URL = "" // Relativo al origen
fetch("/api/data") // Relativo
```

---

### ERROR 2: Usar Dockerfile de desarrollo en producción

```yaml
# ❌ NUNCA HACER ESTO
frontend-shell:
  build:
    dockerfile: Dockerfile  # Dev server
  environment:
    - VITE_API_URL=http://localhost:3000
```

**Solución:**
```yaml
# ✅ SIEMPRE HACER ESTO
frontend-shell:
  build:
    dockerfile: Dockerfile.prod  # Nginx con proxy
  # Sin variables de entorno hardcodeadas
```

---

### ERROR 3: Exponer puertos innecesarios en producción

```yaml
# ❌ PELIGROSO en producción
postgres-system:
  ports:
    - "5432:5432"  # Expuesto al mundo
```

**Solución:**
```yaml
# ✅ CORRECTO
# docker-compose.yml (local - para debugging)
postgres-system:
  ports:
    - "5432:5432"

# docker-compose.prod.yml (producción - seguro)
postgres-system:
  # ports:  # Comentado - solo interno
  #   - "5432:5432"
```

---

### ERROR 4: Registros hardcodeados

```javascript
// ❌ NUNCA HACER ESTO
const plugins = {
  'plugin-auth': 'http://plugin-auth:3004',
  'plugin-content': 'http://plugin-content:5001'
}
```

**Solución:**
```javascript
// ✅ SIEMPRE HACER ESTO
const plugins = await pluginDiscovery.discoverPlugins()
const plugin = plugins.find(p => p.key === key)
```

---

## 📋 CHECKLIST PRE-COMMIT

Antes de hacer commit, verifica:

- [ ] ¿Hay `localhost` en el código? → ❌ Eliminar
- [ ] ¿Hay IPs hardcodeadas? → ❌ Eliminar
- [ ] ¿Hay URLs absolutas? → ❌ Cambiar a relativas
- [ ] ¿Hay registros hardcodeados? → ❌ Usar discovery
- [ ] ¿Funciona con `docker compose up -d`? → ✅ Debe ser SÍ
- [ ] ¿Funciona en local Y producción sin cambios? → ✅ Debe ser SÍ

---

## 🔍 VALIDACIÓN DE AGNOSTICISMO

### Test 1: Portabilidad
```bash
# Debe funcionar en TODOS estos entornos sin cambios:
git clone https://github.com/GestasAI/gestasai.git
cd gestasai
docker compose up -d

# ✅ Local Windows
# ✅ Local Mac
# ✅ Local Linux
# ✅ VPS Ubuntu
# ✅ AWS
# ✅ Azure
# ✅ Google Cloud
```

### Test 2: Sin configuración
```bash
# NO debe requerir:
# ❌ Editar archivos .env
# ❌ Cambiar URLs
# ❌ Configurar IPs
# ❌ Modificar docker-compose.yml
```

### Test 3: Un solo comando
```bash
# Debe levantarse con:
docker compose up -d

# Y acceder desde:
# ✅ http://localhost:5173
# ✅ http://IP_DEL_SERVIDOR:5173
# ✅ https://dominio.com (con proxy reverso)
```

---

## 🏗️ ARQUITECTURA AGNÓSTICA

### Comunicación entre servicios

```
┌─────────────┐
│  Frontend   │ ──────┐
└─────────────┘       │
                      ↓ /api/*
┌─────────────┐   ┌──────────┐
│  Plugin A   │←──│ Gateway  │
└─────────────┘   └──────────┘
                      ↑
┌─────────────┐       │
│  Plugin B   │←──────┘
└─────────────┘

Reglas:
1. Frontend SOLO habla con Gateway (rutas relativas)
2. Gateway descubre plugins dinámicamente
3. Plugins se registran automáticamente
4. Sin URLs hardcodeadas
```

---

## 📚 EJEMPLOS CORRECTOS

### Ejemplo 1: ConnectionManager (Frontend)
```javascript
class ConnectionManager {
  constructor() {
    // ✅ CORRECTO: Rutas relativas
    this.nodes = [""];  // Mismo origen
  }
  
  get(url) {
    // ✅ CORRECTO: /api/auth/login (relativo)
    return this.client.get(url);
  }
}
```

### Ejemplo 2: PluginDiscovery (Gateway)
```javascript
async discoverPlugins() {
  // ✅ CORRECTO: Lee manifests dinámicamente
  const plugins = [];
  const entries = fs.readdirSync(packagesDir);
  
  for (const entry of entries) {
    const manifest = JSON.parse(
      fs.readFileSync(`${entry}/manifest.json`)
    );
    plugins.push(manifest);
  }
  
  return plugins;
}
```

### Ejemplo 3: Docker Compose
```yaml
# ✅ CORRECTO: Nombres de contenedores, no IPs
environment:
  - DATABASE_URL=postgres://user:pass@postgres-system:5432/db
  - REDIS_URL=redis://redis-bus:6379
  - GATEWAY_URL=http://backend-gateway:3000
```

---

## 🚨 SANCIONES POR VIOLACIÓN

Si se detecta código que viola esta política:

1. **Revisión inmediata** - Revertir commit
2. **Corrección obligatoria** - Antes de merge
3. **Documentación** - Agregar a errores conocidos
4. **Prevención** - Actualizar checklist

---

## 📖 REFERENCIAS

- [Errores y Soluciones](./DEPLOYMENT_ERRORS_AND_SOLUTIONS.md)
- [Política de Rutas](./ROUTING_POLICY.md)
- [Docker Compose Best Practices](https://docs.docker.com/compose/production/)

---

## ✅ MANTRA DEL DESARROLLADOR

> **"Si hardcodeo, rompo el agnosticismo"**
> 
> **"Si funciona solo en mi máquina, está mal"**
> 
> **"Un comando para gobernarlos a todos: docker compose up -d"**

**AGNOSTICO. MODULAR. GRANULAR. SIEMPRE.**
