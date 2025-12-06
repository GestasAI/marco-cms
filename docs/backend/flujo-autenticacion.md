# 🔐 Flujo de Autenticación

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Login Flow

### 1. Usuario Envía Credenciales
```javascript
POST /api/plugins/plugin-auth/api/login
{
  "email": "user@example.com",
  "password": "password123",
  "tenantId": "uuid"
}
```

### 2. Validación de Credenciales
```javascript
// plugin-auth/src/services/AuthService.js
const user = await db.query(
  'SELECT * FROM users WHERE email = $1 AND tenant_id = $2',
  [email, tenantId]
);

const isValid = await bcrypt.compare(password, user.password_hash);
```

### 3. Generación de JWT
```javascript
const token = jwt.sign(
  {
    userId: user.id,
    tenantId: user.tenant_id,
    roleId: user.role_id,
    permissions: user.permissions
  },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);
```

### 4. Respuesta al Cliente
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "roleId": "uuid",
    "tenantId": "uuid"
  }
}
```

---

## 🔑 Validación de Token

### Middleware de Autenticación
```javascript
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.tenantId = decoded.tenantId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 🛡️ RBAC (Role-Based Access Control)

### Verificación de Permisos
```javascript
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Uso
app.post('/api/users', 
  authMiddleware, 
  requirePermission('users:create'), 
  UserController.create
);
```

---

## 🔄 Refresh Tokens (Futuro)

```javascript
// Generar refresh token
const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.REFRESH_SECRET,
  { expiresIn: '30d' }
);

// Endpoint de refresh
POST /api/plugins/plugin-auth/api/refresh
{
  "refreshToken": "..."
}
```

---

**Última actualización**: 22 de Noviembre de 2025
