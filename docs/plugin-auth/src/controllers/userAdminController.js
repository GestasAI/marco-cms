const db = require('../db');

/**
 * Controlador de administración de usuarios
 * CRUD completo para el Super Admin Dashboard
 */

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                id, 
                email, 
                full_name as name, 
                is_super_admin,
                is_active,
                created_at,
                last_login
            FROM users
            ORDER BY created_at DESC
        `);

        // Transformar para el formato esperado por el frontend
        const users = result.rows.map(user => ({
            id: user.id,
            name: user.name || user.email,
            email: user.email,
            roles: user.is_super_admin ? ['super_admin'] : ['viewer'],
            status: user.is_active ? 'active' : 'inactive',
            lastLogin: user.last_login
        }));

        res.json({
            status: 'success',
            data: users
        });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT id, email, name, is_super_admin, is_active, created_at, updated_at, last_login FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        const user = result.rows[0];
        res.json({
            status: 'success',
            data: {
                id: user.id,
                name: user.name || user.email,
                email: user.email,
                roles: user.is_super_admin ? ['super_admin'] : ['viewer'],
                status: user.is_active ? 'active' : 'inactive',
                lastLogin: user.last_login
            }
        });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Crear nuevo usuario
exports.createUser = async (req, res) => {
    try {
        const { email, name, password, roles, status } = req.body;

        // Validaciones
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email y contraseña son requeridos'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'El email ya está registrado'
            });
        }

        // Hash de la contraseña
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determinar si es super admin
        const isSuperAdmin = roles && roles.includes('super_admin');
        const isActive = status !== 'inactive';

        // Insertar usuario
        const result = await db.query(
            `INSERT INTO users (email, name, password_hash, is_super_admin, is_active)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, email, name, is_super_admin, is_active, created_at`,
            [email, name || email, hashedPassword, isSuperAdmin, isActive]
        );

        const newUser = result.rows[0];

        res.status(201).json({
            status: 'success',
            message: 'Usuario creado correctamente',
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                roles: newUser.is_super_admin ? ['super_admin'] : ['viewer'],
                status: newUser.is_active ? 'active' : 'inactive'
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, password, roles, status } = req.body;

        // Verificar que el usuario existe
        const existingUser = await db.query(
            'SELECT id FROM users WHERE id = $1',
            [id]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        // Construir query dinámicamente
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (email) {
            updates.push(`email = $${paramCount++}`);
            values.push(email);
        }

        if (name) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }

        if (password) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push(`password_hash = $${paramCount++}`);
            values.push(hashedPassword);
        }

        if (roles !== undefined) {
            const isSuperAdmin = roles.includes('super_admin');
            updates.push(`is_super_admin = $${paramCount++}`);
            values.push(isSuperAdmin);
        }

        if (status !== undefined) {
            const isActive = status === 'active';
            updates.push(`is_active = $${paramCount++}`);
            values.push(isActive);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No hay campos para actualizar'
            });
        }

        updates.push(`updated_at = NOW()`);
        values.push(id);

        const query = `
            UPDATE users 
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id, email, name, is_super_admin, is_active, updated_at
        `;

        const result = await db.query(query, values);
        const updatedUser = result.rows[0];

        res.json({
            status: 'success',
            message: 'Usuario actualizado correctamente',
            data: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                roles: updatedUser.is_super_admin ? ['super_admin'] : ['viewer'],
                status: updatedUser.is_active ? 'active' : 'inactive'
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que no sea el super admin principal
        const user = await db.query(
            'SELECT email, is_super_admin FROM users WHERE id = $1',
            [id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        // Proteger al super admin principal
        if (user.rows[0].email === 'info@gestasai.com') {
            return res.status(403).json({
                status: 'error',
                message: 'No se puede eliminar el Super Admin principal'
            });
        }

        // Eliminar usuario
        await db.query('DELETE FROM users WHERE id = $1', [id]);

        res.json({
            status: 'success',
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Obtener estadísticas del sistema
exports.getSystemStats = async (req, res) => {
    try {
        const usersCount = await db.query('SELECT COUNT(*) FROM users WHERE is_active = true');
        const rolesCount = await db.query('SELECT COUNT(*) FROM roles');

        res.json({
            status: 'success',
            data: {
                activeUsers: parseInt(usersCount.rows[0].count),
                totalRoles: parseInt(rolesCount.rows[0].count)
            }
        });
    } catch (error) {
        console.error('Error getting system stats:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
