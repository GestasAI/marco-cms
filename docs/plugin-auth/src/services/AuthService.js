const UserFetcher = require('./UserFetcher');
const PasswordValidator = require('./PasswordValidator');
const TokenGenerator = require('./TokenGenerator');
const formatUserResponse = require('../utils/formatUserResponse');

/**
 * Servicio orquestador de autenticación
 * Usa los servicios granulares para realizar las operaciones
 */
class AuthService {
    /**
     * Autentica un usuario con email y password
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @param {string} tenantId - ID del tenant (opcional)
     * @returns {Promise<Object>} - Token y datos del usuario
     */
    async login(email, password, tenantId = null) {
        console.log('🔐 Login attempt for:', email, 'Tenant:', tenantId);

        // 1. Buscar usuario
        const user = await UserFetcher.getUserByEmail(email, tenantId);

        if (!user) {
            console.log('❌ User not found');
            throw new Error('Credenciales inválidas');
        }

        // 2. Verificar si está activo
        if (!user.is_active) {
            console.log('❌ User is inactive');
            throw new Error('Usuario inactivo');
        }

        // 3. Validar contraseña
        const isValid = await PasswordValidator.validatePassword(password, user.password_hash);

        if (!isValid) {
            console.log('❌ Invalid password');
            throw new Error('Credenciales inválidas');
        }

        // 4. Generar token
        const token = TokenGenerator.generateToken(user);

        // 5. Actualizar último login
        await UserFetcher.updateLastLogin(user.id);

        console.log('✅ Login successful for:', user.email);

        return {
            token,
            user: formatUserResponse(user)
        };
    }

    /**
     * Obtiene el usuario actual desde un token
     * @param {string} token - Token JWT
     * @returns {Promise<Object>} - Datos del usuario
     */
    async getCurrentUser(token) {
        // 1. Verificar token
        const decoded = TokenGenerator.verifyToken(token);

        // 2. Obtener usuario actualizado de DB
        const user = await UserFetcher.getUserById(decoded.id);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        return formatUserResponse(user);
    }
}

module.exports = new AuthService();
