const { createClient } = require('redis');

/**
 * Módulo de bootstrap para Redis
 */
const RedisBootstrap = {
    redisClient: null,
    redisSub: null,

    /**
     * Conecta a Redis
     * @param {string} redisUrl - URL de Redis
     */
    async connectRedis(redisUrl) {
        this.redisClient = createClient({ url: redisUrl });
        this.redisSub = createClient({ url: redisUrl });

        await this.redisClient.connect();
        console.log('✅ Redis connected');

        await this.redisSub.connect();
        console.log('✅ Redis subscriber connected');
    },

    /**
     * Configura las suscripciones de Redis
     * @param {Function} onCoreReady - Callback cuando el core está listo
     */
    async setupSubscriptions(onCoreReady) {
        await this.redisSub.subscribe('SYSTEM:CORE_READY', (message) => {
            console.log('🔄 Core restarted. Re-registering...');
            onCoreReady();
        });
    },

    /**
     * Obtiene el cliente de Redis
     */
    getClient() {
        return this.redisClient;
    },

    /**
     * Obtiene el suscriptor de Redis
     */
    getSubscriber() {
        return this.redisSub;
    }
};

module.exports = RedisBootstrap;
