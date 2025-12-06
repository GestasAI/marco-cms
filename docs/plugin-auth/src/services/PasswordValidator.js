const bcrypt = require('bcryptjs');

/**
 * Servicio para validar contraseñas
 */
class PasswordValidator {
    /**
     * Valida una contraseña contra su hash
     * @param {string} plainPassword - Contraseña en texto plano
     * @param {string} hashedPassword - Hash de la contraseña
     * @returns {Promise<boolean>} - true si es válida
     */
    async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Hashea una contraseña
     * @param {string} plainPassword - Contraseña en texto plano
     * @returns {Promise<string>} - Hash de la contraseña
     */
    async hashPassword(plainPassword) {
        return await bcrypt.hash(plainPassword, 10);
    }
}

module.exports = new PasswordValidator();
