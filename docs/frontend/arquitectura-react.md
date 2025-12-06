# ⚛️ Arquitectura React

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Stack Tecnológico

- **React 18** - UI library
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM 6** - Enrutamiento
- **Tailwind CSS** - Estilos utility-first
- **Lucide React** - Iconos SVG

---

## 📊 Estructura del Proyecto

```
frontend/shell/
├── public/
├── src/
│   ├── App.tsx                 # Componente raíz
│   ├── main.tsx                # Entry point
│   ├── /components
│   │   ├── /auth
│   │   │   └── ProtectedRoute.tsx
│   │   ├── /layout
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── /widgets
│   │       ├── UserListWidget.jsx
│   │       ├── RoleListWidget.jsx
│   │       └── LoginWidget.jsx
│   ├── /services
│   │   └── ConnectionManager.js
│   ├── /hooks
│   │   ├── useAuth.js
│   │   └── useUsers.js
│   └── /styles
│       └── index.css
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🔄 Flujo de la Aplicación

```
1. Usuario accede a /
        ↓
2. ProtectedRoute verifica autenticación
        ↓
3. Si no autenticado → Redirige a /login
   Si autenticado → Renderiza Dashboard
        ↓
4. Dashboard carga widgets
        ↓
5. Widgets hacen requests a API
        ↓
6. ConnectionManager maneja HTTP
```

---

## 🎨 Patrones de Componentes

### 1. Componentes Funcionales
Todos los componentes son funcionales con hooks:

```tsx
const UserCard: React.FC<{ user: User }> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="user-card">
      <h3>{user.fullName}</h3>
    </div>
  );
};
```

### 2. Custom Hooks
Lógica reutilizable en hooks:

```typescript
const useUsers = (tenantId: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers(tenantId)
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [tenantId]);
  
  return { users, loading };
};
```

### 3. Container/Presentational
Separar lógica de UI:

```tsx
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

---

## 🛣️ Enrutamiento

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginWidget />} />
    
    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
      <Route index element={<Home />} />
      <Route path="users" element={<UserListWidget />} />
      <Route path="roles" element={<RoleListWidget />} />
    </Route>
  </Routes>
</BrowserRouter>
```

---

## 📦 Gestión de Estado

### Local State (useState)
Para estado de componente:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ email: '', password: '' });
```

### Context API (Futuro)
Para estado global:

```tsx
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🔌 Comunicación con API

Centralizada en `ConnectionManager`:

```javascript
import ConnectionManager from './services/ConnectionManager';

const api = new ConnectionManager('http://localhost:3000');

// GET
const users = await api.get('/api/plugins/plugin-system/api/users?tenantId=123');

// POST
const newUser = await api.post('/api/plugins/plugin-system/api/users', {
  email: 'user@example.com',
  password: 'password123'
});
```

---

## 🎨 Estilos con Tailwind

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-800">Users</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Add User
  </button>
</div>
```

---

## 📖 Próximos Pasos

- [Componentes Base](./componentes-base.md)
- [Widgets](./widgets.md)
- [Rutas Protegidas](./rutas-protegidas.md)

---

**Última actualización**: 22 de Noviembre de 2025
