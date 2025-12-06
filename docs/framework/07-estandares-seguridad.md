# 🔐 Estándares de Seguridad en GestasAI

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Principios de Seguridad

1. **Defense in Depth** - Múltiples capas de seguridad
2. **Least Privilege** - Mínimos permisos necesarios
3. **Fail Secure** - Fallar de forma segura
4. **Security by Design** - Seguridad desde el diseño

---

## 🔑 Autenticación

### JWT
- **Algoritmo**: HS256
- **Expiración**: 8 horas
- **Refresh**: Implementar refresh tokens
- **Payload**: userId, tenantId, roleId, permissions

```javascript
const token = jwt.sign(
  { userId, tenantId, roleId, permissions },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);
```

### Contraseñas
- **Hash**: bcrypt con 10 rounds
- **Mínimo**: 8 caracteres
- **Requisitos**: Mayúsculas, minúsculas, números, símbolos

```javascript
const hash = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hash);
```

---

## 🛡️ Autorización (RBAC)

### Permisos Granulares
```
users:create
users:read
users:update
users:delete
roles:manage
```

### Verificación
```javascript
const hasPermission = (user, permission) => {
  return user.permissions.includes(permission);
};
```

---

## 🔒 Protección de Datos

### Multi-Tenancy
- Filtrado automático por `tenant_id`
- Aislamiento total de datos
- Validación en cada query

### SQL Injection
- **Siempre** usar queries parametrizadas
- Nunca concatenar strings en SQL

```javascript
// ✅ SEGURO
db.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ INSEGURO
db.query(`SELECT * FROM users WHERE id = '${userId}'`);
```

### XSS
- Sanitizar inputs
- Escapar outputs
- Content Security Policy

---

## 🚦 Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 requests por ventana
});

app.use('/api/', limiter);
```

---

## 📝 Auditoría

### Logs de Seguridad
- Login attempts
- Permission changes
- Data access
- Failed authentications

```javascript
logger.security({
  event: 'login_attempt',
  userId,
  tenantId,
  success: true,
  ip: req.ip,
  timestamp: new Date()
});
```

---

**Última actualización**: 22 de Noviembre de 2025
