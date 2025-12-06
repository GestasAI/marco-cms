/**
 * Formatea la respuesta de usuario para el cliente
 * @param {Object} user - Usuario de la base de datos
 * @returns {Object} - Usuario formateado
 */
const formatUserResponse = (user) => {
    return {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        tenantId: user.tenant_id,
        roleId: user.role_id,
        roleName: user.role_name,
        isSuperAdmin: user.is_super_admin || false,
        isActive: user.is_active
    };
};

module.exports = formatUserResponse;
