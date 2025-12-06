# 📐 Guía de Estilo de GestasAI

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Principio General

> "El código se lee más veces de las que se escribe. Optimiza para legibilidad."

---

## 📝 Convenciones de Código

### JavaScript/TypeScript

**Formato**:
- **Indentación**: 2 espacios (no tabs)
- **Comillas**: Simples `'` para strings
- **Punto y coma**: Siempre usar `;`
- **Longitud de línea**: Máximo 100 caracteres

**Ejemplo**:
```javascript
const getUserById = async (id, tenantId) => {
  const user = await db.query(
    'SELECT * FROM users WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  );
  return user;
};
```

### Nombres

- **Variables**: camelCase → `userId`, `tenantName`
- **Constantes**: UPPER_SNAKE_CASE → `MAX_RETRIES`, `API_URL`
- **Funciones**: camelCase → `createUser()`, `validateEmail()`
- **Clases**: PascalCase → `UserService`, `AuthController`
- **Archivos**: kebab-case → `user-service.js`, `auth-controller.js`

### Comentarios

```javascript
// ✅ BUENO: Explica el "por qué"
// Usamos bcrypt con 10 rounds para balance entre seguridad y performance
const hash = await bcrypt.hash(password, 10);

// ❌ MALO: Explica el "qué" (obvio)
// Hashea la contraseña
const hash = await bcrypt.hash(password, 10);
```

---

## 🗂️ Estructura de Archivos

### Principio de Granularidad

**Una función, un archivo** (cuando tiene sentido):

```
utils/
├── hashPassword.js      # Solo hashPassword()
├── generateToken.js     # Solo generateToken()
└── validateEmail.js     # Solo validateEmail()
```

### Organización de Carpetas

```
src/
├── controllers/         # Lógica de endpoints
├── services/           # Lógica de negocio
├── models/             # Modelos de datos
├── routes/             # Definición de rutas
├── utils/              # Utilidades (granulares)
├── middleware/         # Middleware de Express
└── db/                 # Conexión a DB
```

---

## 🎨 Patrones de Código

### Controllers (Delgados)

```javascript
// ✅ BUENO: Controller delgado
const UserController = {
  async create(req, res) {
    try {
      const user = await UserService.createUser(req.body, req.tenantId);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
```

### Services (Lógica de Negocio)

```javascript
// ✅ BUENO: Service con lógica
const UserService = {
  async createUser(data, tenantId) {
    // Validar
    await ValidationService.validateUserData(data);
    
    // Hash password
    const hashedPassword = await hashPassword(data.password);
    
    // Crear usuario
    const user = await db.query(
      'INSERT INTO users (tenant_id, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [tenantId, data.email, hashedPassword]
    );
    
    // Enviar email de bienvenida
    await EmailService.sendWelcome(user.email);
    
    return user;
  }
};
```

### Manejo de Errores

```javascript
// ✅ BUENO: Errores específicos
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// Uso
if (!email) {
  throw new ValidationError('Email is required');
}
```

---

## ⚛️ React/Frontend

### Componentes Funcionales

```jsx
// ✅ BUENO: Componente funcional con hooks
const UserCard = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      {isEditing ? (
        <UserEditForm user={user} />
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
};
```

### Hooks Personalizados

```javascript
// ✅ BUENO: Hook reutilizable
const useUsers = (tenantId) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await api.get(`/users?tenantId=${tenantId}`);
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, [tenantId]);
  
  return { users, loading };
};
```

---

## 🔒 Seguridad

### Validación de Inputs

```javascript
// ✅ BUENO: Validar siempre
const validateUserData = (data) => {
  if (!data.email || !isValidEmail(data.email)) {
    throw new ValidationError('Invalid email');
  }
  if (!data.password || data.password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters');
  }
};
```

### Queries Parametrizadas

```javascript
// ✅ BUENO: Usar parámetros
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// ❌ MALO: Concatenación (SQL injection)
const user = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

---

## 📚 Documentación

### JSDoc

```javascript
/**
 * Crea un nuevo usuario en el sistema
 * @param {Object} data - Datos del usuario
 * @param {string} data.email - Email del usuario
 * @param {string} data.password - Contraseña sin hashear
 * @param {string} tenantId - ID del tenant
 * @returns {Promise<Object>} Usuario creado
 * @throws {ValidationError} Si los datos son inválidos
 */
const createUser = async (data, tenantId) => {
  // ...
};
```

---

## ✅ Testing

### Nombres de Tests

```javascript
// ✅ BUENO: Descriptivo
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // ...
    });
    
    it('should throw ValidationError if email is invalid', async () => {
      // ...
    });
  });
});
```

---

## 🚫 Anti-Patrones a Evitar

### ❌ Funciones Largas
```javascript
// MALO: Función de 200 líneas
const processOrder = () => {
  // ... 200 líneas de código
};

// BUENO: Dividir en funciones pequeñas
const processOrder = () => {
  validateOrder();
  calculateTotal();
  applyDiscounts();
  createInvoice();
  sendConfirmation();
};
```

### ❌ Código Duplicado
```javascript
// MALO: Duplicación
const createUser = () => {
  const hash = await bcrypt.hash(password, 10);
  // ...
};

const updatePassword = () => {
  const hash = await bcrypt.hash(newPassword, 10);
  // ...
};

// BUENO: Extraer a utilidad
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
```

---

**Última actualización**: 22 de Noviembre de 2025
