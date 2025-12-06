# 🏗️ Arquitectura General de GestasAI

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Visión Arquitectónica

GestasAI utiliza una **arquitectura de microservicios basada en plugins**, donde cada funcionalidad es un servicio independiente que se comunica a través de un API Gateway y un sistema de eventos (Redis pub/sub).

---

## 📊 Diagrama de Arquitectura Completa

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              React Application (Vite + TypeScript)         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │ Widgets  │  │  Pages   │  │Components│  │  Hooks   │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  │
│  │                    ConnectionManager (Axios)               │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌──────────────────────────────────────────────────────────────────┐
│                         API GATEWAY LAYER                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    API Gateway (Express)                    │  │
│  │  • Enrutamiento a plugins                                  │  │
│  │  • Autenticación JWT                                       │  │
│  │  • Rate limiting                                           │  │
│  │  • CORS                                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                         PLUGIN LAYER                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │plugin-   │  │plugin-   │  │plugin-   │  │plugin-   │  ...   │
│  │auth      │  │system    │  │cms       │  │ai-       │        │
│  │          │  │          │  │          │  │framework │        │
│  │:3004     │  │:3001     │  │:3002     │  │:3005     │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                      COMMUNICATION LAYER                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Redis (Pub/Sub)                          │  │
│  │  • Registro de plugins                                     │  │
│  │  • Heartbeats                                              │  │
│  │  • Eventos del sistema                                     │  │
│  │  • Cache                                                   │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │PostgreSQL│  │  Qdrant  │  │   AI     │                       │
│  │(Relacional)│  │(Vectorial)│  │ Models │                       │
│  │          │  │          │  │          │                       │
│  │• Tenants │  │• Code    │  │• Qwen    │                       │
│  │• Users   │  │• Docs    │  │• LoRA    │                       │
│  │• Roles   │  │• API     │  │          │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔌 Arquitectura de Plugins

### Anatomía de un Plugin

```
plugin-example/
├── manifest.json           # Configuración del plugin
├── package.json            # Dependencias npm
├── Dockerfile              # Imagen Docker
└── src/
    ├── index.js            # Servidor Express + Registro
    ├── /controllers        # Lógica de endpoints (granular)
    │   ├── UserController.js
    │   └── RoleController.js
    ├── /services           # Lógica de negocio (granular)
    │   ├── UserService.js
    │   └── ValidationService.js
    ├── /models             # Modelos de datos
    │   └── User.js
    ├── /utils              # Utilidades (una función por archivo)
    │   ├── hashPassword.js
    │   └── generateToken.js
    ├── /routes             # Definición de rutas
    │   └── user.routes.js
    └── /db                 # Conexión a base de datos
        └── index.js
```

### Ciclo de Vida de un Plugin

```
1. Inicio del contenedor Docker
        ↓
2. Carga de configuración (manifest.json)
        ↓
3. Conexión a PostgreSQL y Redis
        ↓
4. Registro en Redis (pub/sub)
        ↓
5. Publicación de evento "plugin:registered"
        ↓
6. API Gateway detecta el plugin
        ↓
7. Plugin listo para recibir requests
        ↓
8. Heartbeat cada 30 segundos
```

---

## 🌐 Flujo de una Request

### Request Típica

```
1. Usuario hace click en "Crear Usuario"
        ↓
2. Frontend (UserListWidget) → POST /api/plugins/plugin-system/api/users
        ↓
3. API Gateway recibe request
        ↓
4. Middleware de autenticación verifica JWT
        ↓
5. API Gateway enruta a plugin-system:3001/api/users
        ↓
6. plugin-system/UserController.create()
        ↓
7. UserService.createUser()
        ↓
8. Validaciones
        ↓
9. INSERT en PostgreSQL
        ↓
10. Respuesta JSON al frontend
        ↓
11. Frontend actualiza UI
```

### Request con Eventos

```
1. Usuario crea un post (plugin-cms)
        ↓
2. CMS guarda en DB
        ↓
3. CMS publica evento "post:created" en Redis
        ↓
4. plugin-analytics escucha y registra métrica
        ↓
5. plugin-notifications escucha y envía notificación
        ↓
6. Respuesta al usuario
```

---

## 🗄️ Arquitectura de Datos

### Multi-Tenancy

Todas las tablas incluyen `tenant_id`:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    email VARCHAR(255) NOT NULL,
    ...
    UNIQUE(tenant_id, email)
);
```

### Aislamiento de Datos

```javascript
// Middleware que filtra automáticamente por tenant
app.use((req, res, next) => {
  req.tenantId = req.user.tenant_id;
  next();
});

// Todas las queries incluyen tenant_id
const users = await db.query(
  'SELECT * FROM users WHERE tenant_id = $1',
  [req.tenantId]
);
```

---

## 🔐 Arquitectura de Seguridad

### Capas de Seguridad

```
1. HTTPS (TLS) - Transporte seguro
        ↓
2. CORS - Control de origen
        ↓
3. Rate Limiting - Prevención de abuso
        ↓
4. JWT Validation - Autenticación
        ↓
5. RBAC - Autorización
        ↓
6. Input Validation - Sanitización
        ↓
7. SQL Parameterization - Prevención de injection
        ↓
8. Audit Logs - Trazabilidad
```

### Flujo de Autenticación

```
1. Usuario envía email + password
        ↓
2. plugin-auth verifica credenciales
        ↓
3. Genera JWT con payload:
   {
     userId: "...",
     tenantId: "...",
     roleId: "...",
     permissions: [...]
   }
        ↓
4. Frontend almacena token en localStorage
        ↓
5. Cada request incluye: Authorization: Bearer <token>
        ↓
6. API Gateway valida token
        ↓
7. Extrae tenantId y permisos
        ↓
8. Verifica permisos para la acción
        ↓
9. Permite o deniega request
```

---

## 🤖 Arquitectura de IA

### Componentes AI

```
┌────────────────────────────────────────────────┐
│              plugin-ai-framework                │
│  ┌──────────────────────────────────────────┐  │
│  │         ModelService                     │  │
│  │  • Inferencia del modelo                │  │
│  │  • Generación de código                 │  │
│  │  • Chat                                 │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │         RAGService                       │  │
│  │  • Consultas a Qdrant                   │  │
│  │  • Recuperación de contexto             │  │
│  │  • Inyección en prompts                 │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │    GeminiSupervisorService               │  │
│  │  • Decisiones arquitectónicas           │  │
│  │  • Validación de código                 │  │
│  │  • Orquestación de workflows            │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

### Flujo de Generación de Código

```
1. Usuario: "Crea un controlador de productos"
        ↓
2. RAGService busca ejemplos similares en KB
        ↓
3. ModelService genera código con contexto
        ↓
4. GeminiSupervisor valida el código
        ↓
5. Si válido → Retorna código
   Si inválido → Pide corrección al modelo
        ↓
6. Código generado se guarda
        ↓
7. Dataset se actualiza para próximo entrenamiento
```

---

## 📦 Arquitectura de Deployment

### Desarrollo Local

```
docker-compose.yml:
  - frontend:5173
  - gateway:3000
  - plugin-auth:3004
  - plugin-system:3001
  - plugin-cms:3002
  - redis:6379
  - postgres:5432
```

### Producción (Kubernetes - Futuro)

```
┌─────────────────────────────────────────┐
│           Load Balancer                  │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│        Ingress Controller                │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│     Frontend Pods (3 replicas)          │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│     Gateway Pods (3 replicas)           │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│     Plugin Pods (auto-scaling)          │
│  • plugin-auth (2-5 replicas)           │
│  • plugin-system (2-5 replicas)         │
│  • plugin-cms (2-5 replicas)            │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│     Data Layer                           │
│  • PostgreSQL (HA cluster)              │
│  • Redis (cluster mode)                 │
│  • Qdrant (distributed)                 │
└─────────────────────────────────────────┘
```

---

## 🔄 Patrones Arquitectónicos

### 1. Event-Driven Architecture
- Plugins publican eventos en Redis
- Otros plugins se suscriben a eventos
- Desacoplamiento total

### 2. CQRS (Command Query Responsibility Segregation)
- Comandos (write) separados de queries (read)
- Optimización independiente

### 3. Repository Pattern
- Abstracción de acceso a datos
- Fácil de testear y cambiar DB

### 4. Service Layer
- Lógica de negocio en servicios
- Controladores delgados

### 5. Dependency Injection
- Servicios inyectados
- Fácil de mockear en tests

---

## 📈 Escalabilidad

### Horizontal Scaling
- Agregar más instancias de plugins
- Load balancing automático
- Sin estado compartido

### Vertical Scaling
- Aumentar recursos de contenedores
- Optimización de queries
- Caching agresivo

### Database Scaling
- Read replicas para queries
- Sharding por tenant (futuro)
- Connection pooling

---

## 🔍 Monitoreo y Observabilidad

### Logs
- Logs estructurados (JSON)
- Niveles: ERROR, WARN, INFO, DEBUG
- Agregación con ELK stack (futuro)

### Métricas
- Prometheus para métricas
- Grafana para visualización
- Alertas automáticas

### Tracing
- OpenTelemetry (futuro)
- Trazabilidad de requests
- Performance profiling

---

## 📖 Próximos Pasos

Continúa con:
- [Guía de Estilo](./04-guia-de-estilo.md)
- [Convenciones de Nombre](./05-convenciones-nombre.md)

---

**Última actualización**: 22 de Noviembre de 2025
