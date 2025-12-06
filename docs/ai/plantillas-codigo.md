# 📋 Plantillas de Código para IA

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025  
**Audiencia**: Sistema de IA

---

## 🎯 Variables en Templates

Usar estas variables en las plantillas:

- `{{ENTITY}}` - Nombre de la entidad (PascalCase): `Product`, `User`
- `{{entity}}` - Nombre de la entidad (camelCase): `product`, `user`
- `{{entities}}` - Plural (camelCase): `products`, `users`
- `{{ENTITIES}}` - Plural (UPPER_CASE): `PRODUCTS`, `USERS`
- `{{TABLE}}` - Nombre de tabla (snake_case): `products`, `user_roles`
- `{{FIELDS}}` - Lista de campos
- `{{TENANT_ID}}` - Siempre incluir

---

## 🎨 Template: Controller CRUD

```javascript
const {{ENTITY}}Service = require('../services/{{ENTITY}}Service');

const {{ENTITY}}Controller = {
  async create(req, res) {
    try {
      const {{entity}} = await {{ENTITY}}Service.create{{ENTITY}}(req.body, req.tenantId);
      res.status(201).json({{entity}});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    const {{entities}} = await {{ENTITY}}Service.getAll{{ENTITY}}s(req.tenantId);
    res.json({{entities}});
  },

  async getById(req, res) {
    const {{entity}} = await {{ENTITY}}Service.get{{ENTITY}}ById(req.params.id, req.tenantId);
    if (!{{entity}}) {
      return res.status(404).json({ error: '{{ENTITY}} not found' });
    }
    res.json({{entity}});
  },

  async update(req, res) {
    try {
      const {{entity}} = await {{ENTITY}}Service.update{{ENTITY}}(req.params.id, req.body, req.tenantId);
      res.json({{entity}});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    await {{ENTITY}}Service.delete{{ENTITY}}(req.params.id, req.tenantId);
    res.status(204).send();
  }
};

module.exports = {{ENTITY}}Controller;
```

---

## 🎨 Template: Service CRUD

```javascript
const db = require('../db');

const {{ENTITY}}Service = {
  async create{{ENTITY}}(data, tenantId) {
    const result = await db.query(
      'INSERT INTO {{TABLE}} (tenant_id, {{FIELDS}}) VALUES ($1, {{PARAMS}}) RETURNING *',
      [tenantId, {{VALUES}}]
    );
    return result.rows[0];
  },

  async getAll{{ENTITY}}s(tenantId) {
    const result = await db.query(
      'SELECT * FROM {{TABLE}} WHERE tenant_id = $1 ORDER BY created_at DESC',
      [tenantId]
    );
    return result.rows;
  },

  async get{{ENTITY}}ById(id, tenantId) {
    const result = await db.query(
      'SELECT * FROM {{TABLE}} WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
    return result.rows[0];
  },

  async update{{ENTITY}}(id, data, tenantId) {
    const result = await db.query(
      'UPDATE {{TABLE}} SET {{UPDATE_FIELDS}}, updated_at = NOW() WHERE id = ${{N}} AND tenant_id = ${{N+1}} RETURNING *',
      [{{VALUES}}, id, tenantId]
    );
    return result.rows[0];
  },

  async delete{{ENTITY}}(id, tenantId) {
    await db.query(
      'DELETE FROM {{TABLE}} WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
  }
};

module.exports = {{ENTITY}}Service;
```

---

## 🎨 Template: Routes

```javascript
const express = require('express');
const {{ENTITY}}Controller = require('../controllers/{{ENTITY}}Controller');

const router = express.Router();

router.post('/{{entities}}', {{ENTITY}}Controller.create);
router.get('/{{entities}}', {{ENTITY}}Controller.getAll);
router.get('/{{entities}}/:id', {{ENTITY}}Controller.getById);
router.put('/{{entities}}/:id', {{ENTITY}}Controller.update);
router.delete('/{{entities}}/:id', {{ENTITY}}Controller.delete);

module.exports = router;
```

---

## 🎨 Template: Schema SQL

```sql
CREATE TABLE IF NOT EXISTS {{TABLE}} (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    {{FIELD_DEFINITIONS}},
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_{{TABLE}}_tenant_id ON {{TABLE}}(tenant_id);
```

---

## 🎨 Template: Widget React

```jsx
import { useState, useEffect } from 'react';
import ConnectionManager from './services/ConnectionManager';

const api = new ConnectionManager('http://localhost:3000');

const {{ENTITY}}ListWidget = () => {
  const [{{entities}}, set{{ENTITY}}s] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch{{ENTITY}}s = async () => {
      const data = await api.get('/api/plugins/plugin-{{plugin}}/api/{{entities}}');
      set{{ENTITY}}s(data);
      setLoading(false);
    };
    fetch{{ENTITY}}s();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{{ENTITY}}s</h2>
      <table>
        <thead>
          <tr>
            {{HEADER_COLUMNS}}
          </tr>
        </thead>
        <tbody>
          {{{entities}}.map({{entity}} => (
            <tr key={{{entity}}.id}>
              {{DATA_COLUMNS}}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default {{ENTITY}}ListWidget;
```

---

**Última actualización**: 22 de Noviembre de 2025
