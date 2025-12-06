/**
 * Controller para health check
 */
const HealthController = {
    /**
     * Verifica el estado del servicio
     */
    async checkHealth(req, res) {
        console.log('📥 GET /health');
        res.json({ status: 'UP' });
    }
};

module.exports = HealthController;
