const db = require('../db');

/**
 * Servicio para obtener usuarios de la base de datos
 */
class UserFetcher {
    /**
     * Obtiene un usuario por email
     * @param {string} email - Email del usuario
     * @param {string} tenantId - ID del tenant (opcional)
     * @returns {Promise<Object|null>} - Usuario encontrado o null
     */
    async getUserByEmail(email, tenantId = null) {
        let query = `
      SELECT u.*, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON r.id = u.role_id 
      WHERE u.email = $1
    `;
        const params = [email];

        if (tenantId) {
            query += ' AND u.tenant_id = $2';
            params.push(tenantId);
        }

        const result = await db.query(query, params);
        return result.rows[0] || null;
    }

    /**
     * Obtiene un usuario por ID
     * @param {string} userId - UUID del usuario
     * @returns {Promise<Object|null>} - Usuario encontrado o null
     */
    async getUserById(userId) {
        const result = await db.query(
            `SELECT u.id, u.email, u.full_name, u.tenant_id, u.role_id, u.is_super_admin, u.is_active, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1`,
            [userId]
        );

        return result.rows[0] || null;
    }

    /**
     * Actualiza el último login del usuario
     * @param {string} userId - UUID del usuario
     */
    async updateLastLogin(userId) {
        await db.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [userId]
        );
    }
}

module.exports = new UserFetcher();
