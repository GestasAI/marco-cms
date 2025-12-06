const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación JWT
 * Verifica que el token esté presente y sea válido
 */
module.exports = async (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Token de autenticación requerido'
            });
        }

        const token = authHeader.replace('Bearer ', '');

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gestas_secret_key_2024');

        // Adjuntar información del usuario a la request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            roleId: decoded.roleId,
            tenantId: decoded.tenantId,
            isSuperAdmin: decoded.isSuperAdmin
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Token expirado. Por favor, inicia sesión nuevamente'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'error',
                message: 'Token inválido'
            });
        }

        console.error('Error en autenticación:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al verificar autenticación'
        });
    }
};
