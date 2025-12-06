const db = require('../db');

/**
 * Middleware para verificar que el usuario sea Super Admin
 * En modo desarrollo, si el usuario mock es Super Admin, permite acceso
 */
module.exports = async (req, res, next) => {
    try {
        // Si ya sabemos que es Super Admin (del token o mock), permitir
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

        // Verificar si es Super Admin en la base de datos
        const result = await db.query(
            'SELECT is_super_admin, full_name FROM users WHERE id = $1 AND is_active = true',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                status: 'error',
                message: 'Usuario no encontrado o inactivo'
            });
        }

        if (!result.rows[0].is_super_admin) {
            return res.status(403).json({
                status: 'error',
                message: 'Acceso denegado. Esta acción requiere privilegios de Super Admin'
            });
        }

        // Adjuntar información adicional
        req.user.fullName = result.rows[0].full_name;

        next();
    } catch (error) {
        console.error('Error verificando Super Admin:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al verificar permisos de administrador'
        });
    }
};
