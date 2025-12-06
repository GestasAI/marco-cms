const fs = require('fs').promises;
const path = require('path');
const lunr = require('lunr');
const crypto = require('crypto');

/**
 * QueryEngine - Motor de búsqueda y consultas para documentos JSON
 * Versión 2.0 - Production Grade
 * 
 * Mejoras implementadas:
 * - File Locking (concurrencia)
 * - Atomic Writes (integridad)
 * - Multi-layer Caching (rendimiento)
 * - Field Projection (optimización)
 * - Aggregations (funcionalidad)
 */
class QueryEngine {
    constructor() {
        this.indexes = new Map(); // Map<entityType, lunrIndex>
        this.dataPath = path.join(__dirname, '../data');

        // Caché Nivel 1: Documentos parseados en memoria
        this.documentCache = new Map(); // Map<entityType, documents[]>
        this.cacheTimestamps = new Map(); // Map<entityType, timestamp>

        // Caché Nivel 2: Resultados de consultas
        this.queryCache = new Map(); // Map<queryHash, result>

        // File Locking: Map de archivos bloqueados
        this.fileLocks = new Map(); // Map<filePath, Promise>
    }

    /**
     * Obtiene la ruta del directorio de una entidad
     */
    getEntityPath(entityType) {
        const plural = entityType.toLowerCase() + 's';
        return path.join(this.dataPath, plural);
    }

    /**
     * Genera un hash único para una consulta (para caché nivel 2)
     */
    generateQueryHash(entityType, method, params) {
        const queryString = JSON.stringify({ entityType, method, params });
        return crypto.createHash('md5').update(queryString).digest('hex');
    }

    /**
     * Adquiere un bloqueo para un archivo
     * Garantiza que solo un proceso puede escribir a la vez
     */
    async acquireLock(filePath) {
        // Si ya hay un bloqueo activo, esperar a que se libere
        while (this.fileLocks.has(filePath)) {
            await this.fileLocks.get(filePath);
        }

        // Crear un nuevo bloqueo
        let releaseLock;
        const lockPromise = new Promise(resolve => {
            releaseLock = resolve;
        });

        this.fileLocks.set(filePath, lockPromise);

        // Retornar función para liberar el bloqueo
        return () => {
            this.fileLocks.delete(filePath);
            releaseLock();
        };
    }

    /**
     * Escritura atómica de un archivo
     * Usa el patrón de renombrar para garantizar atomicidad
     */
    async atomicWrite(filePath, data) {
        const tmpPath = `${filePath}.tmp`;
        const releaseLock = await this.acquireLock(filePath);

        try {
            // 1. Escribir a archivo temporal
            await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');

            // 2. Renombrar (operación atómica)
            await fs.rename(tmpPath, filePath);

            // 3. Invalidar caché
            const entityType = this.getEntityTypeFromPath(filePath);
            this.invalidateCache(entityType);

        } finally {
            // 4. Liberar bloqueo
            releaseLock();
        }
    }

    /**
     * Extrae el tipo de entidad de una ruta de archivo
     */
    getEntityTypeFromPath(filePath) {
        const parts = filePath.split(path.sep);
        const entityFolder = parts[parts.length - 2]; // ej: "posts"
        // Singularizar y capitalizar
        const singular = entityFolder.slice(0, -1); // "post"
        return singular.charAt(0).toUpperCase() + singular.slice(1); // "Post"
    }

    /**
     * Invalida la caché de una entidad
     */
    invalidateCache(entityType) {
        this.documentCache.delete(entityType);
        this.cacheTimestamps.delete(entityType);
        this.indexes.delete(entityType);

        // Invalidar caché de consultas relacionadas
        for (const [hash, cached] of this.queryCache.entries()) {
            if (cached.entityType === entityType) {
                this.queryCache.delete(hash);
            }
        }
    }

    /**
     * Carga todos los documentos de un tipo de entidad
     * Con caché nivel 1 (documentos en memoria)
     */
    async loadAllDocuments(entityType, options = {}) {
        const { fields = null, useCache = true } = options;

        // Verificar caché
        if (useCache && this.documentCache.has(entityType)) {
            let documents = this.documentCache.get(entityType);

            // Aplicar proyección de campos si se especifica
            if (fields) {
                documents = this.projectFields(documents, fields);
            }

            return documents;
        }

        try {
            const entityPath = this.getEntityPath(entityType);
            const files = await fs.readdir(entityPath);

            const documents = [];
            for (const file of files) {
                if (file.endsWith('.json') && !file.endsWith('.tmp')) {
                    const filePath = path.join(entityPath, file);
                    const content = await fs.readFile(filePath, 'utf-8');
                    const doc = JSON.parse(content);
                    documents.push(doc);
                }
            }

            // Guardar en caché
            this.documentCache.set(entityType, documents);
            this.cacheTimestamps.set(entityType, Date.now());

            // Aplicar proyección de campos si se especifica
            if (fields) {
                return this.projectFields(documents, fields);
            }

            return documents;
        } catch (error) {
            console.error(`Error loading documents for ${entityType}:`, error);
            return [];
        }
    }

    /**
     * Proyección de campos (SELECT específico)
     * Reduce el tamaño de los objetos retornados
     */
    projectFields(documents, fields) {
        return documents.map(doc => {
            const projected = {};
            for (const field of fields) {
                if (doc.hasOwnProperty(field)) {
                    projected[field] = doc[field];
                }
            }
            return projected;
        });
    }

    /**
     * Busca documentos en un directorio con filtros opcionales
     * Con soporte para proyección de campos
     */
    async buscar_en_directorio(entityType, filters = {}, options = {}) {
        const { fields = null } = options;

        // Generar hash de consulta para caché nivel 2
        const queryHash = this.generateQueryHash(entityType, 'buscar_en_directorio', { filters, fields });

        // Verificar caché nivel 2
        if (this.queryCache.has(queryHash)) {
            return this.queryCache.get(queryHash).result;
        }

        try {
            let documents = await this.loadAllDocuments(entityType, { fields, useCache: true });

            // Aplicar filtros
            if (Object.keys(filters).length > 0) {
                documents = documents.filter(doc => {
                    return Object.entries(filters).every(([key, value]) => {
                        return doc[key] === value;
                    });
                });
            }

            // Guardar en caché nivel 2
            this.queryCache.set(queryHash, {
                entityType,
                result: documents,
                timestamp: Date.now()
            });

            return documents;
        } catch (error) {
            console.error(`Error in buscar_en_directorio:`, error);
            return [];
        }
    }

    /**
     * Construye un índice Lunr.js para búsqueda full-text
     */
    async buildIndex(entityType) {
        const documents = await this.loadAllDocuments(entityType);

        const idx = lunr(function () {
            this.ref('id');

            if (entityType === 'Post') {
                this.field('title', { boost: 10 });
                this.field('content');
                this.field('excerpt', { boost: 5 });
                this.field('tags');
            } else if (entityType === 'Category') {
                this.field('name', { boost: 10 });
                this.field('description');
            } else if (entityType === 'User') {
                this.field('full_name', { boost: 10 });
                this.field('bio');
                this.field('email');
            }

            documents.forEach(doc => {
                if (doc.tags && Array.isArray(doc.tags)) {
                    doc.tags = doc.tags.join(' ');
                }
                this.add(doc);
            });
        });

        this.indexes.set(entityType, { index: idx, documents });
        return idx;
    }

    /**
     * Búsqueda full-text usando Lunr.js
     */
    async search(entityType, query, options = {}) {
        const { fields = null } = options;

        try {
            if (!this.indexes.has(entityType)) {
                await this.buildIndex(entityType);
            }

            const { index, documents } = this.indexes.get(entityType);
            const results = index.search(query);

            let matchedDocs = results.map(result => {
                return documents.find(doc => doc.id === result.ref);
            }).filter(Boolean);

            // Aplicar proyección de campos
            if (fields) {
                matchedDocs = this.projectFields(matchedDocs, fields);
            }

            return matchedDocs;
        } catch (error) {
            console.error(`Error in search:`, error);
            return [];
        }
    }

    /**
     * Filtrado avanzado con condiciones y operadores lógicos
     */
    async filter(entityType, conditions, options = {}) {
        const { fields = null } = options;

        try {
            let documents = await this.loadAllDocuments(entityType, { fields });

            documents = documents.filter(doc => {
                return this.evaluateConditions(doc, conditions);
            });

            return documents;
        } catch (error) {
            console.error(`Error in filter:`, error);
            return [];
        }
    }

    /**
     * Evalúa condiciones de filtro (soporta $gte, $lte, $ne, $in, $or)
     */
    evaluateConditions(doc, conditions) {
        // Soporte para $or
        if (conditions.$or) {
            return conditions.$or.some(cond => this.evaluateConditions(doc, cond));
        }

        return Object.entries(conditions).every(([key, value]) => {
            // Obtener valor del documento (soporte para campos anidados)
            const docValue = this.getNestedValue(doc, key);

            // Operadores
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                if (value.$gte !== undefined) return docValue >= value.$gte;
                if (value.$lte !== undefined) return docValue <= value.$lte;
                if (value.$ne !== undefined) return docValue !== value.$ne;
                if (value.$in !== undefined) return value.$in.includes(docValue);
            }

            // Comparación simple
            return docValue === value;
        });
    }

    /**
     * Obtiene un valor anidado de un objeto (ej: "meta.views")
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    /**
     * Ordenamiento de resultados
     */
    async sort(results, field, order = 'asc') {
        return results.sort((a, b) => {
            const aVal = this.getNestedValue(a, field);
            const bVal = this.getNestedValue(b, field);

            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    /**
     * Paginación de resultados
     */
    async paginate(results, page = 1, limit = 10) {
        const start = (page - 1) * limit;
        const end = start + limit;

        return {
            data: results.slice(start, end),
            pagination: {
                page,
                limit,
                total: results.length,
                totalPages: Math.ceil(results.length / limit),
                hasNext: end < results.length,
                hasPrev: page > 1
            }
        };
    }

    /**
     * Agregaciones: COUNT
     */
    async count(entityType, filters = {}) {
        const documents = await this.buscar_en_directorio(entityType, filters);
        return documents.length;
    }

    /**
     * Agregaciones: GROUP BY
     */
    async groupBy(entityType, field, filters = {}) {
        const documents = await this.buscar_en_directorio(entityType, filters);

        const groups = {};
        for (const doc of documents) {
            const value = this.getNestedValue(doc, field);
            if (!groups[value]) {
                groups[value] = [];
            }
            groups[value].push(doc);
        }

        return groups;
    }

    /**
     * Obtiene una relación de un documento
     */
    async obtener_relacion(entityType, id, relationType) {
        try {
            const documents = await this.loadAllDocuments(entityType);
            const doc = documents.find(d => d.id === id);

            if (!doc) {
                throw new Error(`Document ${id} not found`);
            }

            const relationField = `${relationType}_id`;
            const relationId = doc[relationField];

            if (!relationId) {
                return null;
            }

            const relatedEntityType = relationType.charAt(0).toUpperCase() + relationType.slice(1);
            const relatedDocs = await this.loadAllDocuments(relatedEntityType);

            return relatedDocs.find(d => d.id === relationId) || null;
        } catch (error) {
            console.error(`Error in obtener_relacion:`, error);
            return null;
        }
    }

    /**
     * CRUD: Create (con escritura atómica)
     */
    async create(entityType, data) {
        const entityPath = this.getEntityPath(entityType);
        const filePath = path.join(entityPath, `${data.id}.json`);

        // Añadir timestamps
        data.created_at = data.created_at || new Date().toISOString();
        data.updated_at = new Date().toISOString();

        await this.atomicWrite(filePath, data);
        return data;
    }

    /**
     * CRUD: Update (con escritura atómica)
     */
    async update(entityType, id, updates) {
        const entityPath = this.getEntityPath(entityType);
        const filePath = path.join(entityPath, `${id}.json`);

        const releaseLock = await this.acquireLock(filePath);

        try {
            // Leer documento actual
            const content = await fs.readFile(filePath, 'utf-8');
            const doc = JSON.parse(content);

            // Aplicar actualizaciones
            const updatedDoc = {
                ...doc,
                ...updates,
                id: doc.id, // No permitir cambiar ID
                created_at: doc.created_at, // No permitir cambiar fecha creación
                updated_at: new Date().toISOString()
            };

            // Escribir atómicamente
            await this.atomicWrite(filePath, updatedDoc);

            return updatedDoc;
        } finally {
            releaseLock();
        }
    }

    /**
     * CRUD: Delete (soft delete)
     */
    async delete(entityType, id, soft = true) {
        if (soft) {
            return await this.update(entityType, id, {
                deleted_at: new Date().toISOString()
            });
        } else {
            // Hard delete
            const entityPath = this.getEntityPath(entityType);
            const filePath = path.join(entityPath, `${id}.json`);

            const releaseLock = await this.acquireLock(filePath);

            try {
                await fs.unlink(filePath);
                this.invalidateCache(entityType);
            } finally {
                releaseLock();
            }
        }
    }

    /**
     * Limpia toda la caché
     */
    clearCache() {
        this.documentCache.clear();
        this.cacheTimestamps.clear();
        this.indexes.clear();
        this.queryCache.clear();
    }

    /**
     * Obtiene estadísticas de caché
     */
    getCacheStats() {
        return {
            documentCache: {
                size: this.documentCache.size,
                entities: Array.from(this.documentCache.keys())
            },
            queryCache: {
                size: this.queryCache.size
            },
            indexes: {
                size: this.indexes.size,
                entities: Array.from(this.indexes.keys())
            }
        };
    }
}

module.exports = new QueryEngine();
