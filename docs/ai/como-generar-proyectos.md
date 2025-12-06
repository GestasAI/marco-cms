# 🏗️ Cómo Generar Proyectos

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025  
**Audiencia**: Sistema de IA

---

## 🎯 Objetivo

Guiar al modelo de IA sobre cómo generar proyectos completos basados en la arquitectura de GestasAI.

---

## 📋 Proceso de Generación

### 1. Analizar Requerimientos
```
Input: "Crea una aplicación de gestión de inventario con productos, categorías y proveedores"

Análisis:
- Entidades: Product, Category, Supplier
- Relaciones: Product -> Category, Product -> Supplier
- Funcionalidades: CRUD para cada entidad
- Plugins necesarios: plugin-inventory
```

### 2. Definir Estructura
```
proyecto-inventario/
├── docker-compose.yml
├── .env.example
├── README.md
├── packages/
│   └── plugin-inventory/
│       ├── manifest.json
│       ├── package.json
│       ├── Dockerfile
│       └── src/
│           ├── index.js
│           ├── controllers/
│           │   ├── ProductController.js
│           │   ├── CategoryController.js
│           │   └── SupplierController.js
│           ├── services/
│           │   ├── ProductService.js
│           │   ├── CategoryService.js
│           │   └── SupplierService.js
│           ├── routes/
│           │   ├── product.routes.js
│           │   ├── category.routes.js
│           │   └── supplier.routes.js
│           └── db/
│               ├── index.js
│               └── schema.sql
└── frontend/
    └── shell/
        └── src/
            └── components/
                └── widgets/
                    ├── ProductListWidget.jsx
                    ├── CategoryListWidget.jsx
                    └── SupplierListWidget.jsx
```

### 3. Generar Archivos Base

#### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend/shell
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000

  gateway:
    build: ./gateway
    ports:
      - "3000:3000"
    environment:
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}

  plugin-inventory:
    build: ./packages/plugin-inventory
    ports:
      - "3020:3020"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/inventario
      - REDIS_URL=redis://redis:6379

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=inventario
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - ./packages/plugin-inventory/src/db/schema.sql:/docker-entrypoint-initdb.d/schema.sql
```

### 4. Generar Schema de Base de Datos

#### schema.sql
```sql
-- Tenants
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, name)
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    category_id UUID REFERENCES categories(id),
    supplier_id UUID REFERENCES suppliers(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100),
    price DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, sku)
);

-- Seed data
INSERT INTO tenants (name, slug) VALUES ('Demo Company', 'demo') ON CONFLICT DO NOTHING;
```

### 5. Generar README.md

```markdown
# Sistema de Gestión de Inventario

Aplicación basada en GestasAI para gestionar productos, categorías y proveedores.

## Características

- Gestión de productos
- Categorización de productos
- Gestión de proveedores
- Multi-tenancy
- API REST

## Instalación

1. Clonar repositorio
2. Configurar `.env`
3. Ejecutar `docker-compose up`

## Uso

Acceder a `http://localhost:5173`
```

---

## ✅ Checklist de Generación

- [ ] Estructura de directorios completa
- [ ] docker-compose.yml configurado
- [ ] Schema SQL con todas las tablas
- [ ] Seed data incluido
- [ ] Controllers para todas las entidades
- [ ] Services para todas las entidades
- [ ] Routes definidas
- [ ] Widgets del frontend
- [ ] README.md con instrucciones
- [ ] .env.example con variables necesarias
- [ ] Proyecto puede ejecutarse con `docker-compose up`

---

**Última actualización**: 22 de Noviembre de 2025
