# 🎨 Widgets

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 ¿Qué es un Widget?

Un **widget** es un componente autónomo que encapsula una funcionalidad completa, incluyendo:
- UI
- Lógica de negocio
- Comunicación con API
- Gestión de estado local

---

## 📦 Estructura de un Widget

```
UserListWidget/
├── index.jsx              # Componente principal
├── UserTable.jsx          # Tabla de usuarios
├── UserModal.jsx          # Modal crear/editar
├── UserForm.jsx           # Formulario
├── useUserData.js         # Hook personalizado
└── styles.css             # Estilos específicos (si aplica)
```

---

## 🔍 Ejemplo: UserListWidget

### index.jsx (Orquestador)
```jsx
const UserListWidget = () => {
  const { users, loading, createUser, updateUser, deleteUser } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  return (
    <div className="user-list-widget">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add User</Button>
      </div>
      
      {loading ? (
        <Spinner />
      ) : (
        <UserTable 
          users={users} 
          onEdit={(user) => {
            setSelectedUser(user);
            setIsModalOpen(true);
          }}
          onDelete={deleteUser}
        />
      )}
      
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={selectedUser ? updateUser : createUser}
      />
    </div>
  );
};
```

### useUserData.js (Hook)
```javascript
const useUserData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const tenantId = JSON.parse(localStorage.getItem('gestas_user'))?.tenantId;
  
  const fetchUsers = async () => {
    const data = await api.get(`/api/plugins/plugin-system/api/users?tenantId=${tenantId}`);
    setUsers(data);
    setLoading(false);
  };
  
  const createUser = async (userData) => {
    await api.post('/api/plugins/plugin-system/api/users', userData);
    fetchUsers();
  };
  
  const updateUser = async (userId, userData) => {
    await api.put(`/api/plugins/plugin-system/api/users/${userId}`, userData);
    fetchUsers();
  };
  
  const deleteUser = async (userId) => {
    await api.delete(`/api/plugins/plugin-system/api/users/${userId}`);
    fetchUsers();
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  return { users, loading, createUser, updateUser, deleteUser };
};
```

---

## 🎭 Widgets Existentes

### 1. LoginWidget
- Autenticación de usuarios
- Detección de tenant
- Selector manual (localhost)
- OAuth (preparado)

### 2. UserListWidget
- CRUD de usuarios
- Tabla con paginación
- Modal de creación/edición
- Filtros y búsqueda

### 3. RoleListWidget
- CRUD de roles
- Gestión de permisos
- Tabla de roles
- Modal de permisos

---

## 🔧 Widgets Planificados

### 4. PageListWidget (CMS)
- Lista de páginas
- Filtros por estado
- Búsqueda
- Acciones rápidas

### 5. VisualEditorWidget (Site Builder)
- Editor drag-and-drop (GrapesJS)
- Panel de componentes
- Preview responsive
- Guardar/Publicar

### 6. MediaLibraryWidget
- Grid de archivos
- Upload drag-and-drop
- Búsqueda
- Copiar URL

---

## 📐 Principios de Diseño de Widgets

1. **Autónomo**: No depende de otros widgets
2. **Reutilizable**: Puede usarse en múltiples contextos
3. **Granular**: Dividido en componentes pequeños
4. **Comunicativo**: Usa hooks para lógica
5. **Estilizado**: Usa Tailwind CSS
6. **Tipado**: TypeScript cuando sea posible

---

**Última actualización**: 22 de Noviembre de 2025
