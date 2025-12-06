# 📡 API Reference

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🔐 Autenticación (plugin-auth)

### POST /api/plugins/plugin-auth/api/login
Autentica un usuario y retorna JWT.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "tenantId": "uuid"
}
```

**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

---

## 👥 Usuarios (plugin-system)

### GET /api/plugins/plugin-system/api/users
Lista usuarios del tenant.

**Headers**:
```
Authorization: Bearer <token>
```

**Query Params**:
- `tenantId` (required): UUID del tenant
- `page` (optional): Número de página (default: 1)
- `pageSize` (optional): Tamaño de página (default: 20)

**Response** (200):
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "roleId": "uuid",
      "isActive": true
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

### POST /api/plugins/plugin-system/api/users
Crea un nuevo usuario.

**Request**:
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "full_name": "Jane Doe",
  "role_id": "uuid"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "email": "newuser@example.com",
  "fullName": "Jane Doe"
}
```

---

## 🎭 Roles (plugin-system)

### GET /api/plugins/plugin-system/api/roles
Lista roles del tenant.

### POST /api/plugins/plugin-system/api/roles
Crea un nuevo rol.

### PUT /api/plugins/plugin-system/api/roles/:id/permissions
Actualiza permisos de un rol.

---

## ❌ Códigos de Error

- `400` - Bad Request (validación fallida)
- `401` - Unauthorized (token inválido/ausente)
- `403` - Forbidden (sin permisos)
- `404` - Not Found
- `500` - Internal Server Error

---

**Última actualización**: 22 de Noviembre de 2025
