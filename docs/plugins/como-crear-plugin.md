# 🔌 Cómo Crear un Plugin

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Pasos para Crear un Plugin

### 1. Crear Estructura de Carpetas

```bash
mkdir -p packages/plugin-example/src/{controllers,services,models,routes,utils,db}
cd packages/plugin-example
```

### 2. Crear package.json

```json
{
  "name": "@gestasai/plugin-example",
  "version": "1.0.0",
  "description": "Example plugin for GestasAI",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "pg": "^8.11.0",
    "redis": "^4.6.7"
  }
}
```

### 3. Crear manifest.json

```json
{
  "key": "plugin-example",
  "name": "Example Plugin",
  "version": "1.0.0",
  "description": "An example plugin",
  "author": "GestasAI",
  "network": {
    "host": "plugin-example",
    "port": 3010
  },
  "endpoints": [
    {
      "path": "/api/example",
      "method": "GET",
      "description": "Example endpoint"
    }
  ],
  "dependencies": {
    "postgres": true,
    "redis": true
  }
}
```

### 4. Crear Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3010

CMD ["npm", "start"]
```

### 5. Crear src/index.js

```javascript
const express = require('express');
const cors = require('cors');
const redis = require('redis').createClient({ url: process.env.REDIS_URL });
const manifest = require('../manifest.json');

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());

// Rutas
app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from Example Plugin!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', plugin: manifest.key });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`${manifest.name} running on port ${PORT}`);
  
  // Conectar a Redis
  await redis.connect();
  
  // Registrar plugin
  await redis.publish('plugin:registered', JSON.stringify({
    key: manifest.key,
    name: manifest.name,
    port: PORT,
    endpoints: manifest.endpoints
  }));
  
  // Heartbeat
  setInterval(() => {
    redis.publish('plugin:heartbeat', JSON.stringify({
      key: manifest.key,
      timestamp: Date.now()
    }));
  }, 30000);
});
```

### 6. Agregar a docker-compose.yml

```yaml
plugin-example:
  build: ./packages/plugin-example
  ports:
    - "3010:3010"
  environment:
    - DATABASE_URL=postgresql://postgres:password@postgres:5432/gestasai
    - REDIS_URL=redis://redis:6379
  depends_on:
    - postgres
    - redis
```

### 7. Instalar Dependencias y Probar

```bash
npm install
docker-compose up plugin-example
```

---

## ✅ Checklist de Creación

- [ ] Estructura de carpetas creada
- [ ] package.json configurado
- [ ] manifest.json completo
- [ ] Dockerfile creado
- [ ] src/index.js con servidor Express
- [ ] Rutas definidas
- [ ] Agregado a docker-compose.yml
- [ ] Probado localmente
- [ ] Documentación creada

---

**Última actualización**: 22 de Noviembre de 2025
