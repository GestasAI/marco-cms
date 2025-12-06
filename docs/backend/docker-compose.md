# 🐳 Docker Compose

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 📋 Configuración Completa

```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build: ./frontend/shell
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000
    volumes:
      - ./frontend/shell:/app
      - /app/node_modules

  # API Gateway
  gateway:
    build: ./gateway
    ports:
      - "3000:3000"
    environment:
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - redis

  # Plugin Auth
  plugin-auth:
    build: ./packages/plugin-auth
    ports:
      - "3004:3004"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/gestasai
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  # Plugin System
  plugin-system:
    build: ./packages/plugin-system
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/gestasai
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=gestasai
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backend/system/src/db/schema.sql:/docker-entrypoint-initdb.d/schema.sql

volumes:
  redis-data:
  postgres-data:
```

---

## 🔧 Variables de Entorno

Crear archivo `.env`:

```bash
# JWT
JWT_SECRET=your-secret-key-here

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/gestasai

# Redis
REDIS_URL=redis://localhost:6379

# Ports
GATEWAY_PORT=3000
PLUGIN_AUTH_PORT=3004
PLUGIN_SYSTEM_PORT=3001
```

---

## 🚀 Comandos Útiles

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f gateway
docker-compose logs -f plugin-auth

# Reiniciar un servicio
docker-compose restart plugin-auth

# Detener todo
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

---

**Última actualización**: 22 de Noviembre de 2025
