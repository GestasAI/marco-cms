const db = require('../db');

class RoleService {
    // Listar roles del tenant (FILTRA SuperAdmin para NO SuperAdmins)
    async listRoles(tenantId, requestingUserRole = null) {
        let query = `
            SELECT r.*, COUNT(u.id) as user_count
            FROM roles r
            LEFT JOIN users u ON u.role_id = r.id
            WHERE r.tenant_id = $1
        `;

        // RESTRICCIÓN: Los NO SuperAdmin no ven el rol SuperAdmin
        if (requestingUserRole !== 'SuperAdmin') {
            query += ` AND r.name != 'SuperAdmin'`;
        }

        query += `
            GROUP BY r.id
            ORDER BY r.created_at DESC
        `;

        const res = await db.query(query, [tenantId]);
        return res.rows;
    }

    // Obtener un rol por ID
    async getRole(roleId) {
        const res = await db.query('SELECT * FROM roles WHERE id = $1', [roleId]);
        if (res.rows.length === 0) throw new Error('Role not found');
        return res.rows[0];
    }

    // Crear un nuevo rol
    async createRole(roleData) {
        const { tenantId, name, description } = roleData;
        const res = await db.query(
            'INSERT INTO roles (tenant_id, name, description) VALUES ($1, $2, $3) RETURNING *',
            [tenantId, name, description]
        );
        return res.rows[0];
    }

    // Actualizar un rol
    async updateRole(roleId, roleData) {
        const { name, description } = roleData;
        const res = await db.query(
            'UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, roleId]
        );
        if (res.rows.length === 0) throw new Error('Role not found');
        return res.rows[0];
    }

    // Eliminar un rol
    async deleteRole(roleId) {
        const res = await db.query('DELETE FROM roles WHERE id = $1 RETURNING *', [roleId]);
        if (res.rows.length === 0) throw new Error('Role not found');
        return res.rows[0];
    }

    // Obtener permisos de un rol
    async getRolePermissions(roleId) {
        const res = await db.query(
            `SELECT p.* FROM permissions p
             JOIN role_permissions rp ON rp.permission_id = p.id
             WHERE rp.role_id = $1
             ORDER BY p.resource, p.action`,
            [roleId]
        );
        return res.rows;
    }

    // Asignar permisos a un rol
    async setRolePermissions(roleId, permissionIds) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // Eliminar permisos existentes
            await client.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);

            // Insertar nuevos permisos
            for (const permissionId of permissionIds) {
                await client.query(
                    'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
                    [roleId, permissionId]
                );
            }

            await client.query('COMMIT');
            return { success: true, count: permissionIds.length };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}

module.exports = new RoleService();