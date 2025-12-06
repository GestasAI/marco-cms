# GestasCore-ACIDE - Plugin Maestro

**Versión**: 1.0.0  
**Tipo**: SYSTEM  
**Puerto**: 5000  
**Estado**: En Desarrollo

---

## 📖 Introducción

**GestasCore-ACIDE** (Abstraction, Configuration, Intelligence, Data, Evolution) es el **plugin maestro** del ecosistema GestasAI. Todos los demás plugins heredan sus funciones, esquemas y configuraciones.

### ¿Qué Problema Resuelve?

En sistemas tradicionales como WordPress:
- Cada plugin crea sus propias tablas en la base de datos
- No hay estandarización de funciones
- Las actualizaciones son manuales y propensas a errores
- Los certificados SSL son por sitio
- No hay sincronización automática

**GestasCore-ACIDE** soluciona esto proporcionando:
✅ **Funciones compartidas** que se actualizan automáticamente  
✅ **Esquemas de datos** que garantizan consistencia  
✅ **Certificados maestros** con rotación automática  
✅ **Almacenamiento basado en documentos** (JSON/YAML)  
✅ **Sincronización automática** entre todos los plugins  

---

## 🏗️ Arquitectura de Tres Capas

```
┌─────────────────────────────────────────────────────────────┐
│  CAPA 1: DEFINICIÓN (Archivos Estáticos)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ schemas/                                             │   │
│  │ ├── core/                                            │   │
│  │ │   ├── post.json      (Contrato de Post)           │   │
│  │ │   ├── category.json  (Contrato de Category)       │   │
│  │ │   └── user.json      (Contrato de User)           │   │
│  │ └── plugins/                                         │   │
│  │     └── {plugin-name}/custom.json                   │   │
│  │                                                       │   │
│  │ config/                                              │   │
│  │ ├── framework.yaml    (Config del framework)        │   │
│  │ └── security.yaml     (Certificados y claves)       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CAPA 2: ABSTRACCIÓN (GestasAiFramework)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ functions/                                           │   │
│  │ ├── SchemaValidator.js                              │   │
│  │ │   → validate(entityType, data)                    │   │
│  │ │   → save(entityType, data)                        │   │
│  │ │                                                    │   │
│  │ ├── QueryEngine.js                                  │   │
│  │ │   → buscar_en_directorio(entityType, filters)     │   │
│  │ │   → obtener_relacion(entityType, id, relation)    │   │
│  │ │                                                    │   │
│  │ ├── ConfigLoader.js                                 │   │
│  │ │   → get(pluginKey, setting)                       │   │
│  │ │   → loadPluginConfig(pluginKey)                   │   │
│  │ │                                                    │   │
│  │ ├── CertificateManager.js                           │   │
│  │ │   → generateMasterCertificate()                   │   │
│  │ │   → distributeCertificate(cert)                   │   │
│  │ │   → setupAutoRotation()                           │   │
│  │ │                                                    │   │
│  │ ├── BackupManager.js                                │   │
│  │ │   → createMonthlyBackup()                         │   │
│  │ │   → setupAutoBackup()                             │   │
│  │ │                                                    │   │
│  │ └── PluginSync.js                                   │   │
│  │     → syncFunctionsToPlugins()                      │   │
│  │     → updatePluginCore(pluginKey)                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CAPA 3: ALMACENAMIENTO                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PostgreSQL (Solo datos ACID críticos)               │   │
│  │ - Autenticación                                      │   │
│  │ - Usuarios y Tenants                                 │   │
│  │ - Facturación                                        │   │
│  │                                                       │   │
│  │ Documentos JSON (Todo lo demás)                      │   │
│  │ /data/posts/uuid-123.json                            │   │
│  │ /data/categories/uuid-456.json                       │   │
│  │ /data/configs/plugin-content.yaml                    │   │
│  │                                                       │   │
│  │ Filesystem                                            │   │
│  │ /media/images/                                        │   │
│  │ /backups/gestasai-2025-11-23.zip                     │   │
│  │ /certs/master.pem                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Componentes Principales

### 1. SchemaValidator

**Propósito**: Validar datos contra esquemas JSON antes de guardarlos.

**Ejemplo de Uso**:
```javascript
const { SchemaValidator } = require('gestas-core/functions');

// Validar un post
const postData = {
  id: 'uuid-123',
  title: 'Mi primer post',
  content: 'Contenido del post...',
  author_id: 'user-456'
};

const validation = SchemaValidator.validate('Post', postData);
if (validation.valid) {
  await SchemaValidator.save('Post', postData);
} else {
  console.error('Validation errors:', validation.errors);
}
```

**Esquema de Ejemplo** (`schemas/core/post.json`):
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "title", "content", "author_id"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "minLength": 1, "maxLength": 255" },
    "content": { "type": "string" },
    "author_id": { "type": "string", "format": "uuid" },
    "status": { "enum": ["draft", "published", "archived"] }
  }
}
```

---

### 2. QueryEngine

**Propósito**: Buscar y filtrar documentos JSON sin SQL.

**Ejemplo de Uso**:
```javascript
const { QueryEngine } = require('gestas-core/functions');

// Buscar posts publicados
const posts = await QueryEngine.buscar_en_directorio('Post', {
  status: 'published',
  author_id: 'user-456'
});

// Obtener relación (autor del post)
const author = await QueryEngine.obtener_relacion('Post', 'uuid-123', 'author');
```

---

### 3. ConfigLoader

**Propósito**: Cargar configuraciones desde archivos YAML con caché.

**Ejemplo de Uso**:
```javascript
const { ConfigLoader } = require('gestas-core/functions');

// Obtener configuración de un plugin
const color = ConfigLoader.get('plugin-content', 'theme_color');
const maxPosts = ConfigLoader.get('plugin-content', 'max_posts_per_page');
```

**Archivo de Config** (`config/plugins/plugin-content.yaml`):
```yaml
theme_color: "#3B82F6"
max_posts_per_page: 20
enable_comments: true
```

---

### 4. CertificateManager

**Propósito**: Gestionar certificados SSL compartidos con rotación automática.

**Ejemplo de Uso**:
```javascript
const { CertificateManager } = require('gestas-core/functions');

// Generar y distribuir certificado maestro
await CertificateManager.generateMasterCertificate();

// Configurar rotación automática cada 90 días
CertificateManager.setupAutoRotation();
```

**Flujo de Rotación**:
```
1. CertificateManager genera nuevo certificado
   ↓
2. Publica en Redis: SYSTEM:CERTIFICATE_UPDATE
   ↓
3. Todos los plugins escuchan y actualizan su certificado local
   ↓
4. Cada plugin confirma la actualización
   ↓
5. Core verifica que todos estén sincronizados
```

---

### 5. BackupManager

**Propósito**: Crear backups automáticos mensuales de documentos.

**Ejemplo de Uso**:
```javascript
const { BackupManager } = require('gestas-core/functions');

// Crear backup manual
await BackupManager.createMonthlyBackup();

// Configurar backup automático (primer día de cada mes)
BackupManager.setupAutoBackup();
```

**Contenido del Backup**:
```
gestasai-2025-11-23.zip
├── data/
│   ├── posts/
│   ├── categories/
│   └── configs/
├── gestas-core/
│   ├── schemas/
│   └── config/
└── manifest.json
```

---

### 6. PluginSync

**Propósito**: Sincronizar funciones del core a todos los plugins automáticamente.

**Ejemplo de Uso**:
```javascript
const { PluginSync } = require('gestas-core/functions');

// Sincronizar todos los plugins
await PluginSync.syncFunctionsToPlugins();

// Actualizar un plugin específico
await PluginSync.updatePluginCore('plugin-content');
```

**Flujo de Sincronización**:
```
1. PluginSync detecta nueva versión del core
   ↓
2. Compara versión local de cada plugin
   ↓
3. Si hay diferencia, copia funciones actualizadas
   ↓
4. Publica en Redis: SYSTEM:CORE_UPDATED
   ↓
5. Plugin reinicia y carga nuevas funciones
```

---

## 📊 Comparación con WordPress

| Aspecto | WordPress | GestasCore-ACIDE |
|---------|-----------|------------------|
| **Almacenamiento** | MySQL (tablas por plugin) | Documentos JSON (directorio por entidad) |
| **Actualizaciones** | Manual por plugin | Automática desde el core maestro |
| **Seguridad** | Certificados por sitio | Certificado maestro compartido |
| **Portabilidad** | Requiere exportar BD | Copiar directorio de documentos |
| **Rendimiento** | Consultas SQL | Lectura de archivos (+ caché) |
| **Escalabilidad** | Vertical (BD más grande) | Horizontal (más nodos) |
| **Validación** | Manual en cada plugin | Automática mediante esquemas |
| **Backups** | Plugins de terceros | Sistema integrado automático |

---

## ✅ Ventajas del Sistema

| Ventaja | Descripción |
|---------|-------------|
| **Portabilidad Extrema** | Los plugins son auto-contenidos con sus documentos JSON |
| **Rendimiento Superior** | No hay llamadas a BD para datos no críticos |
| **Escalabilidad Horizontal** | Fácil replicación y distribución |
| **Mantenibilidad** | Actualización centralizada de funciones |
| **Seguridad Mejorada** | Certificados compartidos con rotación automática |
| **Flexibilidad** | Esquemas modificables sin migraciones de BD |
| **IA-Friendly** | Documentos JSON accesibles para análisis y aprendizaje |
| **Backups Automáticos** | Sistema de respaldo mensual integrado |
| **Consistencia** | Todos los plugins usan las mismas funciones |
| **Versionado** | Control de versiones del core |

---

## 🚀 Cómo Usar GestasCore en un Plugin

### 1. Incluir el Core en el Plugin

```
packages/mi-plugin/
├── gestas-core/              # ← Copia del core
│   ├── functions/
│   ├── schemas/
│   └── version.json
├── src/
│   ├── bootstrap/
│   │   └── gestas-core.js   # ← Inicializa el core
│   └── index.js
```

### 2. Inicializar el Core

```javascript
// src/bootstrap/gestas-core.js
const { SchemaValidator, QueryEngine, ConfigLoader } = require('../../gestas-core/functions');

class GestasCoreBootstrap {
    static async init() {
        // Verificar versión del core
        const localVersion = this.getLocalCoreVersion();
        const masterVersion = await this.getMasterCoreVersion();
        
        if (localVersion !== masterVersion) {
            console.log(`⚠️ Core version mismatch. Updating...`);
            await this.updateCore();
        }
        
        // Cargar certificado maestro
        await this.loadMasterCertificate();
        
        console.log('✅ GestasCore initialized');
    }
}

module.exports = GestasCoreBootstrap;
```

### 3. Usar las Funciones del Core

```javascript
// src/controllers/PostController.js
const { SchemaValidator, QueryEngine } = require('../../gestas-core/functions');

class PostController {
    static async create(req, res) {
        try {
            // Validar datos
            const validation = SchemaValidator.validate('Post', req.body);
            if (!validation.valid) {
                return res.status(400).json({ errors: validation.errors });
            }
            
            // Guardar post
            const post = await SchemaValidator.save('Post', req.body);
            
            res.json({ success: true, data: post });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async list(req, res) {
        try {
            // Buscar posts
            const posts = await QueryEngine.buscar_en_directorio('Post', {
                status: 'published'
            });
            
            res.json({ success: true, data: posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PostController;
```

---

## 🔐 Seguridad

### Certificados Compartidos

Todos los plugins comparten el mismo certificado SSL maestro, que se rota automáticamente cada 90 días.

**Configuración** (`config/security.yaml`):
```yaml
master_certificate:
  rotation_days: 90
  algorithm: RSA
  key_size: 4096
  
shared_secrets:
  jwt_secret: ${MASTER_JWT_SECRET}
  encryption_key: ${MASTER_ENCRYPTION_KEY}
  
auto_rotation:
  enabled: true
  notify_before_days: 7
```

### Validación Centralizada

Toda la validación de datos se hace mediante esquemas JSON, lo que previene:
- Inyección SQL (no hay SQL directo)
- Datos malformados
- Inconsistencias entre plugins

---

## 📦 Estructura de Documentos

### Ejemplo: Post Document

**Archivo**: `/data/posts/uuid-123.json`
```json
{
  "id": "uuid-123",
  "title": "Mi primer post",
  "content": "Contenido del post...",
  "author_id": "user-456",
  "category_id": "cat-789",
  "status": "published",
  "created_at": "2025-11-23T00:00:00Z",
  "updated_at": "2025-11-23T00:00:00Z",
  "meta": {
    "views": 100,
    "likes": 25
  }
}
```

### Ejemplo: Category Document

**Archivo**: `/data/categories/cat-789.json`
```json
{
  "id": "cat-789",
  "name": "Tecnología",
  "slug": "tecnologia",
  "description": "Artículos sobre tecnología",
  "parent_id": null,
  "created_at": "2025-11-23T00:00:00Z"
}
```

---

## 🔄 Flujo de Actualización Automática

```
1. Desarrollador actualiza función en GestasCore
   ↓
2. Incrementa versión del core (ej. 1.0.0 → 1.0.1)
   ↓
3. PluginSync detecta nueva versión
   ↓
4. Copia funciones actualizadas a todos los plugins
   ↓
5. Publica SYSTEM:CORE_UPDATED en Redis
   ↓
6. Cada plugin recibe notificación y reinicia
   ↓
7. Plugins cargan nuevas funciones automáticamente
```

---

## 📝 Próximos Pasos

1. **Implementar SchemaValidator** (Semana 1)
2. **Implementar QueryEngine** (Semana 2)
3. **Implementar ConfigLoader** (Semana 2)
4. **Implementar CertificateManager** (Semana 3)
5. **Implementar BackupManager** (Semana 3)
6. **Implementar PluginSync** (Semana 4)
7. **Actualizar plugin-seed** (Semana 5)
8. **Migrar plugins existentes** (Semana 5)

---

**Última actualización**: 23 de Noviembre de 2025
