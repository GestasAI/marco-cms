const db = require('../db');

class PermissionService {
    // Listar todos los permisos disponibles
    async listPermissions() {
        const res = await db.query(
            'SELECT * FROM permissions ORDER BY resource, action'
        );
        return res.rows;
    }

    // Listar permisos agrupados por recurso
    async listPermissionsGrouped() {
        const res = await db.query(
            'SELECT * FROM permissions ORDER BY resource, action'
        );

        const grouped = {};
        res.rows.forEach(permission => {
            if (!grouped[permission.resource]) {
                grouped[permission.resource] = [];
            }
            grouped[permission.resource].push(permission);
        });

        return grouped;
    }
}

module.exports = new PermissionService();
