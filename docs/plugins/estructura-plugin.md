# 📦 Estructura de un Plugin

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Estructura Estándar

```
plugin-example/
├── manifest.json           # Configuración del plugin
├── package.json            # Dependencias npm
├── Dockerfile              # Imagen Docker
├── README.md               # Documentación
└── src/
    ├── index.js            # Servidor Express + Registro
    ├── /controllers        # Lógica de endpoints (granular)
    │   ├── ExampleController.js
    │   └── AnotherController.js
    ├── /services           # Lógica de negocio (granular)
    │   ├── ExampleService.js
    │   └── ValidationService.js
    ├── /models             # Modelos de datos
    │   └── Example.js
    ├── /utils              # Utilidades (una función por archivo)
    │   ├── formatData.js
    │   └── validateInput.js
    ├── /routes             # Definición de rutas
    │   └── example.routes.js
    ├── /middleware         # Middleware específico
    │   └── validateExample.js
    └── /db                 # Conexión a base de datos
        ├── index.js
        └── schema.sql      # Schema específico del plugin
```

---

## 📄 Archivos Principales

### manifest.json
Configuración del plugin (ver [manifest-json.md](./manifest-json.md))

### package.json
Dependencias npm estándar

### Dockerfile
Imagen Docker para el plugin

### src/index.js
Servidor Express con:
- Configuración de rutas
- Conexión a Redis
- Registro del plugin
- Heartbeat

---

## 🎨 Principio de Granularidad

### Controllers
Un controller por entidad:
- `UserController.js` - Solo usuarios
- `RoleController.js` - Solo roles

### Services
Un service por responsabilidad:
- `UserService.js` - Lógica de negocio de usuarios
- `ValidationService.js` - Solo validaciones
- `EmailService.js` - Solo emails

### Utils
Una función por archivo:
- `hashPassword.js` - Solo hashear contraseñas
- `generateToken.js` - Solo generar tokens
- `validateEmail.js` - Solo validar emails

---

## 🗄️ Base de Datos

Si el plugin necesita tablas propias:

```
src/db/
├── index.js        # Conexión a PostgreSQL
└── schema.sql      # CREATE TABLE statements
```

**Ejemplo schema.sql**:
```sql
-- Tabla específica del plugin
CREATE TABLE IF NOT EXISTS plugin_example_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 Comunicación

### Con Otros Plugins (Redis Pub/Sub)
```javascript
// Publicar evento
redis.publish('example:event', JSON.stringify({ data: '...' }));

// Suscribirse a evento
redis.subscribe('other:event', (message) => {
  const data = JSON.parse(message);
  // Procesar evento
});
```

### Con Frontend (HTTP REST)
```javascript
// Endpoint accesible desde frontend
app.get('/api/example', (req, res) => {
  res.json({ data: '...' });
});
```

---

**Última actualización**: 22 de Noviembre de 2025
