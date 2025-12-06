const express = require('express');
const router = express.Router();
const userAdminController = require('../controllers/userAdminController');
const roleAdminController = require('../controllers/roleAdminController');
const settingsAdminController = require('../controllers/settingsAdminController');

// Middlewares de seguridad
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const requireSuperAdmin = require('../middleware/requireSuperAdmin');

/**
 * Rutas de administración
 * Autenticación JWT con fallback a usuario mock en desarrollo
 */

// Aplicar autenticación a TODAS las rutas admin
router.use(authenticate);

// CRUD de usuarios - Requiere permisos específicos
router.get('/users',
    authorize('users:read'),
    userAdminController.getAllUsers
);
router.get('/users/:id',
    authorize('users:read'),
    userAdminController.getUserById
);
router.post('/users',
    authorize('users:create'),
    userAdminController.createUser
);
router.put('/users/:id',
    authorize('users:update'),
    userAdminController.updateUser
);
router.delete('/users/:id',
    authorize('users:delete'),
    userAdminController.deleteUser
);

// CRUD de roles - Requiere permisos específicos
router.get('/roles',
    authorize('roles:read'),
    roleAdminController.getAllRoles
);
router.get('/roles/:id',
    authorize('roles:read'),
    roleAdminController.getRoleById
);
router.post('/roles',
    authorize('roles:create'),
    roleAdminController.createRole
);
router.put('/roles/:id',
    authorize('roles:update'),
    roleAdminController.updateRole
);
router.delete('/roles/:id',
    authorize('roles:delete'),
    roleAdminController.deleteRole
);

// Permisos disponibles - Solo lectura
router.get('/permissions',
    authorize('roles:read'),
    roleAdminController.getAllPermissions
);

// Configuración del sistema - Solo Super Admin
router.get('/settings',
    requireSuperAdmin,
    settingsAdminController.getAllSettings
);
router.get('/settings/:category',
    requireSuperAdmin,
    settingsAdminController.getSettingsByCategory
);
router.put('/settings',
    requireSuperAdmin,
    settingsAdminController.updateSettings
);
router.post('/settings/reset',
    requireSuperAdmin,
    settingsAdminController.resetSettings
);

// Estadísticas del sistema - Solo lectura
router.get('/stats',
    authorize('users:read'),
    userAdminController.getSystemStats
);

module.exports = router;
