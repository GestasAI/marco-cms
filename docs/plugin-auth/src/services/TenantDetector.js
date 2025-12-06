const db = require('../db');
const extractSubdomain = require('../utils/extractSubdomain');

/**
 * Servicio para detectar tenants
 */
class TenantDetector {
    /**
     * Detecta tenant por subdominio
     * @param {string} hostname - Ejemplo: demo.gestasai.com
     * @returns {Promise<Object|null>} - Tenant encontrado o null
     */
    async detectTenantBySubdomain(hostname) {
        console.log('🔍 Detecting tenant from hostname:', hostname);

        const subdomain = extractSubdomain(hostname);

        if (!subdomain) {
            console.log('⚠️ No subdomain detected');
            return null;
        }

        console.log('📍 Subdomain extracted:', subdomain);

        // Buscar tenant por slug o domain
        const result = await db.query(
            'SELECT * FROM tenants WHERE slug = $1 OR domain = $2 LIMIT 1',
            [subdomain, hostname]
        );

        if (result.rows.length === 0) {
            console.log('❌ Tenant not found for subdomain:', subdomain);
            return null;
        }

        console.log('✅ Tenant found:', result.rows[0].name);
        return result.rows[0];
    }

    /**
     * Obtiene tenant por ID
     * @param {string} tenantId - UUID del tenant
     * @returns {Promise<Object|null>} - Tenant encontrado o null
     */
    async detectTenantById(tenantId) {
        const result = await db.query(
            'SELECT * FROM tenants WHERE id = $1',
            [tenantId]
        );

        return result.rows[0] || null;
    }

    /**
     * Lista todos los tenants activos
     * @returns {Promise<Array>} - Lista de tenants
     */
    async listActiveTenants() {
        const result = await db.query(
            'SELECT id, name, slug, domain FROM tenants WHERE status = $1 ORDER BY name',
            ['ACTIVE']
        );

        return result.rows;
    }
}

module.exports = new TenantDetector();
