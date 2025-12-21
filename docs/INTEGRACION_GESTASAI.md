# Marco CMS - Integración con GestasAI

## Arquitectura de Conexión

Marco CMS es una aplicación **100% agnóstica** que se conecta a GestasAI.com para toda su funcionalidad de backend, incluyendo autenticación y gestión de usuarios.

### Flujo de Conexión

```
Marco CMS (carniceriaperez.com)
    ↓
HTTPS Request
    ↓
gestasai.com/api/*
    ↓
Gateway (puerto 3000)
    ↓
plugin-auth (puerto 3004)
    ↓
PostgreSQL (usuarios guardados)
```

## Configuración de Conexión

### Variables de Entorno

Marco CMS utiliza variables de entorno para configurar la conexión:

**`.env` (Desarrollo):**
```env
VITE_API_BASE_URL=https://gestasai.com
VITE_ACIDE_URL=http://localhost:9000
```

**`.env.production` (Producción):**
```env
VITE_API_BASE_URL=https://gestasai.com
```

### Configuración de Vite

El `vite.config.js` configura el proxy para desarrollo:

```javascript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL || 'https://gestasai.com';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});
```

### Configuración de Axios

El archivo `src/services/api.js` configura Axios:

```javascript
const api = axios.create({
    baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://gestasai.com'),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar tokens
api.interceptors.request.use((config) => {
    const userToken = localStorage.getItem('marco_token');
    const pluginToken = localStorage.getItem('marco_plugin_token');
    
    const isDataPath = config.url.includes('/api/data');
    const token = isDataPath ? (userToken || pluginToken) : (userToken || pluginToken);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

## CRUD de Usuarios desde Marco CMS

### Endpoints Utilizados

Marco CMS se conecta directamente a los endpoints de administración de GestasAI:

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Listar usuarios | GET | `/api/admin/users` | Obtiene todos los usuarios |
| Obtener usuario | GET | `/api/admin/users/:id` | Obtiene un usuario específico |
| Crear usuario | POST | `/api/admin/users` | Crea un nuevo usuario |
| Actualizar usuario | PUT | `/api/admin/users/:id` | Actualiza un usuario existente |
| Eliminar usuario | DELETE | `/api/admin/users/:id` | Elimina un usuario |
| Listar roles | GET | `/api/admin/roles` | Obtiene todos los roles |
| Listar permisos | GET | `/api/admin/permissions` | Obtiene todos los permisos |

### Servicio de Usuarios

El archivo `src/services/userService.js` implementa todas las operaciones:

```javascript
export const userService = {
    // Listar todos los usuarios
    async getAllUsers() {
        const response = await api.get('/api/admin/users');
        return response.data.data || response.data || [];
    },

    // Crear un nuevo usuario
    async createUser(userData) {
        const payload = {
            name: userData.full_name,
            email: userData.email,
            password: userData.password,
            roles: [userData.role_id],
            status: userData.status || 'active',
            tenantId: '00000000-0000-0000-0000-000000000000'
        };

        const response = await api.post('/api/admin/users', payload);
        return response.data.data || response.data;
    },

    // Actualizar un usuario
    async updateUser(id, userData) {
        const updates = {
            name: userData.full_name,
            email: userData.email,
            roles: [userData.role_id],
            status: userData.status
        };

        if (userData.password) {
            updates.password = userData.password;
        }

        const response = await api.put(`/api/admin/users/${id}`, updates);
        return response.data.data || response.data;
    },

    // Eliminar un usuario
    async deleteUser(id) {
        const response = await api.delete(`/api/admin/users/${id}`);
        return response.data;
    }
};
```

### Formato de Datos

**Crear Usuario (Request):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "SecurePass123!",
  "roles": ["editor"],
  "status": "active",
  "tenantId": "00000000-0000-0000-0000-000000000000"
}
```

**Respuesta (Response):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-here",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "roles": ["editor"],
    "status": "active",
    "tenantId": "00000000-0000-0000-0000-000000000000"
  }
}
```

## Autenticación

### Flujo de Login

1. Usuario ingresa credenciales en Marco CMS
2. Marco CMS envía petición a `/api/plugins/plugin-auth/api/login`
3. GestasAI valida credenciales y devuelve:
   - `marco_token`: Token de usuario (JWT)
   - `marco_plugin_token`: Token de plugin (JWT)
4. Marco CMS guarda tokens en `localStorage`
5. Todas las peticiones subsecuentes incluyen el token en el header `Authorization`

### Registro de Plugin

Marco CMS se auto-registra como plugin en GestasAI:

```javascript
// src/services/pluginRegistry.js
async function registerPlugin() {
    const response = await api.post('/api/universal/register', {
        pluginKey: 'marco-cms',
        name: 'Marco CMS',
        version: '1.0.0',
        capabilities: ['content:manage', 'users:manage']
    });
    
    localStorage.setItem('marco_plugin_token', response.data.token);
}
```

## Seguridad

### Tokens

- **User Token**: Se usa para operaciones que requieren permisos de usuario
- **Plugin Token**: Se usa para registro y operaciones del sistema

### Almacenamiento

Los tokens se guardan en `localStorage`:
- `marco_token`: Token de usuario
- `marco_user`: Datos del usuario
- `marco_plugin_token`: Token del plugin

### Validación

Todas las rutas `/api/admin/*` en GestasAI requieren:
1. Token JWT válido
2. Usuario con permisos de administrador
3. Organización (tenant) válida

## Despliegue

### Build para Producción

```bash
cd marco-cms
npm run build
```

Esto genera la carpeta `dist/` con archivos estáticos.

### Subir a Servidor

```bash
# Copiar dist/ a cualquier servidor web
scp -r dist/* usuario@carniceriaperez.com:/var/www/html/
```

### Configuración del Servidor

El servidor web (Apache/Nginx) debe:
1. Servir archivos estáticos de `dist/`
2. Redirigir todas las rutas a `index.html` (SPA)
3. Permitir CORS para `gestasai.com`

**Ejemplo Nginx:**
```nginx
server {
    listen 80;
    server_name carniceriaperez.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Ventajas de esta Arquitectura

1. **Agnóstico**: Marco CMS no tiene backend propio
2. **Seguro**: Toda la autenticación y datos sensibles en GestasAI
3. **Escalable**: Se puede desplegar en múltiples dominios
4. **Mantenible**: Un solo backend (GestasAI) para múltiples clientes
5. **Portable**: Solo archivos HTML/CSS/JS estáticos

## Ejemplo de Uso

```javascript
// En cualquier componente de Marco CMS
import { userService } from '../services/userService';

// Listar usuarios
const users = await userService.getAllUsers();

// Crear usuario
const newUser = await userService.createUser({
    full_name: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'SecurePass123!',
    role_id: 'editor',
    status: 'active'
});

// Actualizar usuario
await userService.updateUser(userId, {
    full_name: 'Juan Pérez Actualizado',
    status: 'inactive'
});

// Eliminar usuario
await userService.deleteUser(userId);
```

## Troubleshooting

### Error 401 Unauthorized

**Causa**: Token inválido o expirado  
**Solución**: Hacer logout y login de nuevo

### Error 404 Not Found

**Causa**: Endpoint no existe en GestasAI  
**Solución**: Verificar que la ruta sea `/api/admin/*`

### Error CORS

**Causa**: GestasAI no permite peticiones desde el dominio  
**Solución**: Configurar CORS en el gateway de GestasAI

### No se cargan usuarios

**Causa**: Token no se está enviando correctamente  
**Solución**: Verificar que el token esté en `localStorage` y se agregue al header

## Conclusión

Marco CMS es una aplicación frontend completamente agnóstica que utiliza GestasAI.com como backend único para toda su funcionalidad. Esto permite desplegar Marco CMS en cualquier servidor web y conectarlo a GestasAI para autenticación, gestión de usuarios y almacenamiento de datos.
