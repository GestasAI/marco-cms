# 🏗️ Estructura de Proyecto Nuevo

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025  
**Audiencia**: Sistema de IA

---

## 🎯 Estructura Completa

Cuando generes un proyecto nuevo, usar esta estructura:

```
proyecto-nombre/
├── .env.example
├── .gitignore
├── README.md
├── docker-compose.yml
├── gateway/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js
├── packages/
│   └── plugin-{{nombre}}/
│       ├── manifest.json
│       ├── package.json
│       ├── Dockerfile
│       ├── README.md
│       └── src/
│           ├── index.js
│           ├── controllers/
│           ├── services/
│           ├── routes/
│           ├── utils/
│           └── db/
│               ├── index.js
│               └── schema.sql
└── frontend/
    └── shell/
        ├── package.json
        ├── vite.config.js
        ├── tailwind.config.js
        └── src/
            ├── App.jsx
            ├── main.jsx
            ├── components/
            │   └── widgets/
            └── services/
                └── ConnectionManager.js
```

---

## 📄 Archivos Requeridos

### .env.example
```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/{{dbname}}

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-here

# Ports
GATEWAY_PORT=3000
PLUGIN_{{NOMBRE}}_PORT=3010
```

### README.md
```markdown
# {{Nombre del Proyecto}}

{{Descripción breve}}

## Características

- {{Característica 1}}
- {{Característica 2}}
- {{Característica 3}}

## Requisitos

- Docker
- Docker Compose
- Node.js 18+ (para desarrollo local)

## Instalación

1. Clonar el repositorio
2. Copiar `.env.example` a `.env`
3. Configurar variables de entorno
4. Ejecutar `docker-compose up`

## Uso

Acceder a `http://localhost:5173`

## Estructura

- `/gateway` - API Gateway
- `/packages` - Plugins
- `/frontend` - Aplicación React

## Tecnologías

- Backend: Node.js, Express, PostgreSQL, Redis
- Frontend: React, Vite, Tailwind CSS
- DevOps: Docker, Docker Compose

## Licencia

MIT
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend/shell
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000
    volumes:
      - ./frontend/shell:/app
      - /app/node_modules

  gateway:
    build: ./gateway
    ports:
      - "3000:3000"
    environment:
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - redis

  plugin-{{nombre}}:
    build: ./packages/plugin-{{nombre}}
    ports:
      - "3010:3010"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB={{dbname}}
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./packages/plugin-{{nombre}}/src/db/schema.sql:/docker-entrypoint-initdb.d/schema.sql

volumes:
  redis-data:
  postgres-data:
```

---

## ✅ Checklist de Generación

Al generar un proyecto nuevo, verificar:

- [ ] Estructura de directorios completa
- [ ] `.env.example` con todas las variables
- [ ] `.gitignore` apropiado
- [ ] `README.md` con instrucciones claras
- [ ] `docker-compose.yml` configurado
- [ ] Gateway configurado
- [ ] Al menos un plugin funcional
- [ ] Frontend con widget básico
- [ ] Schema SQL con seed data
- [ ] Proyecto ejecutable con `docker-compose up`
- [ ] Documentación de API
- [ ] Tests básicos (futuro)

---

**Última actualización**: 22 de Noviembre de 2025
