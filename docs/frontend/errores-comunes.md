# 🐛 Errores Comunes y Soluciones - Frontend

**Fecha**: 22 de Noviembre de 2025

---

## Error: SuperAdmin no puede ver rol SuperAdmin ni usuarios SuperAdmin

### 🔴 Síntoma
- Usuario con `isSuperAdmin: true` no puede ver el rol "SuperAdmin" en la lista de roles
- No puede ver otros usuarios SuperAdmin en la lista de usuarios
- El filtro `isSuperAdmin` no se está aplicando correctamente

### 🔍 Causa Raíz
Inconsistencia en la estructura de datos al leer desde `localStorage`:

**Estructura correcta en localStorage:**
```javascript
{
  "id": "...",
  "email": "info@gestasai.com",
  "isSuperAdmin": true,  // ✅ Directamente en el objeto raíz
  "roleName": "SuperAdmin",
  ...
}
```

**Código incorrecto (buscando en lugar equivocado):**
```javascript
// ❌ INCORRECTO
const isSuperAdmin = currentUser?.user?.is_super_admin || false;
```

**Código correcto:**
```javascript
// ✅ CORRECTO
const isSuperAdmin = currentUser?.isSuperAdmin || false;
```

### ✅ Solución

#### 1. Actualizar UserListWidget.jsx

**Ubicación**: `frontend/shell/src/components/widgets/UserListWidget.jsx`

**Cambios necesarios** (líneas ~45 y ~79):

```javascript
// Dentro del segundo useEffect (línea ~45)
const isSuperAdmin = currentUser?.isSuperAdmin || false;

// Dentro de refreshData (línea ~79)
const isSuperAdmin = currentUser?.isSuperAdmin || false;
```

#### 2. Actualizar RoleListWidget.jsx

**Ubicación**: `frontend/shell/src/components/widgets/RoleListWidget.jsx`

**Cambios necesarios** (líneas ~48 y ~80):

```javascript
// Dentro del segundo useEffect (línea ~48)
const isSuperAdmin = currentUser?.isSuperAdmin || false;

// Dentro de refreshRoles (línea ~80)
const isSuperAdmin = currentUser?.isSuperAdmin || false;
```

### 📝 Verificación

1. **Verificar datos en localStorage:**
```javascript
// En consola del navegador
console.log(JSON.parse(localStorage.getItem("gestas_user")));
// Debe mostrar: { isSuperAdmin: true, ... }
```

2. **Verificar que el código se está usando:**
```bash
# En el contenedor Docker
docker exec gestas_frontend cat src/components/widgets/UserListWidget.jsx | grep -A 2 "isSuperAdmin"
```

3. **Rebuild del contenedor si es necesario:**
```bash
docker-compose restart gestas_frontend
```

### 🎯 Prevención

**Al refactorizar código:**
1. ✅ Mantener consistencia en nombres de propiedades
2. ✅ Documentar la estructura de datos en localStorage
3. ✅ Crear tests para verificar la lectura de datos
4. ✅ Verificar que los cambios se reflejen en Docker

**Convención de nombres:**
- Backend usa: `is_super_admin` (snake_case)
- Frontend usa: `isSuperAdmin` (camelCase)
- localStorage usa: `isSuperAdmin` (camelCase)

### 📚 Archivos Relacionados

- `frontend/shell/src/components/widgets/UserListWidget.jsx`
- `frontend/shell/src/components/widgets/RoleListWidget.jsx`
- `packages/plugin-system/src/controllers/UserController.js`
- `packages/plugin-system/src/controllers/RoleController.js`

---

## Error: Cambios en frontend no se reflejan después de refactorización

### 🔴 Síntoma
- Código actualizado en archivos locales
- Cambios no se ven en el navegador
- Contenedor Docker usa código antiguo

### 🔍 Causa
El contenedor Docker no ha recargado los archivos actualizados.

### ✅ Solución

```bash
# Opción 1: Restart del contenedor
docker-compose restart gestas_frontend

# Opción 2: Rebuild completo
docker-compose up -d --build gestas_frontend

# Opción 3: Verificar hot-reload
# Asegurarse de que Vite esté en modo desarrollo
```

### 🎯 Prevención
- Usar volúmenes en docker-compose para hot-reload
- Verificar que Vite esté configurado correctamente
- Hacer hard refresh en navegador (Ctrl+F5)

---

---

## Error: Plugin registra hostname incorrecto después de refactorización

### 🔴 Síntoma
- Error 502 Bad Gateway al intentar acceder a endpoints del plugin
- Gateway no puede conectarse al plugin
- Logs del core muestran hostname incorrecto

### 🔍 Causa Raíz
Al copiar archivos bootstrap de un plugin a otro durante la refactorización, se mantiene el hostname del plugin original.

**Ejemplo del error:**
```javascript
// En plugin-system/src/bootstrap/plugin.js
host: process.env.HOST_IP || 'gestas_plugin_auth',  // ❌ INCORRECTO
```

**Debería ser:**
```javascript
// En plugin-system/src/bootstrap/plugin.js
host: process.env.HOST_IP || 'gestas_plugin_system',  // ✅ CORRECTO
```

### ✅ Solución

1. **Verificar el archivo bootstrap/plugin.js:**
```bash
docker exec gestas_plugin_system cat src/bootstrap/plugin.js | grep -A 2 "host:"
```

2. **Corregir el hostname:**

Editar `packages/plugin-system/src/bootstrap/plugin.js` línea ~27:

```javascript
const payload = {
    ...manifest,
    network: {
        ...manifest.network,
        host: process.env.HOST_IP || 'gestas_plugin_system',  // ✅ Nombre correcto del contenedor
        port: this.port
    }
};
```

3. **Reiniciar servicios:**
```bash
docker restart gestas_plugin_system
Start-Sleep -Seconds 5
docker restart gestas_core_system
Start-Sleep -Seconds 5
docker restart gestas_gateway
```

4. **Verificar logs del core:**
```bash
docker logs gestas_core_system --tail 30 | grep "plugin-system"
```

Debe mostrar:
```
📌 Cached base route: plugin-system -> http://gestas_plugin_system:3003
```

### 🎯 Prevención

**Al copiar archivos bootstrap entre plugins:**
1. ✅ Buscar y reemplazar el nombre del plugin anterior
2. ✅ Verificar hostname en `bootstrap/plugin.js`
3. ✅ Verificar puerto en `manifest.json`
4. ✅ Probar registro del plugin después de copiar

**Checklist de verificación:**
- [ ] Hostname correcto en `bootstrap/plugin.js`
- [ ] Puerto correcto en `manifest.json`
- [ ] Key correcto en `manifest.json`
- [ ] Nombre del contenedor Docker correcto en `docker-compose.yml`

---

**Última actualización**: 22 de Noviembre de 2025
