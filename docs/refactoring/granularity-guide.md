# 📐 Guía de Granularidad Extrema

**Fecha**: 22 de Noviembre de 2025  
**Versión**: 1.0

---

## 🎯 ¿Qué es la Granularidad Extrema?

La **granularidad extrema** es un principio de diseño de software que consiste en dividir el código en **unidades lo más pequeñas y enfocadas posible**, donde cada archivo, función o módulo tiene **una única responsabilidad clara**.

### Principio Fundamental

> **"Un archivo, una responsabilidad. Una función, una tarea."**

---

## 🏗️ Niveles de Granularidad

### Nivel 1: Archivo Monolítico ❌

```
index.js (500+ líneas)
├── Configuración
├── Middleware
├── Rutas
├── Lógica de negocio
├── Validaciones
├── Conexiones a DB
└── Bootstrap
```

**Problemas:**
- Difícil de mantener
- Imposible de testear unitariamente
- Cambios afectan todo el archivo
- Difícil de entender

### Nivel 2: Separación Básica ⚠️

```
src/
├── index.js (100 líneas)
├── routes.js (200 líneas)
└── services/
    └── UserService.js (150 líneas)
```

**Problemas:**
- Archivos aún grandes
- Múltiples responsabilidades por archivo
- Difícil de reutilizar

### Nivel 3: Granularidad Moderada ✅

```
src/
├── index.js (60 líneas)
├── routes/
│   ├── user.routes.js
│   └── auth.routes.js
├── controllers/
│   ├── UserController.js
│   └── AuthController.js
└── services/
    ├── UserService.js
    └── AuthService.js
```

**Mejor, pero puede mejorar:**
- Archivos más pequeños
- Responsabilidades más claras
- Aún hay servicios con múltiples funciones

### Nivel 4: Granularidad Extrema 🎯

```
src/
├── index.js (40 líneas)
├── /utils
│   ├── extractSubdomain.js (10 líneas)
│   └── formatUserResponse.js (12 líneas)
├── /services
│   ├── UserFetcher.js (60 líneas)
│   ├── PasswordHasher.js (20 líneas)
│   ├── TokenGenerator.js (35 líneas)
│   └── UserService.js (40 líneas - orquestador)
├── /controllers
│   ├── UserController.js (50 líneas)
│   └── AuthController.js (45 líneas)
├── /routes
│   ├── user.routes.js (15 líneas)
│   └── auth.routes.js (12 líneas)
└── /bootstrap
    ├── database.js (40 líneas)
    ├── redis.js (45 líneas)
    └── plugin.js (40 líneas)
```

**Ventajas:**
- Archivos pequeños (~20-60 líneas)
- Una responsabilidad por archivo
- Fácil de testear
- Altamente reutilizable
- Perfecto para IA

---

## 📋 Reglas de Granularidad Extrema

### Regla 1: Un Archivo, Una Responsabilidad

**❌ Incorrecto:**
```javascript
// utils.js
export const formatDate = (date) => { ... }
export const formatCurrency = (amount) => { ... }
export const validateEmail = (email) => { ... }
export const hashPassword = (password) => { ... }
```

**✅ Correcto:**
```javascript
// utils/formatters/dateFormatter.js
export const formatDate = (date) => { ... }

// utils/formatters/currencyFormatter.js
export const formatCurrency = (amount) => { ... }

// utils/validators/emailValidator.js
export const validateEmail = (email) => { ... }

// utils/security/passwordHasher.js
export const hashPassword = (password) => { ... }
```

### Regla 2: Tamaño Máximo de Archivo

**Límites recomendados:**
- **Utils**: 10-20 líneas
- **Services específicos**: 30-60 líneas
- **Controllers**: 40-80 líneas
- **Routes**: 10-20 líneas
- **Bootstrap**: 30-50 líneas
- **Index/Main**: 40-60 líneas

**Si un archivo supera estos límites, divídelo.**

### Regla 3: Nombres Descriptivos

**❌ Incorrecto:**
```
utils.js
helpers.js
functions.js
misc.js
```

**✅ Correcto:**
```
extractSubdomain.js
formatUserResponse.js
validateEmail.js
hashPassword.js
```

### Regla 4: Organización por Funcionalidad

**❌ Incorrecto:**
```
src/
├── file1.js
├── file2.js
├── file3.js
└── file4.js
```

**✅ Correcto:**
```
src/
├── /utils
│   ├── /formatters
│   ├── /validators
│   └── /storage
├── /services
│   ├── /user
│   └── /auth
└── /controllers
```

### Regla 5: Patrón de Orquestación

Los servicios grandes se convierten en **orquestadores** que usan servicios granulares:

```javascript
// services/UserService.js (Orquestador)
const UserFetcher = require('./UserFetcher');
const UserCreator = require('./UserCreator');
const UserUpdater = require('./UserUpdater');

class UserService {
  async createUser(data) {
    return await UserCreator.createUser(data);
  }
  
  async getUser(id) {
    return await UserFetcher.getUserById(id);
  }
  
  async updateUser(id, data) {
    return await UserUpdater.updateUser(id, data);
  }
}
```

---

## 🎨 Patrones de Granularidad

### Patrón 1: Utils Granulares

**Antes:**
```javascript
// utils.js (100 líneas)
export const utils = {
  formatDate: (date) => { ... },
  formatCurrency: (amount) => { ... },
  validateEmail: (email) => { ... },
  parseJSON: (str) => { ... }
}
```

**Después:**
```
utils/
├── formatters/
│   ├── dateFormatter.js (15 líneas)
│   └── currencyFormatter.js (12 líneas)
├── validators/
│   └── emailValidator.js (10 líneas)
└── parsers/
    └── jsonParser.js (18 líneas)
```

### Patrón 2: Services Granulares

**Antes:**
```javascript
// UserService.js (200 líneas)
class UserService {
  async createUser() { ... }
  async getUser() { ... }
  async updateUser() { ... }
  async deleteUser() { ... }
  async validatePassword() { ... }
  async hashPassword() { ... }
  async generateToken() { ... }
}
```

**Después:**
```
services/
├── UserFetcher.js (60 líneas)
├── UserCreator.js (40 líneas)
├── UserUpdater.js (35 líneas)
├── UserDeleter.js (20 líneas)
├── PasswordHasher.js (25 líneas)
├── TokenGenerator.js (35 líneas)
└── UserService.js (40 líneas - orquestador)
```

### Patrón 3: Controllers Granulares

**Antes:**
```javascript
// index.js (300 líneas)
app.get('/users', async (req, res) => { ... });
app.post('/users', async (req, res) => { ... });
app.get('/roles', async (req, res) => { ... });
app.post('/roles', async (req, res) => { ... });
```

**Después:**
```
controllers/
├── UserController.js (50 líneas)
└── RoleController.js (45 líneas)

routes/
├── user.routes.js (15 líneas)
└── role.routes.js (12 líneas)
```

### Patrón 4: Bootstrap Granular

**Antes:**
```javascript
// index.js (400 líneas)
async function start() {
  // Conectar Redis (50 líneas)
  // Conectar DB (60 líneas)
  // Registrar plugin (40 líneas)
  // Configurar rutas (100 líneas)
  // Iniciar servidor (50 líneas)
}
```

**Después:**
```
bootstrap/
├── database.js (40 líneas)
├── redis.js (45 líneas)
└── plugin.js (40 líneas)

index.js (50 líneas - solo orquestación)
```

---

## 🧪 Criterios de Calidad

### ✅ Un archivo granular debe cumplir:

1. **Tamaño**: < 80 líneas de código
2. **Responsabilidad**: Una sola tarea clara
3. **Nombre**: Descriptivo y específico
4. **Independencia**: Mínimas dependencias
5. **Testeable**: Fácil de testear unitariamente
6. **Reutilizable**: Puede usarse en otros contextos
7. **Documentado**: JSDoc o comentarios claros

### ❌ Señales de que necesitas más granularidad:

1. Archivo > 100 líneas
2. Múltiples `export` en un archivo
3. Nombre genérico (`utils.js`, `helpers.js`)
4. Difícil de testear
5. Cambios frecuentes afectan todo el archivo
6. Código duplicado en varios lugares

---

## 🎯 Beneficios de la Granularidad Extrema

### Para Desarrollo

- ✅ **Mantenibilidad**: Fácil encontrar y modificar código
- ✅ **Testabilidad**: Tests unitarios simples
- ✅ **Reutilización**: Funciones compartibles
- ✅ **Colaboración**: Menos conflictos en Git
- ✅ **Onboarding**: Nuevos desarrolladores entienden rápido

### Para IA

- ✅ **Entrenamiento**: Ejemplos claros de patrones
- ✅ **Generación**: Fácil generar código similar
- ✅ **Comprensión**: Contexto claro por archivo
- ✅ **Análisis**: Fácil analizar dependencias
- ✅ **Refactoring**: IA puede sugerir mejoras

---

## 📝 Checklist de Granularidad

Antes de considerar un archivo "granular", verifica:

- [ ] ¿Tiene menos de 80 líneas?
- [ ] ¿Tiene una sola responsabilidad?
- [ ] ¿El nombre es específico y descriptivo?
- [ ] ¿Es fácil de testear?
- [ ] ¿Puede reutilizarse en otros contextos?
- [ ] ¿Tiene mínimas dependencias?
- [ ] ¿Está bien documentado?
- [ ] ¿Sigue las convenciones del proyecto?

**Si respondes NO a alguna, refactoriza más.**

---

## 🚀 Proceso de Refactorización

### Paso 1: Identificar Responsabilidades

```javascript
// Analizar archivo grande
// ¿Qué hace este código?
// - Valida datos
// - Hashea contraseñas
// - Guarda en DB
// - Envía email
// = 4 responsabilidades = 4 archivos
```

### Paso 2: Crear Archivos Granulares

```
services/
├── DataValidator.js
├── PasswordHasher.js
├── UserRepository.js
└── EmailSender.js
```

### Paso 3: Crear Orquestador

```javascript
// UserService.js
class UserService {
  async createUser(data) {
    DataValidator.validate(data);
    const hash = await PasswordHasher.hash(data.password);
    const user = await UserRepository.save({ ...data, hash });
    await EmailSender.sendWelcome(user.email);
    return user;
  }
}
```

### Paso 4: Actualizar Imports

```javascript
// Antes
const UserService = require('./services/UserService');

// Después (igual, pero internamente más granular)
const UserService = require('./services/UserService');
```

---

**Última actualización**: 22 de Noviembre de 2025
