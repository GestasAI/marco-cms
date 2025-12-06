/**
 * Extrae el subdominio de un hostname
 * @param {string} hostname - Ejemplo: demo.gestasai.com
 * @returns {string|null} - Subdominio extraído o null
 */
const extractSubdomain = (hostname) => {
    if (!hostname) return null;

    const parts = hostname.split('.');

    // Necesita al menos 3 partes para tener subdominio
    if (parts.length < 3) {
        return null;
    }

    return parts[0];
};

module.exports = extractSubdomain;
