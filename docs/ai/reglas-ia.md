# 🚫 Reglas para la IA

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025  
**Audiencia**: Sistema de IA

---

## ✅ LO QUE DEBES HACER

### 1. Seguir la Arquitectura
- Usar patrón Controller/Service
- Aplicar granularidad extrema
- Incluir `tenantId` en todas las queries
- Usar queries parametrizadas

### 2. Mantener Consistencia
- Nombres en camelCase para JS
- Nombres en snake_case para SQL
- Seguir convenciones de naming
- Usar mismos patrones que código existente

### 3. Validar Siempre
- Validar inputs antes de procesar
- Manejar errores apropiadamente
- Retornar códigos HTTP correctos
- Incluir mensajes de error descriptivos

### 4. Documentar
- Comentarios solo cuando sea necesario
- JSDoc para funciones públicas
- README para proyectos nuevos

### 5. Consultar Knowledge Base
- Buscar ejemplos similares antes de generar
- Usar patrones existentes
- Aprender de código previo

---

## ❌ LO QUE NO DEBES HACER

### 1. NO Romper Multi-Tenancy
```javascript
// ❌ NUNCA HACER ESTO
const users = await db.query('SELECT * FROM users');

// ✅ SIEMPRE INCLUIR tenant_id
const users = await db.query(
  'SELECT * FROM users WHERE tenant_id = $1',
  [tenantId]
);
```

### 2. NO Usar Concatenación en SQL
```javascript
// ❌ NUNCA HACER ESTO (SQL Injection)
const user = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
);

// ✅ USAR PARÁMETROS
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

### 3. NO Crear Archivos Gigantes
```javascript
// ❌ NO: Un archivo con 500 líneas
// src/index.js (todo mezclado)

// ✅ SÍ: Archivos granulares
// src/controllers/UserController.js
// src/services/UserService.js
// src/utils/hashPassword.js
```

### 4. NO Ignorar Errores
```javascript
// ❌ NO: Ignorar errores
try {
  await createUser(data);
} catch (error) {
  // Silencio...
}

// ✅ SÍ: Manejar errores
try {
  await createUser(data);
} catch (error) {
  console.error('Error creating user:', error);
  throw error;
}
```

### 5. NO Inventar Patrones Nuevos
```javascript
// ❌ NO: Crear tu propio patrón
class UserManager {
  constructor() {
    this.users = [];
  }
}

// ✅ SÍ: Usar patrones existentes
const UserService = {
  async createUser(data, tenantId) {
    // ...
  }
};
```

---

## 🎯 Prioridades

1. **Seguridad** - Siempre primero
2. **Multi-Tenancy** - Nunca olvidar
3. **Consistencia** - Seguir patrones existentes
4. **Granularidad** - Archivos pequeños y enfocados
5. **Simplicidad** - Código claro y legible

---

## 🔍 Proceso de Validación

Antes de retornar código, pregúntate:

1. ¿Incluye `tenantId` donde corresponde?
2. ¿Usa queries parametrizadas?
3. ¿Sigue el patrón Controller/Service?
4. ¿Es granular (archivos pequeños)?
5. ¿Maneja errores apropiadamente?
6. ¿Es consistente con código existente?
7. ¿Es seguro?
8. ¿Es simple y legible?

Si la respuesta a cualquiera es NO, corregir antes de retornar.

---

## 📚 Recursos

Cuando tengas dudas, consultar:
- Knowledge Base (RAG)
- Documentación del framework
- Ejemplos de código existente
- Patrones establecidos

---

**Última actualización**: 22 de Noviembre de 2025
