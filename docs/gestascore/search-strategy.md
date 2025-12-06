# GestasCore-ACIDE - Estrategia de Búsqueda e Indexación

**Versión**: 1.0.0  
**Fecha**: 23 de Noviembre de 2025

---

## 🎯 Objetivo

Proporcionar búsqueda rápida y eficiente en documentos JSON sin comprometer el rendimiento ni requerir infraestructura pesada.

---

## 🏗️ Arquitectura Híbrida de Búsqueda

### Nivel 1: Búsqueda Local (Lunr.js) - PREDETERMINADO

**Qué es**: Motor de búsqueda en JavaScript que funciona en memoria.

**Ventajas**:
- ✅ Sin servidor adicional (0 costos extra)
- ✅ Muy rápido para datasets pequeños/medianos (<10,000 docs)
- ✅ Funciona offline
- ✅ Solo 8KB de tamaño
- ✅ Búsqueda full-text con stemming y relevancia

**Cuándo usar**:
- Búsquedas dentro de un solo plugin
- Datasets < 10,000 documentos
- Clientes pequeños/medianos
- Búsquedas simples (título, contenido, tags)

**Implementación**:
```javascript
const lunr = require('lunr');

// Crear índice
const idx = lunr(function () {
  this.ref('id');
  this.field('title', { boost: 10 });
  this.field('content');
  this.field('tags');

  documents.forEach(doc => this.add(doc));
});

// Buscar
const results = idx.search('javascript tutorial');
```

---

### Nivel 2: Búsqueda Compartida (Elasticsearch) - OPCIONAL

**Qué es**: Motor de búsqueda distribuido para grandes volúmenes.

**Ventajas**:
- ✅ Escalable a millones de documentos
- ✅ Búsquedas complejas (agregaciones, facetas, geo)
- ✅ Búsqueda cross-plugin
- ✅ Análisis y métricas avanzadas

**Cuándo usar**:
- Clientes enterprise (>100,000 documentos)
- Búsquedas cross-plugin
- Análisis de datos complejos
- Necesidad de agregaciones

**Implementación**:
```javascript
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://elasticsearch:9200' });

// Indexar
await client.index({
  index: 'posts',
  id: doc.id,
  body: doc
});

// Buscar
const { body } = await client.search({
  index: 'posts',
  body: {
    query: {
      multi_match: {
        query: 'javascript tutorial',
        fields: ['title^3', 'content']
      }
    }
  }
});
```

---

## 📊 Comparación

| Aspecto | Lunr.js | Elasticsearch |
|---------|---------|---------------|
| **Infraestructura** | Ninguna | Servidor dedicado |
| **Costo** | $0 | $50-500/mes |
| **Rendimiento** | Excelente (<10K docs) | Excelente (millones) |
| **Complejidad** | Baja | Media-Alta |
| **Búsqueda cross-plugin** | No | Sí |
| **Análisis avanzado** | No | Sí |
| **Tiempo de setup** | 5 minutos | 1-2 horas |

---

## 🎨 Estrategia Recomendada: Híbrida Inteligente

### Fase 1: Solo Lunr.js (Ahora - 6 meses)

**Implementación**:
1. Cada plugin tiene su propio índice Lunr.js
2. QueryEngine usa Lunr.js para búsquedas
3. Índice se reconstruye al iniciar el plugin
4. Índice se actualiza al crear/editar/eliminar documentos

**Código en QueryEngine**:
```javascript
class QueryEngine {
    constructor() {
        this.indexes = new Map(); // Map<entityType, lunrIndex>
    }

    async buildIndex(entityType) {
        const docs = await this.loadAllDocuments(entityType);
        
        const idx = lunr(function () {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('content');
            this.field('tags');
            
            docs.forEach(doc => this.add(doc));
        });
        
        this.indexes.set(entityType, idx);
    }

    async search(entityType, query) {
        if (!this.indexes.has(entityType)) {
            await this.buildIndex(entityType);
        }
        
        const idx = this.indexes.get(entityType);
        const results = idx.search(query);
        
        // Cargar documentos completos
        return Promise.all(
            results.map(r => this.loadDocument(entityType, r.ref))
        );
    }
}
```

### Fase 2: Elasticsearch Opcional (6-12 meses)

**Cuándo activar**:
- Cliente tiene >10,000 documentos
- Cliente paga plan Enterprise
- Cliente necesita búsqueda cross-plugin

**Configuración**:
```yaml
# config/framework.yaml
search:
  engine: "lunr" # lunr | elasticsearch
  elasticsearch:
    enabled: false
    node: "http://elasticsearch:9200"
    index_prefix: "gestas_"
```

**Código adaptativo**:
```javascript
class QueryEngine {
    async search(entityType, query) {
        const config = ConfigLoader.get('gestascore', 'search');
        
        if (config.engine === 'elasticsearch' && config.elasticsearch.enabled) {
            return this.searchElasticsearch(entityType, query);
        } else {
            return this.searchLunr(entityType, query);
        }
    }
}
```

---

## 🚀 Plan de Implementación

### Semana 1: Lunr.js Básico
- [ ] Añadir Lunr.js a package.json
- [ ] Implementar buildIndex() en QueryEngine
- [ ] Implementar search() básico
- [ ] Tests con 100 documentos

### Semana 2: Optimización
- [ ] Índice persistente (guardar en disco)
- [ ] Actualización incremental del índice
- [ ] Búsqueda con filtros
- [ ] Tests con 10,000 documentos

### Semana 3: Búsqueda Avanzada
- [ ] Búsqueda por campos específicos
- [ ] Búsqueda con wildcards
- [ ] Búsqueda fuzzy (tolerancia a errores)
- [ ] Ordenamiento por relevancia

### Futuro: Elasticsearch (Opcional)
- [ ] Contenedor Docker de Elasticsearch
- [ ] Adaptador de Elasticsearch en QueryEngine
- [ ] Migración automática de índices
- [ ] Dashboard de métricas

---

## 📦 Dependencias

### Lunr.js (Requerido)
```json
{
  "dependencies": {
    "lunr": "^2.3.9"
  }
}
```

### Elasticsearch (Opcional)
```json
{
  "dependencies": {
    "@elastic/elasticsearch": "^8.11.0"
  }
}
```

---

## 🎯 Decisión Final

**Para GestasAI, recomiendo**:
1. **Empezar con Lunr.js** (simple, rápido, sin costos)
2. **Monitorear rendimiento** (si búsquedas >500ms, considerar Elasticsearch)
3. **Ofrecer Elasticsearch como upgrade** (plan Enterprise)

**Ventajas de este enfoque**:
- ✅ 80% de clientes felices con Lunr.js
- ✅ 20% que necesita más puede pagar por Elasticsearch
- ✅ Sistema escalable sin complejidad inicial
- ✅ Costos controlados

---

**Última actualización**: 23 de Noviembre de 2025
