# ⚠️ Errores Comunes

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🔐 Autenticación

### Error: "Unauthorized"
**Causa**: Token JWT inválido o ausente.

**Solución**:
```javascript
// Verificar que el token se envía correctamente
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Error: "Invalid token"
**Causa**: Token expirado o firma inválida.

**Solución**: Renovar el token haciendo login nuevamente.

---

## 🗄️ Base de Datos

### Error: "duplicate key value violates unique constraint"
**Causa**: Intentando insertar un registro con un valor único que ya existe.

**Solución**:
```javascript
// Verificar antes de insertar
const existing = await db.query(
  'SELECT * FROM users WHERE email = $1 AND tenant_id = $2',
  [email, tenantId]
);

if (existing.rows.length > 0) {
  throw new Error('Email already exists');
}
```

### Error: "relation does not exist"
**Causa**: Tabla no existe en la base de datos.

**Solución**: Ejecutar el schema.sql:
```bash
docker-compose down -v
docker-compose up -d
```

---

## 🔴 Redis

### Error: "Connection refused"
**Causa**: Redis no está corriendo.

**Solución**:
```bash
docker-compose up redis -d
```

---

## 🐳 Docker

### Error: "port is already allocated"
**Causa**: Puerto ya en uso.

**Solución**:
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :3000

# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar puerto 3001 en host
```

---

## 🔧 Debugging

### Logs de un Servicio
```bash
docker-compose logs -f plugin-auth
```

### Entrar a un Contenedor
```bash
docker-compose exec plugin-auth sh
```

### Ver Estado de Servicios
```bash
docker-compose ps
```

---

**Última actualización**: 22 de Noviembre de 2025
