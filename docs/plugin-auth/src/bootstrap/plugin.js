const manifest = require('../../manifest.json');

/**
 * Módulo de bootstrap para registro del plugin
 */
const PluginBootstrap = {
    redisClient: null,
    port: null,

    /**
     * Inicializa el bootstrap del plugin
     * @param {Object} redisClient - Cliente de Redis
     * @param {number} port - Puerto del plugin
     */
    init(redisClient, port) {
        this.redisClient = redisClient;
        this.port = port;
    },

    /**
     * Registra el plugin en el core
     */
    async registerPlugin() {
        const payload = {
            ...manifest,
            network: {
                ...manifest.network,
                host: process.env.HOST_IP || 'gestas_plugin_auth',
                port: this.port
            }
        };

        await this.redisClient.publish('SYSTEM:PLUGIN_REGISTER', JSON.stringify(payload));
        console.log('📡 Registered with Core');
    },

    /**
     * Configura el heartbeat del plugin
     */
    setupHeartbeat() {
        setInterval(() => {
            this.redisClient.publish('SYSTEM:PLUGIN_HEARTBEAT', JSON.stringify({ key: manifest.key }));
        }, 30000);
    }
};

module.exports = PluginBootstrap;
