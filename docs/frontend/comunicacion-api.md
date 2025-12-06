# 🌐 Comunicación con API

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🔌 ConnectionManager

Clase centralizada para todas las peticiones HTTP:

```javascript
import axios from 'axios';

class ConnectionManager {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.client = axios.create({ baseURL });
    
    // Interceptor para agregar token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('gestas_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    // Interceptor para manejar errores
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('gestas_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
  
  async get(path) {
    const response = await this.client.get(path);
    return response.data;
  }
  
  async post(path, data) {
    const response = await this.client.post(path, data);
    return response.data;
  }
  
  async put(path, data) {
    const response = await this.client.put(path, data);
    return response.data;
  }
  
  async delete(path) {
    const response = await this.client.delete(path);
    return response.data;
  }
}

export default ConnectionManager;
```

---

## 📡 Uso en Componentes

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

// PUT
await api.put(`/api/plugins/plugin-system/api/users/${userId}`, {
  full_name: 'Updated Name'
});

// DELETE
await api.delete(`/api/plugins/plugin-system/api/users/${userId}`);
```

---

## ⚠️ Manejo de Errores

```javascript
try {
  const users = await api.get('/api/users');
  setUsers(users);
} catch (error) {
  if (error.response) {
    // Error del servidor
    setError(error.response.data.error);
  } else if (error.request) {
    // Sin respuesta del servidor
    setError('Server not responding');
  } else {
    // Error en la configuración
    setError('Request error');
  }
}
```

---

**Última actualización**: 22 de Noviembre de 2025
