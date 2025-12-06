# GestasAI - Port Assignment Strategy

**Date**: 22 de Noviembre de 2025  
**Version**: 1.0

---

## 🔢 Port Numbering Strategy

### Core Services (4000-4999)
- **4000**: Core System (Backend System)
- **4001**: Reserved for future core service
- **4002**: Reserved for future core service

### Gateway (3000-3999)
- **3000**: API Gateway (Main entry point)

### Plugins (5000-5999)
- **5000**: plugin-auth
- **5001**: plugin-content
- **5002**: plugin-system
- **5003**: plugin-notifications (future)
- **5004**: plugin-analytics (future)
- **5005**: plugin-files (future)
- **5006**: plugin-config (future)
- **5007**: plugin-products (future)
- **5008**: plugin-payments (future)
- **5009**: plugin-shipping (future)
- **5010**: plugin-courses (future)
- **5011-5099**: Reserved for future plugins

### Frontend (5100-5199)
- **5173**: Frontend Shell (Vite default)

### Infrastructure (6000-6999)
- **5432**: PostgreSQL (internal)
- **6379**: Redis (internal)

---

## 📋 Current Port Assignments

| Service | Port | Status |
|---------|------|--------|
| API Gateway | 3000 | ✅ Active |
| Core System | 4000 | ✅ Active |
| plugin-auth | 5000 | 🔄 To Update |
| plugin-content | 5001 | 🔄 To Update |
| plugin-system | 5002 | 🔄 To Update |
| Frontend | 5173 | ✅ Active |

---

## 🔧 How to Assign New Plugin Port

### Automatic (Recommended)
```powershell
# Script automatically assigns next available port
.\scripts\create-plugin.ps1 -Name myPlugin
# Output: Assigned port 5003
```

### Manual
1. Check this document for next available port
2. Update manifest.json: `"port": 5003`
3. Update docker-compose.yml: `"5003:5003"`
4. Update .env: `PORT=5003`
5. Update this document

---

## ⚠️ Port Conflicts to Avoid

**Never use these ports:**
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 3306 (MySQL)
- 5432 (PostgreSQL)
- 6379 (Redis)
- 8080 (Common HTTP alt)
- 9000 (Common services)

**Safe ranges:**
- 5000-5999 (Plugins)
- 7000-7999 (Custom services)
- 8000-8999 (Development)

---

**Last Updated**: 22 de Noviembre de 2025
