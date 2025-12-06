# 🔄 Comunicación entre Plugins

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Métodos de Comunicación

### 1. Redis Pub/Sub (Recomendado)
Para eventos asíncronos entre plugins.

### 2. HTTP REST
Para comunicación directa síncrona.

### 3. Base de Datos Compartida
Para datos compartidos (usar con cuidado).

---

## 📡 Redis Pub/Sub

### Publicar Evento
```javascript
// En plugin-cms
await redis.publish('post:created', JSON.stringify({
  postId: '123',
  title: 'New Post',
  authorId: 'user-456',
  tenantId: 'tenant-789'
}));
```

### Suscribirse a Evento
```javascript
// En plugin-analytics
const subscriber = redis.duplicate();

await subscriber.subscribe('post:created', (message) => {
  const data = JSON.parse(message);
  
  // Registrar métrica
  await analytics.track({
    event: 'post_created',
    postId: data.postId,
    tenantId: data.tenantId,
    timestamp: Date.now()
  });
});
```

---

## 🌐 HTTP REST

### Llamada Directa entre Plugins
```javascript
// En plugin-auth
const axios = require('axios');

const notifyUserCreated = async (user) => {
  try {
    await axios.post('http://plugin-system:3001/api/internal/user-created', {
      userId: user.id,
      email: user.email,
      tenantId: user.tenant_id
    });
  } catch (error) {
    console.error('Failed to notify plugin-system:', error);
  }
};
```

---

## 📋 Patrones de Comunicación

### 1. Event-Driven (Pub/Sub)
**Cuándo usar**: Eventos que múltiples plugins pueden necesitar.

**Ejemplo**: Usuario creado
- `plugin-auth` publica `user:created`
- `plugin-system` escucha y crea perfil
- `plugin-analytics` escucha y registra métrica
- `plugin-email` escucha y envía bienvenida

### 2. Request-Response (HTTP)
**Cuándo usar**: Necesitas respuesta inmediata.

**Ejemplo**: Validar permiso
```javascript
const hasPermission = await axios.get(
  'http://plugin-system:3001/api/internal/check-permission',
  { params: { userId, permission: 'posts:create' } }
);
```

### 3. Shared Data (Database)
**Cuándo usar**: Datos que todos necesitan leer.

**Ejemplo**: Tabla `tenants` compartida por todos.

---

## 🔒 Seguridad en Comunicación

### Endpoints Internos
Crear endpoints solo para comunicación entre plugins:

```javascript
// Solo accesible desde red interna de Docker
app.post('/api/internal/user-created', (req, res) => {
  // No requiere autenticación JWT
  // Solo accesible desde otros contenedores
  const { userId, email } = req.body;
  // Procesar
  res.json({ success: true });
});
```

### Validación de Origen
```javascript
const isInternalRequest = (req) => {
  const ip = req.ip;
  return ip.startsWith('172.') || ip.startsWith('10.');
};

app.post('/api/internal/endpoint', (req, res) => {
  if (!isInternalRequest(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Procesar
});
```

---

## 📊 Ejemplo Completo

### Escenario: Usuario Crea un Post

```javascript
// 1. plugin-cms recibe request
app.post('/api/posts', async (req, res) => {
  const post = await createPost(req.body);
  
  // 2. Publicar evento
  await redis.publish('post:created', JSON.stringify({
    postId: post.id,
    authorId: req.user.id,
    tenantId: req.tenantId
  }));
  
  res.json(post);
});

// 3. plugin-analytics escucha
subscriber.subscribe('post:created', async (message) => {
  const { postId, authorId, tenantId } = JSON.parse(message);
  await trackEvent('post_created', { postId, authorId, tenantId });
});

// 4. plugin-notifications escucha
subscriber.subscribe('post:created', async (message) => {
  const { postId, authorId } = JSON.parse(message);
  
  // Obtener seguidores del autor (HTTP call)
  const followers = await axios.get(
    `http://plugin-system:3001/api/internal/followers/${authorId}`
  );
  
  // Enviar notificaciones
  followers.data.forEach(follower => {
    sendNotification(follower.id, `New post from ${authorId}`);
  });
});
```

---

**Última actualización**: 22 de Noviembre de 2025
