const db = require('../db');

/**
 * Controlador de administración de roles
 * CRUD completo para el Super Admin Dashboard
 */

// Obtener todos los roles con sus permisos
exports.getAllRoles = async (req, res) => {
    try {
        // Obtener roles
        const rolesResult = await db.query(`
            SELECT 
                r.id,
                r.tenant_id,
                r.name,
                r.description,
                r.is_system_role,
                r.created_at,
                COUNT(DISTINCT rp.permission_id) as permission_count
            FROM roles r
            LEFT JOIN role_permissions rp ON r.id = rp.role_id
            GROUP BY r.id, r.tenant_id, r.name, r.description, r.is_system_role, r.created_at
            ORDER BY r.created_at DESC
        `);

        // Para cada rol, obtener sus permisos
        const rolesWithPermissions = await Promise.all(
            rolesResult.rows.map(async (role) => {
                const permissionsResult = await db.query(`
                    SELECT 
                        p.id,
                        p.name,
                        p.resource,
                        p.action,
                        p.description
                    FROM permissions p
                    INNER JOIN role_permissions rp ON p.id = rp.permission_id
                    WHERE rp.role_id = $1
                    ORDER BY p.resource, p.action
                `, [role.id]);

                return {
                    id: role.id,
                    name: role.name,
                    description: role.description,
                    isSystemRole: role.is_system_role,
                    permissionCount: parseInt(role.permission_count),
                    permissions: permissionsResult.rows.map(p => ({
                        id: p.id,
                        name: p.name,
                        resource: p.resource,
                        action: p.action,
                        description: p.description
                    })),
                    createdAt: role.created_at
                };
            })
        );

        res.json({
            status: 'success',
            data: rolesWithPermissions
        });
    } catch (error) {
        console.error('Error getting roles:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Obtener un rol por ID
exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;

        const roleResult = await db.query(`
            SELECT 
                id,
                tenant_id,
                name,
                description,
                is_system_role,
                created_at
            FROM roles
            WHERE id = $1
        `, [id]);

        if (roleResult.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Rol no encontrado'
            });
        }

        const role = roleResult.rows[0];

        // Obtener permisos del rol
        const permissionsResult = await db.query(`
            SELECT 
                p.id,
                p.name,
                p.resource,
                p.action,
                p.description
            FROM permissions p
            INNER JOIN role_permissions rp ON p.id = rp.permission_id
            WHERE rp.role_id = $1
            ORDER BY p.resource, p.action
        `, [id]);

        res.json({
            status: 'success',
            data: {
                id: role.id,
                name: role.name,
                description: role.description,
                isSystemRole: role.is_system_role,
                permissions: permissionsResult.rows.map(p => ({
                    id: p.id,
                    name: p.name,
                    resource: p.resource,
                    action: p.action,
                    description: p.description
                })),
                createdAt: role.created_at
            }
        });
    } catch (error) {
        console.error('Error getting role:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Crear nuevo rol
exports.createRole = async (req, res) => {
    try {
        const { name, description, tenantId, permissions } = req.body;

        // Validaciones
        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'El nombre del rol es requerido'
            });
        }

        // Usar tenant por defecto si no se especifica
        const finalTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

        // Verificar si el rol ya existe para este tenant
        const existingRole = await db.query(
            'SELECT id FROM roles WHERE name = $1 AND tenant_id = $2',
            [name, finalTenantId]
        );

        if (existingRole.rows.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Ya existe un rol con ese nombre para este tenant'
            });
        }

        // Crear el rol
        const roleResult = await db.query(`
            INSERT INTO roles (tenant_id, name, description, is_system_role)
            VALUES ($1, $2, $3, false)
            RETURNING id, tenant_id, name, description, is_system_role, created_at
        `, [finalTenantId, name, description || null]);

        const newRole = roleResult.rows[0];

        // Asignar permisos si se proporcionaron
        if (permissions && Array.isArray(permissions) && permissions.length > 0) {
            for (const permissionId of permissions) {
                await db.query(
                    'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [newRole.id, permissionId]
                );
            }
        }

        // Obtener permisos asignados
        const permissionsResult = await db.query(`
            SELECT 
                p.id,
                p.name,
                p.resource,
                p.action,
                p.description
            FROM permissions p
            INNER JOIN role_permissions rp ON p.id = rp.permission_id
            WHERE rp.role_id = $1
        `, [newRole.id]);

        res.status(201).json({
            status: 'success',
            message: 'Rol creado correctamente',
            data: {
                id: newRole.id,
                name: newRole.name,
                description: newRole.description,
                isSystemRole: newRole.is_system_role,
                permissions: permissionsResult.rows.map(p => ({
                    id: p.id,
                    name: p.name,
                    resource: p.resource,
                    action: p.action,
                    description: p.description
                })),
                createdAt: newRole.created_at
            }
        });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Actualizar rol
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, permissions } = req.body;

        // Verificar que el rol existe
        const existingRole = await db.query(
            'SELECT id, is_system_role, name FROM roles WHERE id = $1',
            [id]
        );

        if (existingRole.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Rol no encontrado'
            });
        }

        const role = existingRole.rows[0];

        // Proteger roles del sistema contra cambio de nombre
        if (role.is_system_role && name && name !== role.name) {
            return res.status(403).json({
                status: 'error',
                message: 'No se puede cambiar el nombre de un rol del sistema'
            });
        }

        // Actualizar rol
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (name && !role.is_system_role) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }

        if (description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(description);
        }

        if (updates.length > 0) {
            values.push(id);
            const query = `
                UPDATE roles 
                SET ${updates.join(', ')}
                WHERE id = $${paramCount}
                RETURNING id, name, description, is_system_role, created_at
            `;
            await db.query(query, values);
        }

        // Actualizar permisos si se proporcionaron
        if (permissions && Array.isArray(permissions)) {
            // Eliminar permisos actuales
            await db.query('DELETE FROM role_permissions WHERE role_id = $1', [id]);

            // Asignar nuevos permisos
            for (const permissionId of permissions) {
                await db.query(
                    'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [id, permissionId]
                );
            }
        }

        // Obtener rol actualizado con permisos
        const updatedRoleResult = await db.query(`
            SELECT 
                id,
                name,
                description,
                is_system_role,
                created_at
            FROM roles
            WHERE id = $1
        `, [id]);

        const updatedRole = updatedRoleResult.rows[0];

        const permissionsResult = await db.query(`
            SELECT 
                p.id,
                p.name,
                p.resource,
                p.action,
                p.description
            FROM permissions p
            INNER JOIN role_permissions rp ON p.id = rp.permission_id
            WHERE rp.role_id = $1
        `, [id]);

        res.json({
            status: 'success',
            message: 'Rol actualizado correctamente',
            data: {
                id: updatedRole.id,
                name: updatedRole.name,
                description: updatedRole.description,
                isSystemRole: updatedRole.is_system_role,
                permissions: permissionsResult.rows.map(p => ({
                    id: p.id,
                    name: p.name,
                    resource: p.resource,
                    action: p.action,
                    description: p.description
                })),
                createdAt: updatedRole.created_at
            }
        });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Eliminar rol
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el rol existe
        const role = await db.query(
            'SELECT id, name, is_system_role FROM roles WHERE id = $1',
            [id]
        );

        if (role.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Rol no encontrado'
            });
        }

        // Proteger roles del sistema
        if (role.rows[0].is_system_role) {
            return res.status(403).json({
                status: 'error',
                message: 'No se puede eliminar un rol del sistema'
            });
        }

        // Verificar si hay usuarios con este rol
        const usersWithRole = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE role_id = $1',
            [id]
        );

        if (parseInt(usersWithRole.rows[0].count) > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No se puede eliminar el rol porque hay usuarios asignados a él'
            });
        }

        // Eliminar permisos del rol
        await db.query('DELETE FROM role_permissions WHERE role_id = $1', [id]);

        // Eliminar rol
        await db.query('DELETE FROM roles WHERE id = $1', [id]);

        res.json({
            status: 'success',
            message: 'Rol eliminado correctamente'
        });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Obtener todos los permisos disponibles
exports.getAllPermissions = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                id,
                name,
                resource,
                action,
                description
            FROM permissions
            ORDER BY resource, action
        `);

        // Agrupar permisos por recurso para el frontend
        const groupedPermissions = {};

        result.rows.forEach(permission => {
            const resource = permission.resource;

            if (!groupedPermissions[resource]) {
                groupedPermissions[resource] = {
                    label: getResourceLabel(resource),
                    actions: []
                };
            }

            groupedPermissions[resource].actions.push({
                id: permission.name, // Usar 'name' como ID (ej: 'users:create')
                label: getActionLabel(permission.action, resource),
                description: permission.description
            });
        });

        res.json({
            status: 'success',
            data: groupedPermissions
        });
    } catch (error) {
        console.error('Error getting permissions:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Función auxiliar para obtener etiqueta del recurso
function getResourceLabel(resource) {
    const labels = {
        'users': 'Gestión de Usuarios',
        'roles': 'Gestión de Roles',
        'permissions': 'Gestión de Permisos',
        'plugins': 'Gestión de Plugins',
        'billing': 'Facturación',
        'tenants': 'Gestión de Tenants',
        'settings': 'Configuración del Sistema',
        'content': 'Gestión de Contenido',
        'reports': 'Reportes y Análisis'
    };
    return labels[resource] || resource.charAt(0).toUpperCase() + resource.slice(1);
}

// Función auxiliar para obtener etiqueta de la acción
function getActionLabel(action, resource) {
    const actionLabels = {
        'create': 'Crear',
        'read': 'Ver',
        'update': 'Editar',
        'delete': 'Eliminar',
        'install': 'Instalar',
        'configure': 'Configurar',
        'manage': 'Gestionar'
    };

    const resourceLabels = {
        'users': 'Usuarios',
        'roles': 'Roles',
        'permissions': 'Permisos',
        'plugins': 'Plugins',
        'billing': 'Facturación',
        'tenants': 'Tenants',
        'settings': 'Configuración',
        'content': 'Contenido',
        'reports': 'Reportes'
    };

    const actionLabel = actionLabels[action] || action;
    const resourceLabel = resourceLabels[resource] || resource;

    return `${actionLabel} ${resourceLabel}`;
}

