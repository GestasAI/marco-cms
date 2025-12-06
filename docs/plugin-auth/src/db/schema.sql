-- GESTAS AI SYSTEM DATABASE SCHEMA
-- Version: 1.6.0 (Bridge Auto-Registration Support)
-- Description: Master schema for Multi-Tenant, Modular, Billing-enabled BOS.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TENANTS (CLIENTES)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ROLES (ROLES POR TENANT)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

-- 3. PERMISSIONS (PERMISOS GLOBALES)
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ROLE_PERMISSIONS (RELACIÓN MUCHOS A MUCHOS)
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 5. USERS (USUARIOS GLOBALES)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_super_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, email)
);

-- 6. BILLING PLANS (PLANES DE FACTURACIÓN)
CREATE TABLE IF NOT EXISTS billing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    interval VARCHAR(50) NOT NULL,
    interval_count INTEGER DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    is_public BOOLEAN DEFAULT TRUE
);

-- 7. ADDONS (CATÁLOGO DE MÓDULOS)
CREATE TABLE IF NOT EXISTS addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    version VARCHAR(50) DEFAULT '1.0.0',
    is_system BOOLEAN DEFAULT FALSE,
    category VARCHAR(50),
    author VARCHAR(255),
    homepage VARCHAR(255),
    ui_config JSONB DEFAULT '{}'::jsonb
);

-- 8. PLUGINS (UNIDADES FUNCIONALES) - Con soporte para Bridge Auto-Registration
CREATE TABLE IF NOT EXISTS plugins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    addon_id UUID REFERENCES addons(id) ON DELETE CASCADE,
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    host VARCHAR(255),
    port INTEGER,
    version VARCHAR(50),
    base_price DECIMAL(10, 2) DEFAULT 0.00,
    capabilities JSONB DEFAULT '[]',
    network_config JSONB DEFAULT '{}',
    ai_config JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'OFFLINE',
    last_heartbeat TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. SUBSCRIPTIONS (CONTRATOS)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    billing_plan_id UUID REFERENCES billing_plans(id),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SUBSCRIPTION ITEMS (QUÉ TIENE ACTIVADO EL CLIENTE)
CREATE TABLE IF NOT EXISTS subscription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    plugin_id UUID REFERENCES plugins(id),
    is_active BOOLEAN DEFAULT TRUE,
    config JSONB DEFAULT '{}',
    override_price DECIMAL(10, 2)
);

-- 11. DEPLOYMENTS (VERSIONADO DEL FRONTEND)
CREATE TABLE IF NOT EXISTS deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    config_snapshot JSONB NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. EXTERNAL PLUGINS (PLUGINS EXTERNOS REGISTRADOS VÍA API)
CREATE TABLE IF NOT EXISTS external_plugins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificación
    key VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    
    -- Clasificación
    type VARCHAR(50) DEFAULT 'EXTERNAL',
    category VARCHAR(50),
    author VARCHAR(255),
    homepage VARCHAR(500),
    icon VARCHAR(100),
    
    -- Metadata JSON (compatible con manifest.json)
    capabilities JSONB DEFAULT '[]'::jsonb,
    ui JSONB DEFAULT '{}'::jsonb,
    network JSONB DEFAULT '{}'::jsonb,
    store_media JSONB DEFAULT '{}'::jsonb,
    
    -- Seguridad
    api_key_hash VARCHAR(255),
    allowed_origins JSONB DEFAULT '[]'::jsonb,
    
    -- Estado y monitoreo
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'OFFLINE', 'SUSPENDED')),
    is_active BOOLEAN DEFAULT true,
    last_heartbeat TIMESTAMP WITH TIME ZONE,
    
    -- Auditoría
    registered_by UUID REFERENCES users(id) ON DELETE SET NULL,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- DATOS SEMILLA: PERMISOS GLOBALES
INSERT INTO permissions (name, resource, action, description) VALUES
('users:create', 'users', 'create', 'Crear usuarios'),
('users:read', 'users', 'read', 'Ver usuarios'),
('users:update', 'users', 'update', 'Editar usuarios'),
('users:delete', 'users', 'delete', 'Eliminar usuarios'),
('roles:create', 'roles', 'create', 'Crear roles'),
('roles:read', 'roles', 'read', 'Ver roles'),
('roles:update', 'roles', 'update', 'Editar roles'),
('roles:delete', 'roles', 'delete', 'Eliminar roles'),
('plugins:install', 'plugins', 'install', 'Instalar plugins'),
('plugins:configure', 'plugins', 'configure', 'Configurar plugins'),
('plugins:read', 'plugins', 'read', 'Ver plugins'),
('plugins:create', 'plugins', 'create', 'Registrar plugins externos'),
('plugins:delete', 'plugins', 'delete', 'Eliminar plugins'),
('billing:read', 'billing', 'read', 'Ver facturación'),
('billing:manage', 'billing', 'manage', 'Gestionar facturación'),
('tenants:read', 'tenants', 'read', 'Ver información del tenant'),
('tenants:update', 'tenants', 'update', 'Actualizar configuración del tenant')
ON CONFLICT (name) DO NOTHING;

-- DATOS SEMILLA: TENANT SUPERADMIN (SonnativeAI)
INSERT INTO tenants (id, name, slug, domain, status)
VALUES ('00000000-0000-0000-0000-000000000000', 'SonnativeAI', 'sonnativeai', 'sonnativeai.gestasai.com', 'ACTIVE')
ON CONFLICT (slug) DO NOTHING;

-- DATOS SEMILLA: TENANT DEMO
INSERT INTO tenants (id, name, slug, domain, status)
VALUES ('c943f795-12ec-456a-8f77-4d995e8e183c', 'Demo Tenant', 'demo', 'demo.gestasai.com', 'ACTIVE')
ON CONFLICT (slug) DO NOTHING;

-- DATOS SEMILLA: ROLES DEL SISTEMA (para SonnativeAI - SuperAdmin)
INSERT INTO roles (id, tenant_id, name, description, is_system_role) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000000', 'SuperAdmin', 'Acceso total al sistema. Puede gestionar todos los aspectos de la plataforma.', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000000', 'Administrador', 'Administrador del tenant. Puede gestionar usuarios, roles y configuración.', true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '00000000-0000-0000-0000-000000000000', 'Editor', 'Puede crear y editar contenido, pero no gestionar usuarios ni configuración.', true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '00000000-0000-0000-0000-000000000000', 'Visor', 'Solo puede ver contenido. No puede realizar modificaciones.', true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '00000000-0000-0000-0000-000000000000', 'Cliente', 'Acceso limitado para clientes externos. Solo puede ver información pública.', true)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- DATOS SEMILLA: ROLES DEL SISTEMA (para Demo Tenant)
INSERT INTO roles (id, tenant_id, name, description, is_system_role) VALUES
('11111111-1111-1111-1111-111111111111', 'c943f795-12ec-456a-8f77-4d995e8e183c', 'SuperAdmin', 'Acceso total al sistema. Puede gestionar todos los aspectos de la plataforma.', true),
('22222222-2222-2222-2222-222222222222', 'c943f795-12ec-456a-8f77-4d995e8e183c', 'Administrador', 'Administrador del tenant. Puede gestionar usuarios, roles y configuración.', true),
('33333333-3333-3333-3333-333333333333', 'c943f795-12ec-456a-8f77-4d995e8e183c', 'Editor', 'Puede crear y editar contenido, pero no gestionar usuarios ni configuración.', true),
('44444444-4444-4444-4444-444444444444', 'c943f795-12ec-456a-8f77-4d995e8e183c', 'Visor', 'Solo puede ver contenido. No puede realizar modificaciones.', true),
('55555555-5555-5555-5555-555555555555', 'c943f795-12ec-456a-8f77-4d995e8e183c', 'Cliente', 'Acceso limitado para clientes externos. Solo puede ver información pública.', true)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- DATOS SEMILLA: ASIGNAR TODOS LOS PERMISOS AL ROL SUPERADMIN (SonnativeAI)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', id FROM permissions
ON CONFLICT DO NOTHING;

-- DATOS SEMILLA: ASIGNAR TODOS LOS PERMISOS AL ROL SUPERADMIN (Demo)
INSERT INTO role_permissions (role_id, permission_id)
SELECT '11111111-1111-1111-1111-111111111111', id FROM permissions
ON CONFLICT DO NOTHING;

-- DATOS SEMILLA: ASIGNAR PERMISOS AL ROL ADMINISTRADOR (SonnativeAI)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', id FROM permissions
WHERE name IN (
    'users:create', 'users:read', 'users:update', 'users:delete',
    'roles:create', 'roles:read', 'roles:update', 'roles:delete',
    'plugins:read', 'plugins:configure'
)
ON CONFLICT DO NOTHING;

-- DATOS SEMILLA: ASIGNAR PERMISOS AL ROL ADMINISTRADOR (Demo)
INSERT INTO role_permissions (role_id, permission_id)
SELECT '22222222-2222-2222-2222-222222222222', id FROM permissions
WHERE name IN (
    'users:create', 'users:read', 'users:update', 'users:delete',
    'roles:create', 'roles:read', 'roles:update', 'roles:delete',
    'plugins:read', 'plugins:configure'
)
ON CONFLICT DO NOTHING;

-- DATOS SEMILLA: SUPER USUARIO INICIAL (GestasAI Creator - SonnativeAI)
INSERT INTO users (id, tenant_id, role_id, email, password_hash, full_name, is_super_admin, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'info@gestasai.com',
    '$2a$10$sqfyBxj9TGVsIfdOvzJVNO5WPpNwlCrP9HPbXcQYzLtjXft2Ji6R2',
    'GestasAI',
    true,
    true
)
ON CONFLICT (tenant_id, email) DO NOTHING;

-- INDICES PARA RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_plugins_key ON plugins(key);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_roles_tenant_id ON roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_external_plugins_key ON external_plugins(key);
CREATE INDEX IF NOT EXISTS idx_external_plugins_status ON external_plugins(status);
CREATE INDEX IF NOT EXISTS idx_external_plugins_active ON external_plugins(is_active);
CREATE INDEX IF NOT EXISTS idx_external_plugins_type ON external_plugins(type);
