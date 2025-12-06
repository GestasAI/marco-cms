# 📚 Ejemplos Completos de Plugins

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Plugin Simple: Hello World

### Estructura Mínima
```
plugin-hello/
├── manifest.json
├── package.json
├── Dockerfile
└── src/
    └── index.js
```

### manifest.json
```json
{
  "key": "plugin-hello",
  "name": "Hello Plugin",
  "version": "1.0.0",
  "network": {
    "host": "plugin-hello",
    "port": 3020
  },
  "endpoints": [
    {
      "path": "/api/hello",
      "method": "GET"
    }
  ]
}
```

### src/index.js
```javascript
const express = require('express');
const app = express();
const PORT = 3020;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Plugin!' });
});

app.listen(PORT, () => {
  console.log(`Hello Plugin running on ${PORT}`);
});
```

---

## 🗄️ Plugin con Base de Datos

### src/db/schema.sql
```sql
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### src/db/index.js
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
```

### src/services/NoteService.js
```javascript
const db = require('../db');

const NoteService = {
  async create(data, tenantId) {
    const result = await db.query(
      'INSERT INTO notes (tenant_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [tenantId, data.title, data.content]
    );
    return result.rows[0];
  },
  
  async getAll(tenantId) {
    const result = await db.query(
      'SELECT * FROM notes WHERE tenant_id = $1 ORDER BY created_at DESC',
      [tenantId]
    );
    return result.rows;
  }
};

module.exports = NoteService;
```

### src/controllers/NoteController.js
```javascript
const NoteService = require('../services/NoteService');

const NoteController = {
  async create(req, res) {
    try {
      const note = await NoteService.create(req.body, req.tenantId);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  
  async getAll(req, res) {
    const notes = await NoteService.getAll(req.tenantId);
    res.json(notes);
  }
};

module.exports = NoteController;
```

---

## 🔔 Plugin con Eventos (Pub/Sub)

### src/index.js
```javascript
const express = require('express');
const redis = require('redis').createClient({ url: process.env.REDIS_URL });

const app = express();
app.use(express.json());

// Conectar a Redis
redis.connect().then(() => {
  console.log('Connected to Redis');
  
  // Suscribirse a eventos
  const subscriber = redis.duplicate();
  subscriber.connect().then(() => {
    subscriber.subscribe('user:created', (message) => {
      const user = JSON.parse(message);
      console.log('New user created:', user);
      // Procesar evento
    });
  });
});

// Publicar evento
app.post('/api/notify', async (req, res) => {
  await redis.publish('custom:event', JSON.stringify(req.body));
  res.json({ success: true });
});

app.listen(3030);
```

---

## 🎨 Plugin con Frontend Widget

### manifest.json
```json
{
  "widgets": [
    {
      "key": "note-list",
      "name": "Note List",
      "component": "NoteListWidget",
      "route": "/notes"
    }
  ]
}
```

### Frontend: NoteListWidget.jsx
```jsx
import { useState, useEffect } from 'react';
import ConnectionManager from './services/ConnectionManager';

const api = new ConnectionManager('http://localhost:3000');

const NoteListWidget = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNotes = async () => {
      const data = await api.get('/api/plugins/plugin-notes/api/notes');
      setNotes(data);
      setLoading(false);
    };
    fetchNotes();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>Notes</h2>
      {notes.map(note => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NoteListWidget;
```

---

## 🔐 Plugin con Autenticación

### src/middleware/auth.js
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.tenantId = decoded.tenantId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

### Uso
```javascript
const authMiddleware = require('./middleware/auth');

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});
```

---

**Última actualización**: 22 de Noviembre de 2025
