# 📝 Formato de Respuestas de la IA

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025  
**Audiencia**: Sistema de IA

---

## 🎯 Estructura de Respuesta

Cuando generes código, usa este formato:

```json
{
  "files": [
    {
      "path": "src/controllers/ProductController.js",
      "content": "const ProductService = require('../services/ProductService');\n\nconst ProductController = {\n  async create(req, res) {\n    // ...\n  }\n};\n\nmodule.exports = ProductController;",
      "type": "controller",
      "description": "Controller para gestión de productos con CRUD completo"
    },
    {
      "path": "src/services/ProductService.js",
      "content": "...",
      "type": "service",
      "description": "Servicio con lógica de negocio de productos"
    }
  ],
  "instructions": [
    "1. Crear los archivos en las rutas especificadas",
    "2. Agregar las rutas en src/index.js",
    "3. Ejecutar npm install si hay nuevas dependencias"
  ],
  "dependencies": [
    {
      "name": "slugify",
      "version": "^1.6.6",
      "reason": "Para generar slugs de productos"
    }
  ],
  "database_changes": [
    {
      "type": "create_table",
      "sql": "CREATE TABLE products (...)",
      "description": "Tabla para almacenar productos"
    }
  ]
}
```

---

## 📄 Formato de Archivos

### Controller
```javascript
/**
 * Controller para gestión de [Entidad]
 * Maneja las peticiones HTTP y delega la lógica al Service
 */
const [Entity]Service = require('../services/[Entity]Service');

const [Entity]Controller = {
  /**
   * Crea un nuevo [entity]
   */
  async create(req, res) {
    try {
      const [entity] = await [Entity]Service.create[Entity](req.body, req.tenantId);
      res.status(201).json([entity]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Obtiene todos los [entities]
   */
  async getAll(req, res) {
    const [entities] = await [Entity]Service.getAll[Entities](req.tenantId);
    res.json([entities]);
  }
};

module.exports = [Entity]Controller;
```

### Service
```javascript
/**
 * Servicio para lógica de negocio de [Entidad]
 */
const db = require('../db');

const [Entity]Service = {
  /**
   * Crea un nuevo [entity]
   * @param {Object} data - Datos del [entity]
   * @param {string} tenantId - ID del tenant
   * @returns {Promise<Object>} [Entity] creado
   */
  async create[Entity](data, tenantId) {
    // Validar
    if (!data.name) {
      throw new Error('Name is required');
    }

    // Crear
    const result = await db.query(
      'INSERT INTO [entities] (tenant_id, name) VALUES ($1, $2) RETURNING *',
      [tenantId, data.name]
    );

    return result.rows[0];
  }
};

module.exports = [Entity]Service;
```

---

## 💬 Formato de Explicaciones

Cuando expliques código, usa este formato:

```markdown
## Código Generado

He creado los siguientes archivos:

### 1. ProductController.js
Este controller maneja las peticiones HTTP para productos. Incluye:
- `create`: Crea un nuevo producto
- `getAll`: Lista todos los productos del tenant
- `update`: Actualiza un producto existente

### 2. ProductService.js
Este servicio contiene la lógica de negocio:
- Validación de datos
- Interacción con la base de datos
- Manejo de errores

## Próximos Pasos

1. Agregar las rutas en `src/index.js`
2. Probar los endpoints con Postman
3. Crear el widget del frontend
```

---

## 🔍 Formato de Análisis

Cuando analices código, usa este formato:

```markdown
## Análisis del Código

### ✅ Aspectos Positivos
- Usa queries parametrizadas
- Incluye tenantId en todas las queries
- Maneja errores apropiadamente

### ⚠️ Aspectos a Mejorar
- El controller tiene lógica de negocio (debería estar en service)
- Falta validación de inputs
- No hay manejo de errores en algunas funciones

### 🔧 Sugerencias
1. Mover validación a ValidationService
2. Agregar try/catch en todas las funciones async
3. Usar constantes para mensajes de error
```

---

**Última actualización**: 22 de Noviembre de 2025
