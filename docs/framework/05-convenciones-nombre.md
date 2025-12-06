# 🏷️ Convenciones de Nombre en GestasAI

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Principio General

> "Los nombres deben ser descriptivos, consistentes y revelar intención."

---

## 📁 Archivos y Carpetas

### Archivos JavaScript/TypeScript
- **Formato**: kebab-case
- **Extensión**: `.js` o `.ts`

```
✅ user-service.js
✅ auth-controller.js
✅ hash-password.js

❌ UserService.js
❌ auth_controller.js
❌ hashpassword.js
```

### Archivos React
- **Componentes**: PascalCase + `.jsx` o `.tsx`
- **Hooks**: camelCase + `.js`

```
✅ UserCard.jsx
✅ LoginWidget.jsx
✅ useUsers.js

❌ user-card.jsx
❌ loginWidget.jsx
```

### Carpetas
- **Formato**: kebab-case
- **Plural** para colecciones

```
✅ controllers/
✅ services/
✅ utils/

❌ Controllers/
❌ service/
```

---

## 🔤 Variables y Constantes

### Variables
- **Formato**: camelCase
- **Descriptivas**: Evitar abreviaciones

```javascript
✅ const userId = '123';
✅ const tenantName = 'Acme Corp';
✅ const isAuthenticated = true;

❌ const uid = '123';
❌ const tn = 'Acme Corp';
❌ const auth = true;
```

### Constantes
- **Formato**: UPPER_SNAKE_CASE
- **Valores que no cambian**

```javascript
✅ const MAX_RETRIES = 3;
✅ const API_BASE_URL = 'https://api.example.com';
✅ const DEFAULT_PAGE_SIZE = 20;

❌ const maxRetries = 3;
❌ const apiBaseUrl = 'https://api.example.com';
```

### Booleanos
- **Prefijos**: `is`, `has`, `can`, `should`

```javascript
✅ const isActive = true;
✅ const hasPermission = false;
✅ const canEdit = true;
✅ const shouldValidate = false;

❌ const active = true;
❌ const permission = false;
```

---

## 🔧 Funciones y Métodos

### Funciones
- **Formato**: camelCase
- **Verbos**: Empezar con acción

```javascript
✅ const createUser = () => {};
✅ const validateEmail = () => {};
✅ const fetchData = () => {};
✅ const handleClick = () => {};

❌ const user = () => {};
❌ const email = () => {};
```

### Funciones Async
- **Mismo formato**: No prefijo especial

```javascript
✅ const fetchUsers = async () => {};
✅ const createPost = async () => {};

❌ const asyncFetchUsers = async () => {};
❌ const createPostAsync = async () => {};
```

### Getters/Setters
- **Prefijos**: `get`, `set`

```javascript
✅ const getUserById = (id) => {};
✅ const setUserRole = (userId, roleId) => {};

❌ const userById = (id) => {};
❌ const userRole = (userId, roleId) => {};
```

---

## 🏛️ Clases y Constructores

### Clases
- **Formato**: PascalCase
- **Sustantivos**

```javascript
✅ class UserService {}
✅ class AuthController {}
✅ class ValidationError extends Error {}

❌ class userService {}
❌ class auth_controller {}
```

### Métodos de Clase
- **Formato**: camelCase

```javascript
class UserService {
  ✅ async createUser(data) {}
  ✅ async getUserById(id) {}
  
  ❌ async CreateUser(data) {}
  ❌ async get_user_by_id(id) {}
}
```

---

## 🗄️ Base de Datos

### Tablas
- **Formato**: snake_case
- **Plural**

```sql
✅ users
✅ user_roles
✅ role_permissions

❌ Users
❌ user_role
❌ RolePermissions
```

### Columnas
- **Formato**: snake_case
- **Singular**

```sql
✅ user_id
✅ created_at
✅ is_active

❌ userId
❌ createdAt
❌ isActive
```

### Índices
- **Formato**: `idx_<tabla>_<columna(s)>`

```sql
✅ idx_users_email
✅ idx_users_tenant_id_email

❌ users_email_idx
❌ index_users_email
```

---

## 🔌 Plugins

### Nombre de Plugin
- **Formato**: `plugin-<nombre>`
- **kebab-case**

```
✅ plugin-auth
✅ plugin-system
✅ plugin-cms

❌ pluginAuth
❌ plugin_auth
❌ auth-plugin
```

### Manifest
- **Archivo**: `manifest.json`
- **Key**: `plugin-<nombre>`

```json
{
  "key": "plugin-auth",
  "name": "Authentication Plugin"
}
```

---

## ⚛️ React

### Componentes
- **Formato**: PascalCase
- **Sustantivos**

```jsx
✅ const UserCard = () => {};
✅ const LoginForm = () => {};
✅ const NavigationBar = () => {};

❌ const userCard = () => {};
❌ const login_form = () => {};
```

### Props
- **Formato**: camelCase

```jsx
✅ <UserCard userId="123" isActive={true} />

❌ <UserCard user_id="123" is_active={true} />
```

### Hooks Personalizados
- **Prefijo**: `use`
- **camelCase**

```javascript
✅ const useUsers = () => {};
✅ const useAuth = () => {};
✅ const useLocalStorage = () => {};

❌ const users = () => {};
❌ const getAuth = () => {};
```

### Event Handlers
- **Prefijo**: `handle`

```jsx
✅ const handleClick = () => {};
✅ const handleSubmit = () => {};
✅ const handleChange = () => {};

❌ const onClick = () => {};
❌ const submit = () => {};
```

---

## 🌐 API y Endpoints

### Rutas
- **Formato**: kebab-case
- **Plural** para colecciones

```
✅ /api/users
✅ /api/user-roles
✅ /api/auth/login

❌ /api/Users
❌ /api/user_roles
❌ /api/auth/Login
```

### Query Parameters
- **Formato**: camelCase

```
✅ /api/users?tenantId=123&pageSize=20

❌ /api/users?tenant_id=123&page_size=20
```

---

## 📦 Paquetes npm

### Nombre
- **Formato**: `@gestasai/<nombre>`
- **kebab-case**

```json
✅ "@gestasai/plugin-auth"
✅ "@gestasai/core-utils"

❌ "@gestasai/pluginAuth"
❌ "@gestasai/core_utils"
```

---

## 🔐 Variables de Entorno

### Formato
- **UPPER_SNAKE_CASE**

```bash
✅ DATABASE_URL=postgresql://...
✅ JWT_SECRET=secret123
✅ REDIS_URL=redis://...

❌ databaseUrl=postgresql://...
❌ jwtSecret=secret123
```

---

## 📝 Commits de Git

### Formato
- **Tipo**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- **Scope**: Opcional
- **Mensaje**: Imperativo, minúsculas

```
✅ feat: add user authentication
✅ fix(auth): resolve token expiration issue
✅ docs: update API reference

❌ Added user authentication
❌ Fixed bug
❌ Update docs
```

---

## ✅ Checklist de Nombres

Antes de nombrar algo, pregúntate:

- [ ] ¿Es descriptivo y revela intención?
- [ ] ¿Sigue la convención del tipo (camelCase, PascalCase, etc.)?
- [ ] ¿Es consistente con nombres similares en el proyecto?
- [ ] ¿Evita abreviaciones innecesarias?
- [ ] ¿Es fácil de buscar y reemplazar?
- [ ] ¿Será claro para otros desarrolladores?

---

**Última actualización**: 22 de Noviembre de 2025
