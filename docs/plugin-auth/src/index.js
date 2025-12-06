const express = require('express');
const cors = require('cors');
const DatabaseBootstrap = require('./bootstrap/database');
const RedisBootstrap = require('./bootstrap/redis');
const PluginBootstrap = require('./bootstrap/plugin');
const GestasCore = require('./bootstrap/gestas-core');

// Routes
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const tenantRoutes = require('./routes/tenant.routes');
const configRoutes = require('./routes/config.routes');
const adminRoutes = require('./routes/adminRoutes'); // NUEVO

const app = express();
const PORT = process.env.PORT || 3004;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(healthRoutes);
app.use(authRoutes);
app.use(tenantRoutes);
app.use(configRoutes);
app.use('/admin', adminRoutes); // NUEVO - Rutas de administración

/**
 * Inicia el servidor
 */
async function start() {
    try {
        console.log('🚀 Starting Auth Plugin...');

        // Conectar a Redis
        await RedisBootstrap.connectRedis(REDIS_URL);

        // Esperar y configurar base de datos
        await DatabaseBootstrap.waitForDb();
        await DatabaseBootstrap.initDb();

        // Inicializar GestasCore-ACIDE
        await GestasCore.initGestasCore();

        // Inicializar plugin bootstrap
        PluginBootstrap.init(RedisBootstrap.getClient(), PORT);

        // Configurar suscripciones
        await RedisBootstrap.setupSubscriptions(() => {
            PluginBootstrap.registerPlugin();
        });

        // Iniciar servidor
        app.listen(PORT, async () => {
            console.log(`🔐 Auth Plugin running on port ${PORT}`);

            // Registrar plugin
            await PluginBootstrap.registerPlugin();

            // Configurar heartbeat
            PluginBootstrap.setupHeartbeat();
        });
    } catch (err) {
        console.error('💥 Fatal error during startup:', err);
        process.exit(1);
    }
}

start();
