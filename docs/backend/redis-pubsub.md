# 🔴 Redis Pub/Sub

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Canales de Comunicación

### plugin:registered
Publicado cuando un plugin se registra.

**Payload**:
```json
{
  "key": "plugin-auth",
  "name": "Authentication Plugin",
  "port": 3004,
  "endpoints": [...]
}
```

### plugin:heartbeat
Publicado cada 30 segundos por cada plugin.

**Payload**:
```json
{
  "key": "plugin-auth",
  "timestamp": 1700000000000
}
```

### user:created
Publicado cuando se crea un usuario.

**Payload**:
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "tenantId": "uuid"
}
```

---

## 💻 Implementación

### Publicar Evento
```javascript
const redis = require('redis').createClient({
  url: process.env.REDIS_URL
});

await redis.publish('user:created', JSON.stringify({
  userId: user.id,
  email: user.email,
  tenantId: user.tenant_id
}));
```

### Suscribirse a Evento
```javascript
const subscriber = redis.duplicate();

await subscriber.subscribe('user:created', (message) => {
  const data = JSON.parse(message);
  console.log('New user created:', data);
  // Realizar acción
});
```

---

## 🗄️ Cache

Redis también se usa para cache:

```javascript
// Guardar en cache
await redis.set('user:123', JSON.stringify(user), {
  EX: 3600 // Expira en 1 hora
});

// Obtener de cache
const cached = await redis.get('user:123');
const user = JSON.parse(cached);
```

---

**Última actualización**: 22 de Noviembre de 2025
