# 🔒 Rutas Protegidas

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 ProtectedRoute Component

```tsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('gestas_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
```

---

## 🛣️ Uso en Rutas

```tsx
<Routes>
  {/* Ruta pública */}
  <Route path="/login" element={<LoginWidget />} />
  
  {/* Rutas protegidas */}
  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
    <Route index element={<Home />} />
    <Route path="users" element={<UserListWidget />} />
    <Route path="roles" element={<RoleListWidget />} />
  </Route>
</Routes>
```

---

## 🔐 Verificación de Permisos

```tsx
interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  const user = JSON.parse(localStorage.getItem('gestas_user') || '{}');
  const hasPermission = user.permissions?.includes(permission);
  
  return hasPermission ? children : fallback;
};

// Uso
<PermissionGuard permission="users:create">
  <Button onClick={handleCreate}>Create User</Button>
</PermissionGuard>
```

---

## 🔄 Auto-Logout en Token Expirado

```tsx
// En ConnectionManager.js
const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('gestas_token');
    localStorage.removeItem('gestas_user');
    window.location.href = '/login';
  }
  return response;
};
```

---

**Última actualización**: 22 de Noviembre de 2025
