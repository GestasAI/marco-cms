# 🎨 Patrones de Diseño en GestasAI

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Patrones de Backend

### 1. Controller Pattern (Delgado)
```javascript
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

### 2. Service Pattern (Lógica de Negocio)
```javascript
const UserService = {
  async createUser(data, tenantId) {
    await ValidationService.validate(data);
    const hash = await hashPassword(data.password);
    const user = await UserRepository.create({ ...data, hash, tenantId });
    await EmailService.sendWelcome(user.email);
    return user;
  }
};
```

### 3. Repository Pattern (Acceso a Datos)
```javascript
const UserRepository = {
  async create(data) {
    return await db.query(
      'INSERT INTO users (tenant_id, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [data.tenantId, data.email, data.hash]
    );
  }
};
```

---

## ⚛️ Patrones de Frontend

### 1. Container/Presentational Pattern
```jsx
// Container (lógica)
const UserListContainer = () => {
  const { users, loading } = useUsers();
  return <UserList users={users} loading={loading} />;
};

// Presentational (UI)
const UserList = ({ users, loading }) => (
  <div>{loading ? <Spinner /> : users.map(u => <UserCard user={u} />)}</div>
);
```

### 2. Custom Hooks Pattern
```javascript
const useUsers = (tenantId) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers(tenantId).then(setUsers).finally(() => setLoading(false));
  }, [tenantId]);
  
  return { users, loading };
};
```

---

## 🔐 Patrones de Seguridad

### 1. Middleware de Autenticación
```javascript
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.tenantId = decoded.tenantId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 2. RBAC Pattern
```javascript
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Uso
app.post('/api/users', authMiddleware, requirePermission('users:create'), UserController.create);
```

---

**Última actualización**: 22 de Noviembre de 2025
