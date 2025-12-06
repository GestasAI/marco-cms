const db = require('../db');

/**
 * Middleware de autorización basado en permisos
 * En modo desarrollo, si no hay usuario real, usa el mock de Super Admin
 * @param {string|string[]} requiredPermissions - Permisos requeridos para acceder
 * @returns {Function} Middleware function
 */
module.exports = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            // Si es Super Admin (real o mock), permitir acceso
            if (req.user && req.user.isSuperAdmin) {
                return next();
            }

            const userId = req.user?.id;

            if (!userId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Usuario no autenticado'
                });
            }

            // Obtener usuario con rol
            const userResult = await db.query(`
                SELECT 
                    u.id,
                    u.is_super_admin,
                    r.id as role_id,
                    r.name as role_name
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id
                WHERE u.id = $1 AND u.is_active = true
            `, [userId]);

            if (userResult.rows.length === 0) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Usuario no encontrado o inactivo'
                });
            }

            const user = userResult.rows[0];

            // Super Admin tiene acceso total
            if (user.is_super_admin) {
                req.user.role = {
                    id: user.role_id,
                    name: user.role_name
                };
                return next();
            }

            // Si no tiene rol asignado, denegar acceso
            if (!user.role_id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Usuario sin rol asignado'
                });
            }

            // Obtener permisos del rol
            const permissionsResult = await db.query(`
                SELECT p.name
                FROM permissions p
                INNER JOIN role_permissions rp ON p.id = rp.permission_id
                WHERE rp.role_id = $1
            `, [user.role_id]);

            const userPermissions = permissionsResult.rows.map(p => p.name);

            // Convertir a array si es string único
            const permissions = Array.isArray(requiredPermissions)
                ? requiredPermissions
                : [requiredPermissions];

            // Verificar si el usuario tiene al menos uno de los permisos requeridos
            const hasPermission = permissions.some(perm =>
                userPermissions.includes(perm)
            );

            if (!hasPermission) {
                return res.status(403).json({
                    status: 'error',
                    message: 'No tienes permisos para realizar esta acción',
                    required: permissions,
                    current: userPermissions
                });
            }

            // Adjuntar información del rol y permisos
            req.user.role = {
                id: user.role_id,
                name: user.role_name
            };
            req.user.permissions = userPermissions;

            next();
        } catch (error) {
            console.error('Error en autorización:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al verificar permisos'
            });
        }
    };
};
