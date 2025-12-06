# 🔗 Registro de Plugins

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Proceso de Registro

### 1. Plugin Inicia
```javascript
const app = express();
const PORT = process.env.PORT || 3010;

app.listen(PORT, async () => {
  console.log(`Plugin running on port ${PORT}`);
  await registerPlugin();
});
```

### 2. Conectar a Redis
```javascript
const redis = require('redis').createClient({
  url: process.env.REDIS_URL
});

await redis.connect();
```

### 3. Publicar Evento de Registro
```javascript
const registerPlugin = async () => {
  const manifest = require('../manifest.json');
  
  await redis.publish('plugin:registered', JSON.stringify({
    key: manifest.key,
    name: manifest.name,
    version: manifest.version,
    port: PORT,
    endpoints: manifest.endpoints,
    timestamp: Date.now()
  }));
  
  console.log(`Plugin ${manifest.key} registered`);
};
```

### 4. API Gateway Detecta Plugin
El API Gateway escucha el canal `plugin:registered`:

```javascript
// En API Gateway
subscriber.subscribe('plugin:registered', (message) => {
  const plugin = JSON.parse(message);
  
  // Registrar rutas del plugin
  plugin.endpoints.forEach(endpoint => {
    const fullPath = `/api/plugins/${plugin.key}${endpoint.path}`;
    
    app[endpoint.method.toLowerCase()](fullPath, async (req, res) => {
      // Proxy request al plugin
      const response = await axios({
        method: endpoint.method,
        url: `http://${plugin.key}:${plugin.port}${endpoint.path}`,
        data: req.body,
        headers: req.headers
      });
      
      res.json(response.data);
    });
  });
  
  console.log(`Plugin ${plugin.key} routes registered`);
});
```

---

## 💓 Heartbeat

### Enviar Heartbeat
```javascript
// Cada 30 segundos
setInterval(() => {
  redis.publish('plugin:heartbeat', JSON.stringify({
    key: manifest.key,
    timestamp: Date.now(),
    status: 'alive'
  }));
}, 30000);
```

### Monitorear Heartbeats
```javascript
// En API Gateway o sistema de monitoreo
const pluginHeartbeats = new Map();

subscriber.subscribe('plugin:heartbeat', (message) => {
  const { key, timestamp } = JSON.parse(message);
  pluginHeartbeats.set(key, timestamp);
});

// Verificar plugins muertos
setInterval(() => {
  const now = Date.now();
  const timeout = 60000; // 1 minuto
  
  pluginHeartbeats.forEach((lastHeartbeat, key) => {
    if (now - lastHeartbeat > timeout) {
      console.warn(`Plugin ${key} appears to be dead`);
      // Marcar como inactivo
    }
  });
}, 30000);
```

---

## 🔄 Desregistro

Cuando un plugin se detiene:

```javascript
process.on('SIGTERM', async () => {
  await redis.publish('plugin:unregistered', JSON.stringify({
    key: manifest.key,
    timestamp: Date.now()
  }));
  
  await redis.disconnect();
  process.exit(0);
});
```

---

**Última actualización**: 22 de Noviembre de 2025
