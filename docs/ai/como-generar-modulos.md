# 🤖 Cómo Generar Módulos

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025  
**Audiencia**: Sistema de IA

---

## 🎯 Objetivo

Este documento guía al modelo de IA sobre cómo generar módulos (controllers, services, utils) coherentes con la arquitectura de GestasAI.

---

## 📋 Proceso de Generación

### 1. Analizar la Solicitud
```
Input: "Crea un controlador de productos con CRUD completo"

Análisis:
- Entidad: Product
- Operaciones: Create, Read, Update, Delete
- Tipo de módulo: Controller + Service
```

### 2. Consultar Knowledge Base (RAG)
```
Query: "controller CRUD pattern"
Resultados:
- UserController.js (ejemplo existente)
- ProductController.js (si existe)
- Patrones de validación
```

### 3. Generar Código

#### ProductController.js
```javascript
const ProductService = require('../services/ProductService');

const ProductController = {
  async create(req, res) {
    try {
      const product = await ProductService.createProduct(req.body, req.tenantId);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    const products = await ProductService.getAllProducts(req.tenantId);
    res.json(products);
  },

  async getById(req, res) {
    const product = await ProductService.getProductById(req.params.id, req.tenantId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  },

  async update(req, res) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body, req.tenantId);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    await ProductService.deleteProduct(req.params.id, req.tenantId);
    res.status(204).send();
  }
};

module.exports = ProductController;
```

#### ProductService.js
```javascript
const db = require('../db');
const ValidationService = require('./ValidationService');

const ProductService = {
  async createProduct(data, tenantId) {
    // Validar datos
    await ValidationService.validateProductData(data);
    
    // Crear producto
    const result = await db.query(
      'INSERT INTO products (tenant_id, name, description, price, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [tenantId, data.name, data.description, data.price, data.stock]
    );
    
    return result.rows[0];
  },

  async getAllProducts(tenantId) {
    const result = await db.query(
      'SELECT * FROM products WHERE tenant_id = $1 ORDER BY created_at DESC',
      [tenantId]
    );
    return result.rows;
  },

  async getProductById(id, tenantId) {
    const result = await db.query(
      'SELECT * FROM products WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
    return result.rows[0];
  },

  async updateProduct(id, data, tenantId) {
    await ValidationService.validateProductData(data);
    
    const result = await db.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, updated_at = NOW() WHERE id = $5 AND tenant_id = $6 RETURNING *',
      [data.name, data.description, data.price, data.stock, id, tenantId]
    );
    
    return result.rows[0];
  },

  async deleteProduct(id, tenantId) {
    await db.query(
      'DELETE FROM products WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
  }
};

module.exports = ProductService;
```

---

## ✅ Checklist de Validación

Antes de retornar el código generado, verificar:

- [ ] Sigue el patrón Controller/Service
- [ ] Controller es delgado (solo manejo de request/response)
- [ ] Service contiene la lógica de negocio
- [ ] Incluye `tenantId` en todas las queries
- [ ] Usa queries parametrizadas (no concatenación)
- [ ] Maneja errores apropiadamente
- [ ] Retorna códigos HTTP correctos
- [ ] Usa `async/await`
- [ ] Exporta con `module.exports`
- [ ] Nombres en camelCase
- [ ] Comentarios solo cuando sea necesario

---

## 🎨 Patrones a Seguir

### Controller Pattern
```javascript
const EntityController = {
  async methodName(req, res) {
    try {
      const result = await EntityService.methodName(req.body, req.tenantId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
```

### Service Pattern
```javascript
const EntityService = {
  async methodName(data, tenantId) {
    // 1. Validar
    await ValidationService.validate(data);
    
    // 2. Procesar
    const result = await db.query('...', [tenantId, ...]);
    
    // 3. Retornar
    return result.rows[0];
  }
};
```

---

**Última actualización**: 22 de Noviembre de 2025
