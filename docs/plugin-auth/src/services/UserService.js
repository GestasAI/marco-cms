const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
    async createUser(userData) {
        const { email, password, fullName, tenantId, roleId } = userData;
        const hash = await bcrypt.hash(password, 10);

        // Si no se proporciona roleId, buscar el rol "Visor" por defecto
        let finalRoleId = roleId;
        if (!finalRoleId && tenantId) {
            const visorRole = await db.query(
                'SELECT id FROM roles WHERE tenant_id = $1 AND name = $2',
                [tenantId, 'Visor']
            );
            if (visorRole.rows.length > 0) {
                finalRoleId = visorRole.rows[0].id;
                console.log('✅ Asignando rol Visor por defecto:', finalRoleId);
            }
        }

        const res = await db.query(
            'INSERT INTO users (email, password_hash, full_name, tenant_id, role_id, is_active) VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING id, email, full_name, tenant_id, role_id, is_active',
            [email, hash, fullName, tenantId || null, finalRoleId || null]
        );
        return res.rows[0];
    }

    async updateUser(userId, userData) {
        const { email, fullName, roleId } = userData;
        const res = await db.query(
            'UPDATE users SET email = $1, full_name = $2, role_id = $3 WHERE id = $4 RETURNING id, email, full_name, tenant_id, role_id, is_active',
            [email, fullName, roleId || null, userId]
        );
        if (res.rows.length === 0) throw new Error('User not found');
        return res.rows[0];
    }

    async deleteUser(userId) {
        const res = await db.query('DELETE FROM users WHERE id = $1 RETURNING id, email', [userId]);
        if (res.rows.length === 0) throw new Error('User not found');
        return res.rows[0];
    }

    async toggleActive(userId) {
        const res = await db.query(
            'UPDATE users SET is_active = NOT is_active WHERE id = $1 RETURNING id, email, is_active',
            [userId]
        );
        if (res.rows.length === 0) throw new Error('User not found');
        return res.rows[0];
    }

    async authenticate(email, password) {
        const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (res.rows.length === 0) throw new Error('User not found');

        const user = res.rows[0];

        if (!user.is_active) throw new Error('User is inactive');

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) throw new Error('Invalid password');

        const token = jwt.sign(
            { id: user.id, email: user.email, isSuperAdmin: user.is_super_admin, roleId: user.role_id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '8h' }
        );

        return { user: { id: user.id, email: user.email, name: user.full_name }, token };
    }

    async listUsers(tenantId = null, requestingUserRole = null) {
        let query = `
            SELECT u.id, u.email, u.full_name, u.tenant_id, u.is_super_admin, u.is_active, u.last_login, u.role_id, r.name as role_name
            FROM users u
            LEFT JOIN roles r ON r.id = u.role_id
        `;
        const params = [];
        const conditions = [];

        if (tenantId) {
            conditions.push('u.tenant_id = $' + (params.length + 1));
            params.push(tenantId);
        }

        // RESTRICCIÓN: Los NO SuperAdmin no ven usuarios SuperAdmin
        if (requestingUserRole !== 'SuperAdmin') {
            conditions.push('u.is_super_admin = FALSE');
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY u.created_at DESC';

        console.log('🔍 Executing listUsers query:', query, 'Params:', params);
        try {
            const res = await db.query(query, params);
            console.log(`✅ Query successful. Rows: ${res.rows.length}`);
            return res.rows;
        } catch (err) {
            console.error('❌ Query failed:', err);
            throw err;
        }
    }
}

module.exports = new UserService();