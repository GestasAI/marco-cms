/**
 * MARCO CMS - Backend Server
 * Servidor Node.js con ACIDE Engine embebido
 * 
 * Almacena datos en archivos JSON (como ACIDE)
 * Persistente y accesible desde cualquier dispositivo
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Directorio de datos (persistente)
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(express.json());

// Asegurar que existe el directorio de datos
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }

    // Crear subdirectorios para cada colección
    const collections = [
        'posts',
        'pages',
        'categories',
        'tags',
        'products',
        'product_categories',
        'theme_settings',
        'site_config',
        'users',
        'media',
        'academy_courses',
        'academy_lessons',
        'academy_progress'
    ];

    for (const collection of collections) {
        const collectionDir = path.join(DATA_DIR, collection);
        try {
            await fs.access(collectionDir);
        } catch {
            await fs.mkdir(collectionDir, { recursive: true });
        }
    }
}

/**
 * Generar ID único
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Leer todos los documentos de una colección
 */
async function readCollection(collection) {
    const collectionDir = path.join(DATA_DIR, collection);
    const files = await fs.readdir(collectionDir);
    const documents = [];

    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(collectionDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            documents.push(JSON.parse(content));
        }
    }

    return documents;
}

/**
 * Guardar documento
 */
async function saveDocument(collection, document) {
    const filePath = path.join(DATA_DIR, collection, `${document.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(document, null, 2), 'utf-8');
    return document;
}

/**
 * Eliminar documento
 */
async function deleteDocument(collection, id) {
    const filePath = path.join(DATA_DIR, collection, `${id}.json`);
    await fs.unlink(filePath);
}

/**
 * Filtrar documentos
 */
function filterDocuments(documents, where) {
    return documents.filter(doc => {
        return Object.entries(where).every(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                // Operadores
                if (value.$eq !== undefined) return doc[key] === value.$eq;
                if (value.$ne !== undefined) return doc[key] !== value.$ne;
                if (value.$gt !== undefined) return doc[key] > value.$gt;
                if (value.$gte !== undefined) return doc[key] >= value.$gte;
                if (value.$lt !== undefined) return doc[key] < value.$lt;
                if (value.$lte !== undefined) return doc[key] <= value.$lte;
                if (value.$in !== undefined) return value.$in.includes(doc[key]);
                if (value.$contains !== undefined) return doc[key]?.includes(value.$contains);
            }
            return doc[key] === value;
        });
    });
}

/**
 * Aplicar opciones (sort, limit, select)
 */
function applyOptions(documents, options) {
    let results = [...documents];

    // Ordenar
    if (options.sort) {
        const [field, order] = Object.entries(options.sort)[0];
        results.sort((a, b) => {
            if (order === 'asc') return a[field] > b[field] ? 1 : -1;
            return a[field] < b[field] ? 1 : -1;
        });
    }

    // Limitar
    if (options.limit) {
        results = results.slice(0, options.limit);
    }

    // Proyección
    if (options.select) {
        results = results.map(doc => {
            const projected = {};
            options.select.forEach(field => {
                projected[field] = doc[field];
            });
            return projected;
        });
    }

    return results;
}

// ============================================
// RUTAS API
// ============================================

/**
 * CREATE - Crear documento
 */
app.post('/acide/create', async (req, res) => {
    try {
        const { collection, data } = req.body;

        // Generar ID si no existe
        if (!data.id) {
            data.id = generateId();
        }

        // Agregar timestamps
        data.createdAt = new Date().toISOString();
        data.updatedAt = new Date().toISOString();

        // Guardar
        const document = await saveDocument(collection, data);

        res.json({ success: true, document });
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * QUERY - Consultar documentos
 */
app.post('/acide/query', async (req, res) => {
    try {
        const { collection, where = {}, options = {} } = req.body;

        // Leer colección
        let documents = await readCollection(collection);

        // Filtrar
        documents = filterDocuments(documents, where);

        // Aplicar opciones
        documents = applyOptions(documents, options);

        res.json({ success: true, documents });
    } catch (error) {
        console.error('Error querying documents:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * FIND BY ID - Obtener por ID
 */
app.get('/acide/:collection/:id', async (req, res) => {
    try {
        const { collection, id } = req.params;
        const filePath = path.join(DATA_DIR, collection, `${id}.json`);

        const content = await fs.readFile(filePath, 'utf-8');
        const document = JSON.parse(content);

        res.json({ success: true, document });
    } catch (error) {
        console.error('Error finding document:', error);
        res.status(404).json({ error: 'Document not found' });
    }
});

/**
 * UPDATE - Actualizar documento
 */
app.put('/acide/update', async (req, res) => {
    try {
        const { collection, id, updates } = req.body;
        const filePath = path.join(DATA_DIR, collection, `${id}.json`);

        // Leer documento actual
        const content = await fs.readFile(filePath, 'utf-8');
        const document = JSON.parse(content);

        // Actualizar
        const updated = {
            ...document,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        // Guardar
        await saveDocument(collection, updated);

        res.json({ success: true, document: updated });
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE - Eliminar documento
 */
app.delete('/acide/:collection/:id', async (req, res) => {
    try {
        const { collection, id } = req.params;
        await deleteDocument(collection, id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * COUNT - Contar documentos
 */
app.post('/acide/count', async (req, res) => {
    try {
        const { collection, where = {} } = req.body;

        let documents = await readCollection(collection);
        documents = filterDocuments(documents, where);

        res.json({ success: true, count: documents.length });
    } catch (error) {
        console.error('Error counting documents:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * SEARCH - Búsqueda de texto
 */
app.post('/acide/search', async (req, res) => {
    try {
        const { collection, searchTerm, fields = [] } = req.body;
        const term = searchTerm.toLowerCase();

        let documents = await readCollection(collection);

        documents = documents.filter(doc => {
            return fields.some(field => {
                const value = doc[field];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(term);
                }
                return false;
            });
        });

        res.json({ success: true, documents });
    } catch (error) {
        console.error('Error searching documents:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * EXPORT - Exportar todos los datos
 */
app.get('/acide/export', async (req, res) => {
    try {
        const collections = await fs.readdir(DATA_DIR);
        const data = {};

        for (const collection of collections) {
            const stat = await fs.stat(path.join(DATA_DIR, collection));
            if (stat.isDirectory()) {
                data[collection] = await readCollection(collection);
            }
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * IMPORT - Importar datos
 */
app.post('/acide/import', async (req, res) => {
    try {
        const { data } = req.body;

        for (const [collection, documents] of Object.entries(data)) {
            for (const document of documents) {
                await saveDocument(collection, document);
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * HEALTH CHECK
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        service: 'Marco CMS - ACIDE Backend',
        version: '1.0.0'
    });
});

// Iniciar servidor
async function start() {
    await ensureDataDir();

    app.listen(PORT, () => {
        console.log(`🚀 Marco CMS - ACIDE Backend running on port ${PORT}`);
        console.log(`📁 Data directory: ${DATA_DIR}`);
        console.log(`✅ Ready to accept requests`);
    });
}

start().catch(console.error);
