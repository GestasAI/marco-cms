# 📋 Especificación de manifest.json

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Estructura Completa

```json
{
  "key": "plugin-example",
  "name": "Example Plugin",
  "version": "1.0.0",
  "description": "An example plugin for GestasAI",
  "author": "GestasAI Team",
  "license": "MIT",
  "network": {
    "host": "plugin-example",
    "port": 3010
  },
  "endpoints": [
    {
      "path": "/api/example",
      "method": "GET",
      "description": "Get example data",
      "requiresAuth": true,
      "permissions": ["example:read"]
    },
    {
      "path": "/api/example",
      "method": "POST",
      "description": "Create example data",
      "requiresAuth": true,
      "permissions": ["example:create"]
    }
  ],
  "dependencies": {
    "postgres": true,
    "redis": true
  },
  "widgets": [
    {
      "key": "example-list",
      "name": "Example List",
      "component": "ExampleListWidget",
      "route": "/examples"
    }
  ],
  "permissions": [
    {
      "key": "example:read",
      "name": "Read Examples",
      "category": "example"
    },
    {
      "key": "example:create",
      "name": "Create Examples",
      "category": "example"
    }
  ]
}
```

---

## 📖 Campos

### Campos Requeridos

#### key (string)
Identificador único del plugin.
- Formato: `plugin-<nombre>`
- Ejemplo: `"plugin-auth"`, `"plugin-cms"`

#### name (string)
Nombre legible del plugin.
- Ejemplo: `"Authentication Plugin"`

#### version (string)
Versión del plugin (Semantic Versioning).
- Formato: `MAJOR.MINOR.PATCH`
- Ejemplo: `"1.0.0"`

#### network (object)
Configuración de red.
- `host` (string): Nombre del host en Docker
- `port` (number): Puerto del plugin

---

### Campos Opcionales

#### description (string)
Descripción del plugin.

#### author (string)
Autor del plugin.

#### license (string)
Licencia del plugin.
- Ejemplo: `"MIT"`, `"Apache-2.0"`

#### endpoints (array)
Lista de endpoints expuestos.
- `path` (string): Ruta del endpoint
- `method` (string): Método HTTP
- `description` (string): Descripción
- `requiresAuth` (boolean): Si requiere autenticación
- `permissions` (array): Permisos necesarios

#### dependencies (object)
Dependencias de infraestructura.
- `postgres` (boolean): Requiere PostgreSQL
- `redis` (boolean): Requiere Redis

#### widgets (array)
Widgets del frontend.
- `key` (string): Identificador del widget
- `name` (string): Nombre del widget
- `component` (string): Nombre del componente React
- `route` (string): Ruta en el frontend

#### permissions (array)
Permisos que define el plugin.
- `key` (string): Clave del permiso
- `name` (string): Nombre legible
- `category` (string): Categoría del permiso

---

## ✅ Validación

El manifest.json debe:
- Ser JSON válido
- Tener todos los campos requeridos
- Usar el formato correcto para `key`
- Tener un `port` único
- Listar todos los endpoints

---

**Última actualización**: 22 de Noviembre de 2025
