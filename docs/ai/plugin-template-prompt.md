# Plantilla de Prompt para IA - Creación de Plugins GestasAI

**Versión**: 1.0.0  
**Fecha**: 23 de Noviembre de 2025

---

## 🎯 Prompt Base para Crear un Nuevo Plugin

```
Crea un nuevo plugin para GestasAI con las siguientes características:

NOMBRE DEL PLUGIN: [nombre-del-plugin]
DESCRIPCIÓN: [descripción breve]
CATEGORÍA: [WEB|SYSTEM|INTEGRATION|AI|OTHER]
PUERTO: [5XXX - siguiente disponible]

ESTRUCTURA REQUERIDA:
1. Copiar estructura de packages/plugin-gestascore-acide/
2. Actualizar manifest.json con:
   - key: "plugin-[nombre]"
   - name: "[Nombre Legible]"
   - port: [puerto asignado]
   - category: [categoría]
   - capabilities: [lista de capacidades]
   - ui.menu.path: "/[ruta]"

3. Crear esquemas JSON en schemas/core/ para cada entidad:
   - Definir campos requeridos
   - Definir validaciones
   - Definir relaciones

4. Implementar funciones usando GestasCore:
   - SchemaValidator para validación
   - QueryEngine para búsquedas
   - ConfigLoader para configuración

5. Crear controladores en src/controllers/:
   - CRUD completo para cada entidad
   - Usar SchemaValidator.validate() antes de guardar
   - Usar SchemaValidator.save() para persistir
   - Usar QueryEngine.search() para búsquedas

6. Crear rutas en src/routes/:
   - GET /api/[entidad]s - Listar
   - GET /api/[entidad]s/:id - Obtener uno
   - POST /api/[entidad]s - Crear
   - PUT /api/[entidad]s/:id - Actualizar
   - DELETE /api/[entidad]s/:id - Eliminar (soft delete)

7. Actualizar docker-compose.yml:
   - Añadir servicio del plugin
   - Configurar puerto
   - Configurar volúmenes

VALIDACIONES:
- Todos los datos deben validarse contra esquemas JSON
- Usar soft delete (campo deleted_at en lugar de eliminar)
- Implementar búsqueda con Lunr.js
- Registrar plugin automáticamente al iniciar

EJEMPLO DE ESQUEMA JSON:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string", "minLength": 1 },
    "created_at": { "type": "string", "format": "date-time" },
    "updated_at": { "type": "string", "format": "date-time" },
    "deleted_at": { "type": ["string", "null"], "format": "date-time" }
  }
}

EJEMPLO DE CONTROLADOR:
const { SchemaValidator, QueryEngine } = require('../../gestas-core/functions');

class [Entidad]Controller {
    static async create(req, res) {
        try {
            const validation = await SchemaValidator.validate('[Entidad]', req.body);
            if (!validation.valid) {
                return res.status(400).json({ errors: validation.errors });
            }
            
            const data = await SchemaValidator.save('[Entidad]', req.body);
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async list(req, res) {
        try {
            const results = await QueryEngine.search('[Entidad]', req.query.q || '*');
            res.json({ success: true, data: results });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async softDelete(req, res) {
        try {
            const doc = await SchemaValidator.load('[Entidad]', req.params.id);
            doc.deleted_at = new Date().toISOString();
            await SchemaValidator.save('[Entidad]', doc);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
```

---

## 📋 Checklist de Validación

Antes de considerar el plugin completo, verificar:

- [ ] manifest.json tiene todos los campos obligatorios
- [ ] Esquemas JSON creados para todas las entidades
- [ ] Controladores implementan CRUD completo
- [ ] Rutas configuradas correctamente
- [ ] Health check funciona (/health)
- [ ] Plugin se registra automáticamente al iniciar
- [ ] Aparece en el Marketplace
- [ ] Botón "Configurar" funciona
- [ ] Soft delete implementado
- [ ] Búsqueda funciona
- [ ] Tests básicos pasan

---

## 🚀 Comandos para Crear Plugin

```bash
# 1. Copiar estructura base
cp -r packages/plugin-gestascore-acide packages/plugin-[nombre]

# 2. Actualizar archivos
# - manifest.json
# - package.json
# - .env.example
# - README.md

# 3. Crear esquemas
# - schemas/core/[entidad].json

# 4. Implementar lógica
# - src/controllers/[Entidad]Controller.js
# - src/routes/[entidad].routes.js

# 5. Añadir a docker-compose.yml

# 6. Levantar plugin
docker-compose up -d plugin-[nombre]

# 7. Verificar logs
docker logs -f gestas_plugin_[nombre]
```

---

## 🎨 Ejemplo Completo: Plugin de Tareas

```javascript
// schemas/core/task.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "title", "status"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "minLength": 1, "maxLength": 255 },
    "description": { "type": "string" },
    "status": { "enum": ["pending", "in_progress", "completed"] },
    "priority": { "enum": ["low", "medium", "high"], "default": "medium" },
    "assigned_to": { "type": "string", "format": "uuid" },
    "due_date": { "type": "string", "format": "date-time" },
    "created_at": { "type": "string", "format": "date-time" },
    "updated_at": { "type": "string", "format": "date-time" },
    "deleted_at": { "type": ["string", "null"], "format": "date-time" }
  },
  "relations": {
    "assignee": {
      "entity": "User",
      "field": "assigned_to",
      "type": "belongsTo"
    }
  }
}

// src/controllers/TaskController.js
const { SchemaValidator, QueryEngine } = require('../../gestas-core/functions');
const { v4: uuidv4 } = require('uuid');

class TaskController {
    static async create(req, res) {
        try {
            const taskData = {
                id: uuidv4(),
                ...req.body,
                status: req.body.status || 'pending',
                priority: req.body.priority || 'medium'
            };
            
            const validation = await SchemaValidator.validate('Task', taskData);
            if (!validation.valid) {
                return res.status(400).json({ errors: validation.errors });
            }
            
            const task = await SchemaValidator.save('Task', taskData);
            res.json({ success: true, data: task });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async list(req, res) {
        try {
            const { status, priority, assigned_to } = req.query;
            
            let tasks = await QueryEngine.buscar_en_directorio('Task', {});
            
            // Filtrar por status
            if (status) {
                tasks = tasks.filter(t => t.status === status);
            }
            
            // Filtrar por prioridad
            if (priority) {
                tasks = tasks.filter(t => t.priority === priority);
            }
            
            // Filtrar por asignado
            if (assigned_to) {
                tasks = tasks.filter(t => t.assigned_to === assigned_to);
            }
            
            // Excluir eliminados
            tasks = tasks.filter(t => !t.deleted_at);
            
            res.json({ success: true, data: tasks });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async getById(req, res) {
        try {
            const task = await SchemaValidator.load('Task', req.params.id);
            
            if (task.deleted_at) {
                return res.status(404).json({ error: 'Task not found' });
            }
            
            res.json({ success: true, data: task });
        } catch (error) {
            res.status(404).json({ error: 'Task not found' });
        }
    }
    
    static async update(req, res) {
        try {
            const task = await SchemaValidator.load('Task', req.params.id);
            
            if (task.deleted_at) {
                return res.status(404).json({ error: 'Task not found' });
            }
            
            const updatedTask = {
                ...task,
                ...req.body,
                id: task.id, // No permitir cambiar ID
                created_at: task.created_at // No permitir cambiar fecha creación
            };
            
            const validation = await SchemaValidator.validate('Task', updatedTask);
            if (!validation.valid) {
                return res.status(400).json({ errors: validation.errors });
            }
            
            const saved = await SchemaValidator.save('Task', updatedTask);
            res.json({ success: true, data: saved });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async softDelete(req, res) {
        try {
            const task = await SchemaValidator.load('Task', req.params.id);
            
            if (task.deleted_at) {
                return res.status(404).json({ error: 'Task already deleted' });
            }
            
            task.deleted_at = new Date().toISOString();
            await SchemaValidator.save('Task', task);
            
            res.json({ success: true, message: 'Task deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async restore(req, res) {
        try {
            const task = await SchemaValidator.load('Task', req.params.id);
            
            if (!task.deleted_at) {
                return res.status(400).json({ error: 'Task is not deleted' });
            }
            
            task.deleted_at = null;
            await SchemaValidator.save('Task', task);
            
            res.json({ success: true, message: 'Task restored' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TaskController;
```

---

**Última actualización**: 23 de Noviembre de 2025
