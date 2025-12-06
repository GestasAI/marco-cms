# 📦 Estructura de Módulos

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Estructura Estándar de un Plugin

```
plugin-example/
├── manifest.json           # Configuración del plugin
├── package.json            # Dependencias npm
├── Dockerfile              # Imagen Docker
└── src/
    ├── index.js            # Servidor Express + Registro
    ├── /controllers        # Lógica de endpoints (granular)
    │   ├── UserController.js
    │   └── RoleController.js
    ├── /services           # Lógica de negocio (granular)
    │   ├── UserService.js
    │   └── ValidationService.js
    ├── /models             # Modelos de datos
    │   └── User.js
    ├── /utils              # Utilidades (una función por archivo)
    │   ├── hashPassword.js
    │   └── generateToken.js
    ├── /routes             # Definición de rutas
    │   └── user.routes.js
    ├── /middleware         # Middleware específico
    │   └── validateUser.js
    └── /db                 # Conexión a base de datos
        └── index.js
```

---

## 🎨 Patrón MVC Granular

### Controllers (Delgados)
```javascript
// src/controllers/UserController.js
const UserController = {
  async create(req, res) {
    try {
      const user = await UserService.createUser(req.body, req.tenantId);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  
  async getById(req, res) {
    const user = await UserService.getUserById(req.params.id, req.tenantId);
    res.json(user);
  }
};
```

### Services (Lógica de Negocio)
```javascript
// src/services/UserService.js
const UserService = {
  async createUser(data, tenantId) {
    await ValidationService.validateUserData(data);
    const hash = await hashPassword(data.password);
    const user = await db.query(
      'INSERT INTO users (tenant_id, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [tenantId, data.email, hash]
    );
    await EmailService.sendWelcome(user.email);
    return user;
  }
};
```

### Utils (Una Función por Archivo)
```javascript
// src/utils/hashPassword.js
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

module.exports = hashPassword;
```

---

## 🗂️ Organización por Dominio

Para plugins grandes, organizar por dominio:

```
plugin-cms/
└── src/
    ├── /pages
    │   ├── PageController.js
    │   ├── PageService.js
    │   └── page.routes.js
    ├── /categories
    │   ├── CategoryController.js
    │   ├── CategoryService.js
    │   └── category.routes.js
    └── /media
        ├── MediaController.js
        ├── MediaService.js
        └── media.routes.js
```

---

**Última actualización**: 22 de Noviembre de 2025
