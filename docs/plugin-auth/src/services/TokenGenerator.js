const jwt = require('jsonwebtoken');

/**
 * Servicio para generar y verificar tokens JWT
 */
class TokenGenerator {
    constructor() {
        this.secret = process.env.JWT_SECRET || 'gestas_secret_key_change_me';
        this.expiresIn = '8h';
    }

    /**
     * Genera un token JWT para un usuario
     * @param {Object} user - Datos del usuario
     * @returns {string} - Token JWT
     */
    generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                tenantId: user.tenant_id,
                roleId: user.role_id,
                roleName: user.role_name,
                isSuperAdmin: user.is_super_admin || false
            },
            this.secret,
            { expiresIn: this.expiresIn }
        );
    }

    /**
     * Verifica un token JWT
     * @param {string} token - Token a verificar
     * @returns {Object} - Payload del token
     * @throws {Error} - Si el token es inválido
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (err) {
            throw new Error('Token inválido o expirado');
        }
    }
}

module.exports = new TokenGenerator();
