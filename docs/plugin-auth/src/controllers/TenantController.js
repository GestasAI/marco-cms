const TenantDetector = require('../services/TenantDetector');

/**
 * Controller para operaciones de tenant
 */
const TenantController = {
    /**
     * Detecta tenant por subdominio
     */
    async detectTenant(req, res) {
        console.log('📥 GET /api/tenant/detect');
        try {
            const hostname = req.headers.host || req.query.hostname;

            if (!hostname) {
                return res.status(400).json({ error: 'Hostname required' });
            }

            const tenant = await TenantDetector.detectTenantBySubdomain(hostname);

            if (!tenant) {
                return res.status(404).json({ error: 'Tenant not found' });
            }

            res.json({ status: 'success', data: tenant });
        } catch (err) {
            console.error('❌ Error detecting tenant:', err.message);
            res.status(500).json({ error: err.message });
        }
    },

    /**
     * Lista todos los tenants activos
     */
    async listTenants(req, res) {
        console.log('📥 GET /api/tenants');
        try {
            const tenants = await TenantDetector.listActiveTenants();
            res.json({ status: 'success', data: tenants });
        } catch (err) {
            console.error('❌ Error listing tenants:', err.message);
            res.status(500).json({ error: err.message });
        }
    },

    /**
     * Buscar tenant por nombre o slug
     */
    async searchTenant(req, res) {
        console.log('📥 GET /api/tenants/search');
        try {
            const { q } = req.query;

            if (!q) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Query parameter required'
                });
            }

            const query = `
                SELECT id, name, slug, domain, created_at
                FROM tenants
                WHERE LOWER(name) = LOWER($1) OR LOWER(slug) = LOWER($1)
                LIMIT 1
            `;

            const result = await req.db.query(query, [q]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Tenant not found'
                });
            }

            res.json({
                status: 'success',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('❌ Error searching tenant:', error);
            res.status(500).json({
                status: 'error',
                error: 'Failed to search tenant'
            });
        }
    }
};

module.exports = TenantController;
