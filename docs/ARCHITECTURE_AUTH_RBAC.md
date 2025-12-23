# Arquitectura de Autenticación y RBAC - Marco CMS

Este documento detalla el sistema de Control de Acceso Basado en Roles (RBAC) y la arquitectura de gestión de usuarios de Marco CMS, diseñado para ser interpretado por desarrolladores e Inteligencias Artificiales.

## 🏗️ Estructura del Sistema (Patrón Controller-Service)

El sistema sigue una arquitectura desacoplada para garantizar la modularidad y la facilidad de mantenimiento.

### 1. Capa de Servicios (Lógica de Negocio)
Ubicación: `packages/plugin-auth/src/services/`

- **`UserAdminService.js`**: Centraliza la gestión de usuarios. Maneja consultas SQL, validaciones de negocio y el mapeo de roles entre la base de datos y el frontend.
- **`RoleAdminService.js`**: Gestiona la creación de roles y la asignación granular de permisos. Incluye lógica de agrupación de permisos por recursos.
- **`UserService.js` / `AuthService.js`**: Servicios base para autenticación y operaciones de usuario estándar.

### 2. Capa de Controladores (Interfaz API)
Ubicación: `packages/plugin-auth/src/controllers/`

- **`userAdminController.js`**: Punto de entrada para las rutas de administración de usuarios. Delega toda la lógica pesada al `UserAdminService`.
- **`roleAdminController.js`**: Punto de entrada para la gestión de roles. Delega al `RoleAdminService`.

---

## 👥 Jerarquía de Roles y Capacidades

El sistema utiliza un mapeo dinámico para traducir los nombres de la base de datos a identificadores de frontend:

| Rol (BD) | ID Frontend | Capacidades Principales |
| :--- | :--- | :--- |
| **SuperAdmin** | `super_admin` | Control total del sistema, gestión de todos los usuarios y roles. |
| **Administrador** | `admin` | Gestión de usuarios y roles (excepto SuperAdmin), configuración del sistema. |
| **Editor** | `editor` | Gestión de contenido (Posts, Páginas, Medios, SEO, Temas). |
| **Visor / Cliente** | `viewer` / `client` | Acceso de solo lectura al Dashboard y acceso a la Academia. |

---

## 🔐 Seguridad y Acceso (Frontend)

### Protecciones de Ruta (`App.jsx`)
- El componente `ProtectedRoute` valida el token JWT.
- Permite el acceso al `/dashboard` a cualquier rol válido (`isViewer()` o superior).
- La seguridad granular se aplica dentro de cada componente.

### Visibilidad Dinámica (`Sidebar.jsx` / `Dashboard.jsx`)
- **Menú Lateral**: Se filtra usando `authService.isEditor()` o `authService.isAdmin()`.
- **Estadísticas**: Las tarjetas sensibles (ej. conteo de usuarios) solo se muestran a administradores.
- **Documentación**: Solo visible para administradores.

---

## 🛠️ Guía de Restauración y Mantenimiento

### En caso de error en la lógica de roles:
1. Verificar el mapeo en `UserAdminService.js` (método `roleReverseMapping`).
2. Asegurar que el `authService.js` en el frontend esté recibiendo correctamente el `roleName` desde el backend.
3. El backend siempre debe devolver el `roleName` (CamelCase) y `isSuperAdmin` (booleano) en el objeto de usuario.

### Base de Datos:
- Las tablas principales son `users`, `roles`, `permissions` y `role_permissions`.
- La relación es `users.role_id -> roles.id` y `role_permissions` como tabla intermedia para permisos granulares.

---

## 🤖 Notas para IAs
Para modificar este sistema, siempre mantenga la lógica de negocio en los **Servicios** y mantenga los **Controladores** como simples pasarelas de red. No duplique la lógica de mapeo de roles; centralícela en `UserAdminService.formatUserForAdmin`.
