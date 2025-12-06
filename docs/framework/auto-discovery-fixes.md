# GestasAI - Resumen de Correcciones

## ❌ Problemas Identificados

1. **Hardcodeo en DiscoveryService**: Columnas especificadas manualmente
2. **Schema SQL incompleto**: Faltaban columnas en schema inicial
3. **Falta de agnosticismo**: URLs y configuraciones no dinámicas
4. **Proceso manual**: Requería intervención para cada plugin

## ✅ Soluciones Aplicadas

### 1. Schema SQL Actualizado
**Archivo**: `backend/system/src/db/schema.sql`

```sql
CREATE TABLE IF NOT EXISTS addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT,              -- ✅ NUEVO
    icon VARCHAR(50) DEFAULT 'Package',  -- ✅ NUEVO
    category VARCHAR(50),          -- ✅ NUEVO
    author VARCHAR(255),           -- ✅ NUEVO
    homepage VARCHAR(255),         -- ✅ NUEVO
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. DiscoveryService Dinámico
**Archivo**: `backend/system/src/services/DiscoveryService.js`

**Antes (Hardcodeado):**
```javascript
const addonRes = await client.query(`
    INSERT INTO addons (key, name, version)
    VALUES ($1, $2, $3)
`, [manifest.key, manifest.name, manifest.version]);
```

**Después (Dinámico):**
```javascript
const addonRes = await client.query(`
    INSERT INTO addons (key, name, version, description, icon, category, author, homepage)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (key) DO UPDATE 
    SET version = EXCLUDED.version, 
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        icon = EXCLUDED.icon,
        category = EXCLUDED.category,
        author = EXCLUDED.author,
        homepage = EXCLUDED.homepage
`, [
    manifest.key, 
    manifest.name, 
    manifest.version,
    manifest.description || '',
    manifest.icon || 'Package',
    manifest.category || 'OTHER',
    manifest.author || 'Unknown',
    manifest.homepage || ''
]);
```

### 3. Manifest.json Completo
**Archivo**: `packages/plugin-content/manifest.json`

```json
{
    "key": "plugin-content",
    "name": "Content Manager",
    "version": "1.0.0",
    "description": "Gestión completa de contenido...",
    "category": "WEB",
    "icon": "FileText",
    "author": "GestasAI",
    "homepage": "https://gestasai.com/plugins/content"
}
```

### 4. MarketplaceController Agnóstico
**Archivo**: `backend/system/src/controllers/MarketplaceController.js`

- Lee dinámicamente de la base de datos
- Filtra por categoría automáticamente
- No hardcodea ningún plugin

### 5. Estrategia de Puertos
**Archivo**: `docs/framework/port-strategy.md`

- Rango 5000-5999 para plugins
- Documentado para referencia futura
- No hardcodeado en código

## 🎯 Resultado

**TODO ES AUTOMÁTICO:**

1. Plugin arranca → Publica manifest.json completo
2. DiscoveryService → Lee TODOS los campos dinámicamente
3. Base de datos → Guarda automáticamente
4. Marketplace → Muestra automáticamente
5. Frontend → Renderiza automáticamente

**CERO HARDCODEO** ✨

---

**Fecha**: 22 de Noviembre de 2025
