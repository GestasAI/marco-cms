const AuthService = require('../services/AuthService');

/**
 * Controller para operaciones de autenticación
 */
const AuthController = {
    /**
     * Login de usuario
     */
    async login(req, res) {
        console.log('📥 POST /api/login');
        try {
            const { email, password, tenantId } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email y password requeridos' });
            }

            const result = await AuthService.login(email, password, tenantId);

            console.log('✅ Login successful');
            res.json({ status: 'success', data: result });
        } catch (err) {
            console.error('❌ Login failed:', err.message);
            res.status(401).json({ error: err.message });
        }
    },

    /**
     * Obtiene el usuario actual
     */
    async getCurrentUser(req, res) {
        console.log('📥 GET /api/me');
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({ error: 'Token requerido' });
            }

            const user = await AuthService.getCurrentUser(token);
            res.json({ status: 'success', data: user });
        } catch (err) {
            console.error('❌ Error getting current user:', err.message);
            res.status(401).json({ error: err.message });
        }
    },

    /**
     * Logout de usuario
     */
    async logout(req, res) {
        console.log('📥 POST /api/logout');
        // Por ahora, el logout se maneja en el frontend eliminando el token
        // En el futuro, podemos usar Redis para blacklist de tokens
        res.json({ status: 'success', message: 'Logout successful' });
    }
};

module.exports = AuthController;
