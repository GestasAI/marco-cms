# 🏗️ Arquitectura del Backend

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Visión General

El backend de GestasAI está construido con una **arquitectura de microservicios basada en plugins**, donde cada plugin es un servicio independiente que se comunica a través de un API Gateway y Redis.

---

## 📊 Componentes Principales

### 1. API Gateway
- **Puerto**: 3000
- **Tecnología**: Express.js
- **Responsabilidades**:
  - Enrutamiento a plugins
  - Autenticación JWT
  - Rate limiting
  - CORS
  - Logging

### 2. Plugins (Microservicios)
Cada plugin es un microservicio independiente:
- `plugin-auth` (Puerto 3004) - Autenticación
- `plugin-system` (Puerto 3001) - Usuarios y roles
- `plugin-cms` (Puerto 3002) - Gestión de contenido
- `plugin-ai-framework` (Puerto 3005) - IA

### 3. Redis
- **Puerto**: 6379
- **Uso**:
  - Pub/Sub para comunicación entre plugins
  - Cache
  - Registro de plugins
  - Heartbeats

### 4. PostgreSQL
- **Puerto**: 5432
- **Uso**:
  - Datos relacionales
  - Multi-tenancy
  - Transacciones ACID

---

## 🔄 Flujo de Comunicación

```
Cliente → API Gateway → Plugin → PostgreSQL/Redis
                ↓
         Middleware Auth
                ↓
         Verificación RBAC
```

---

## 🐳 Docker Compose

Todos los servicios corren en contenedores Docker orquestados con Docker Compose:

```yaml
services:
  gateway:
    build: ./gateway
    ports: ["3000:3000"]
  
  plugin-auth:
    build: ./packages/plugin-auth
    ports: ["3004:3004"]
  
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
  
  postgres:
    image: postgres:15-alpine
    ports: ["5432:5432"]
```

---

## 📖 Próximos Pasos

- [Flujo de Autenticación](./flujo-autenticacion.md)
- [Estructura de Módulos](./estructura-modulos.md)
- [Microservicios](./microservicios.md)

---

**Última actualización**: 22 de Noviembre de 2025
