# 🔌 Microservicios

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Ciclo de Vida de un Plugin

### 1. Inicio del Contenedor
```bash
docker-compose up plugin-auth
```

### 2. Carga de Configuración
```javascript
// src/index.js
const manifest = require('./manifest.json');
const PORT = process.env.PORT || 3004;
```

### 3. Conexión a Infraestructura
```javascript
// Conectar a PostgreSQL
const db = require('./db');

// Conectar a Redis
const redis = require('redis').createClient({
  url: process.env.REDIS_URL
});
```

### 4. Registro en Redis
```javascript
// Publicar evento de registro
await redis.publish('plugin:registered', JSON.stringify({
  key: manifest.key,
  name: manifest.name,
  port: PORT,
  endpoints: manifest.endpoints
}));
```

### 5. Heartbeat
```javascript
// Enviar heartbeat cada 30 segundos
setInterval(() => {
  redis.publish('plugin:heartbeat', JSON.stringify({
    key: manifest.key,
    timestamp: Date.now()
  }));
}, 30000);
```

---

## 📋 manifest.json

```json
{
  "key": "plugin-auth",
  "name": "Authentication Plugin",
  "version": "1.0.0",
  "description": "Handles user authentication",
  "author": "GestasAI",
  "network": {
    "host": "plugin-auth",
    "port": 3004
  },
  "endpoints": [
    {
      "path": "/api/login",
      "method": "POST"
    },
    {
      "path": "/api/logout",
      "method": "POST"
    }
  ],
  "dependencies": {
    "postgres": true,
    "redis": true
  }
}
```

---

## 🔄 Comunicación entre Plugins

### Pub/Sub con Redis
```javascript
// Plugin A publica evento
redis.publish('user:created', JSON.stringify({
  userId: '123',
  email: 'user@example.com'
}));

// Plugin B se suscribe
redis.subscribe('user:created', (message) => {
  const data = JSON.parse(message);
  console.log('New user:', data);
});
```

---

**Última actualización**: 22 de Noviembre de 2025
