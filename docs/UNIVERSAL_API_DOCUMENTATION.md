# 🌐 GestasAI Universal API Documentation

**Version**: 1.0  
**Status**: Active  
**Base Endpoint**: `https://gestasai.com/api/universal`

The **Universal API** is the agnostic gateway that allows any external system (React, Flutter, Python, PHP, Legacy ERPs, etc.) to integrate with the GestasAI ecosystem as a first-class citizen, regardless of where it is hosted.

---

## 🔐 Authentication & Handshake

The integration starts with a **Handshake**. Your external system must register itself to obtain a session token.

### 1. Register Plugin (Handshake)
**Endpoint**: `POST /register`  
**URL**: `https://gestasai.com/api/universal/register`

**Body (Manifest JSON):**
```json
{
  "manifest": {
    "key": "my-external-system",
    "name": "My External ERP",
    "version": "1.0.0",
    "description": "External ERP system connected via Universal Bridge",
    "category": "BUSINESS",
    "type": "CLIENT",
    "author": "My Company",
    "homepage": "https://my-erp.com",
    "icon": "Server",
    "network": {
      "strategy": "external",
      "host": "my-erp.com",
      "port": 443,
      "health_check": "/health"
    },
    "capabilities": [
      "universal_api:query",
      "universal_api:insert",
      "universal_api:update"
    ]
  }
}
```

**Response (200 OK):**
```json
{
  "status": "registered",
  "token": "eyJhbGciOiJIUzI1Ni...", // ⚠️ SAVE THIS TOKEN
  "pluginKey": "my-external-system"
}
```

> **Note**: Include this `token` in the `Authorization: Bearer <token>` header for all subsequent requests.

---

## 💓 Lifecycle Management

### 2. Send Heartbeat
**Endpoint**: `POST /heartbeat`  
**URL**: `https://gestasai.com/api/universal/heartbeat`  
**Frequency**: Every 30 seconds.

**Body:**
```json
{
  "key": "my-external-system"
}
```

**Response:**
```json
{ "status": "acknowledged" }
```

---

## 💾 Data Access (ACIDE Engine)

Access the unified data layer (GestasCore-ACIDE) to read/write data securely.

### 3. Query Data
**Endpoint**: `POST /data/query`  
**URL**: `https://gestasai.com/api/universal/data/query`

**Body:**
```json
{
  "collection": "users",
  "query": {
    "where": { "role": "admin" },
    "limit": 10
  }
}
```

### 4. Insert Data
**Endpoint**: `POST /data/insert`  
**URL**: `https://gestasai.com/api/universal/data/insert`

**Body:**
```json
{
  "collection": "products",
  "document": {
    "name": "New Product",
    "sku": "PROD-001",
    "price": 99.99,
    "stock": 100
  }
}
```

### 5. Update Data
**Endpoint**: `POST /data/update`  
**URL**: `https://gestasai.com/api/universal/data/update`

**Body:**
```json
{
  "collection": "products",
  "where": { "sku": "PROD-001" },
  "updates": {
    "price": 89.99
  }
}
```

---

## 🔌 Ecosystem Discovery

### 6. List Available Plugins
**Endpoint**: `GET /plugins`  
**URL**: `https://gestasai.com/api/universal/plugins`

**Response:**
```json
{
  "plugins": [
    {
      "key": "plugin-auth",
      "name": "Authentication",
      "status": "ONLINE",
      "network": { ... }
    },
    {
      "key": "my-external-system",
      "name": "My External ERP",
      "status": "ONLINE",
      "network": { ... }
    }
  ]
}
```

---

## 🛠️ Implementation Example (Node.js)

```javascript
const axios = require('axios');

const API_URL = 'https://gestasai.com/api/universal';
const MANIFEST = require('./manifest.json');

async function start() {
  // 1. Register
  const reg = await axios.post(`${API_URL}/register`, { manifest: MANIFEST });
  const token = reg.data.token;
  console.log('✅ Registered! Token:', token);

  // 2. Setup Heartbeat
  setInterval(() => {
    axios.post(`${API_URL}/heartbeat`, { key: MANIFEST.key });
  }, 30000);

  // 3. Query Data
  const users = await axios.post(
    `${API_URL}/data/query`, 
    { collection: 'users', query: {} },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('Users:', users.data);
}

start();
```
