# 🎭 Patrones UX

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Principios de UX

1. **Feedback Inmediato** - El usuario siempre sabe qué está pasando
2. **Consistencia** - Mismos patrones en toda la app
3. **Prevención de Errores** - Validación antes de enviar
4. **Recuperación de Errores** - Mensajes claros y acciones sugeridas
5. **Eficiencia** - Minimizar clicks y pasos

---

## ⏳ Estados de Carga

### Spinner
```tsx
{loading && <Spinner />}
```

### Skeleton
```tsx
{loading ? (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
) : (
  <UserCard user={user} />
)}
```

### Botón con Loading
```tsx
<button disabled={loading}>
  {loading ? 'Saving...' : 'Save'}
</button>
```

---

## ✅ Feedback de Acciones

### Toast Notifications
```tsx
const [toast, setToast] = useState(null);

const showToast = (message, type) => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};

// Uso
showToast('User created successfully', 'success');
```

### Confirmación de Eliminación
```tsx
const handleDelete = async (userId) => {
  if (window.confirm('Are you sure you want to delete this user?')) {
    await deleteUser(userId);
    showToast('User deleted', 'success');
  }
};
```

---

## 📝 Validación de Formularios

### Validación en Tiempo Real
```tsx
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (value) => {
  if (!value) {
    setEmailError('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(value)) {
    setEmailError('Email is invalid');
  } else {
    setEmailError('');
  }
};

<Input
  value={email}
  onChange={(value) => {
    setEmail(value);
    validateEmail(value);
  }}
  error={emailError}
/>
```

---

## 🔍 Búsqueda y Filtros

### Debounced Search
```tsx
const [searchTerm, setSearchTerm] = useState('');
const [debouncedTerm, setDebouncedTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm);
  }, 300);
  
  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  if (debouncedTerm) {
    searchUsers(debouncedTerm);
  }
}, [debouncedTerm]);
```

---

## 📄 Paginación

```tsx
const [page, setPage] = useState(1);
const [pageSize] = useState(20);

<div className="flex justify-between items-center mt-4">
  <button 
    onClick={() => setPage(p => Math.max(1, p - 1))}
    disabled={page === 1}
  >
    Previous
  </button>
  <span>Page {page}</span>
  <button onClick={() => setPage(p => p + 1)}>
    Next
  </button>
</div>
```

---

## ♿ Accesibilidad

### Labels y ARIA
```tsx
<label htmlFor="email">Email</label>
<input 
  id="email"
  aria-label="Email address"
  aria-required="true"
/>
```

### Keyboard Navigation
```tsx
<button 
  onClick={handleClick}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
>
  Submit
</button>
```

---

**Última actualización**: 22 de Noviembre de 2025
