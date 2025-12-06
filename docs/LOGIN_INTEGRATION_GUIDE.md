# 🔐 Guía de Integración de Login (Marco CMS via GestasAI Universal API)

**Versión**: 1.0  
**Fecha**: 06 de Diciembre de 2025  
**Estado**: Estable

Esta guía documenta el flujo técnico implementado para autenticar usuarios en Marco CMS utilizando la infraestructura de **GestasAI** a través del **Universal API Gateway**.

---

## 🏗️ Arquitectura de Autenticación

Marco CMS no maneja usuarios ni contraseñas localmente. Delega toda la seguridad al ecosistema GestasAI.

```mermaid
graph LR
    User[Usuario] -- 1. Credenciales --> MarcoCMS[Marco CMS (Cliente)]
    MarcoCMS -- 2. POST /api/plugins/plugin-auth/api/login --> Gateway[GestasAI Universal Gateway]
    Gateway -- 3. Proxy Pass --> AuthPlugin[Plugin Auth (GestasCore)]
    AuthPlugin -- 4. Validación (Bcrypt/DB) --> DB[(Base de Datos)]
    AuthPlugin -- 5. JWT Token --> Gateway
    Gateway -- 6. Response --> MarcoCMS
    MarcoCMS -- 7. Guardar Token (LocalStorage) --> User
```

---

## 📡 Endpoints Utilizados

### 1. Login Endpoint
El Gateway Universal expone el plugin de autenticación bajo la ruta proxy `/api/plugins/plugin-auth`.

- **Método**: `POST`
- **URL**: `/api/plugins/plugin-auth/api/login` (Relativa al proxy configurado en Vite o Base URL)
- **Content-Type**: `application/json`

**Payload de Petición:**

```json
{
  "email": "info@gestasai.com",
  "password": "tu_password_seguro",
  "tenantId": null
}
```

> **Nota sobre `tenantId`**:
> - Para **Super Usuarios** (System Admin) o usuarios globales, `tenantId` debe ser `null`.
> - Para usuarios de una organización específica, se debe enviar el UUID del tenant.
> - Marco CMS implementa una resolución inteligente: si no se especifica tenant, asume `null` (Global).

**Respuesta Exitosa (200 OK):**

La respuesta sigue el estándar de GestasAI (`{ status: 'success', data: { ... } }`), pero Axios devuelve el cuerpo en `response.data`.

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1Ni...", // JWT Token (Bearer)
    "user": {
      "id": "uuid-user-123",
      "email": "info@gestasai.com",
      "fullName": "System Admin",
      "role": "admin",
      "tenant_id": null,
      "permissions": ["all:access"]
    },
    "refreshToken": "..." // Opcional
  }
}
```

---

## 🛠️ Implementación en Código (`src/services/auth.js`)

La integración se centraliza en el servicio `authService`. A continuación, los puntos clave de la implementación:

### Función `login`

```javascript
async login(email, password, tenantSlug = null) {
    try {
        let tenantId = null;

        // Lógica de resolución de tenant (Opcional)
        // Si se provee un slug, se intenta resolver a UUID.
        // Si no se provee (caso Super Usuario), se envía tenantId: null.
        if (tenantSlug) {
             // ... lógica de resolución /api/plugins/plugin-auth/api/tenants/search
        }

        // Llamada al API Universal
        const response = await api.post('/api/plugins/plugin-auth/api/login', {
            email,
            password,
            tenantId: tenantId
        });

        // Extracción robusta de datos
        // Maneja tanto { data: { token } } como respuesta plana por compatibilidad
        const resultData = response.data.data || response.data;
        const { token, user } = resultData;

        if (!token || !user) {
            throw new Error('Respuesta inválida del servidor');
        }

        // Persistencia de sesión
        localStorage.setItem('marco_token', token);
        localStorage.setItem('marco_user', JSON.stringify(user));

        return { token, user };

    } catch (error) {
        // Manejo de errores 404 (Plugin no activo) y 401 (Credenciales)
        throw error;
    }
}
```

---

## 🔒 Seguridad y Buenas Prácticas

1.  **Cifrado**: Las contraseñas **NUNCA** se validan en el cliente. Se envían por canal seguro (HTTPS) al plugin de Auth.
2.  **Token**: El JWT recibido se almacena en `localStorage` (`marco_token`) y se inyecta en el header `Authorization: Bearer ...` de todas las peticiones subsecuentes mediante un interceptor de Axios.
3.  **Agnosticismo**: La integración no depende de una URL hardcodeada. Usa el proxy configurado en el cliente (`api.js`), permitiendo desplegar el CMS en cualquier entorno que tenga acceso al Gateway de GestasAI.
4.  **Tenancy**: El sistema soporta tanto autenticación Multi-Tenant (resolviendo slugs) como Single-Tenant/System (enviando `null`).

---

## 🐛 Resolución de Problemas Comunes

| Error | Causa Probable | Solución |
|-------|----------------|----------|
| `404 Not Found` en `/api/plugins/...` | El Gateway no está corriendo o el plugin `plugin-auth` no está registrado. | Verificar que los contenedores docker de GestasAI estén activos. |
| `invalid input syntax for type uuid` | Se envió un string (slug) en `tenantId` en lugar de un UUID o `null`. | Asegurar que `auth.js` resuelva el slug o envíe `null`. |
| `401 Unauthorized` | Credenciales incorrectas. | Verificar email y password. |

---

**Documentación generada automáticamente por el equipo de desarrollo de Marco CMS.**
