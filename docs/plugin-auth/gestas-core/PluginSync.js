const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const redis = require('redis');

/**
 * PluginSync - Sincronizador de Funciones Core a Plugins
 * Parte de GestasCore-ACIDE
 * 
 * Características:
 * - Sincroniza funciones core a todos los plugins
 * - Detecta nuevos plugins automáticamente (Redis pub/sub)
 * - Control de versiones
 * - Actualización automática cuando el core cambia
 * - Notificaciones a plugins vía Redis
 */
class PluginSync {
    constructor() {
        this.coreFunctionsPath = path.join(__dirname, '../functions');
        this.pluginsBasePath = path.join(__dirname, '../../../'); // Subir a packages/
        this.redisClient = null;
        this.syncedPlugins = new Map(); // Map<pluginName, version>

        // Funciones core que se sincronizarán
        this.coreFunctions = [
            'QueryEngine.js',
            'ConfigLoader.js',
            'CertificateManager.js',
            'BackupManager.js',
            'SchemaValidator.js'
        ];
    }

    /**
     * Inicializa PluginSync y conecta a Redis
     */
    async init(redisUrl = 'redis://localhost:6379') {
        try {
            // Conectar a Redis
            this.redisClient = redis.createClient({ url: redisUrl });

            this.redisClient.on('error', (err) => {
                console.error('Redis Client Error:', err);
            });

            await this.redisClient.connect();
            console.log('✅ PluginSync connected to Redis');

            // Suscribirse a eventos de plugins
            await this.subscribeToPluginEvents();

            console.log('✅ PluginSync initialized');
        } catch (error) {
            console.error('❌ Error initializing PluginSync:', error);
            throw error;
        }
    }

    /**
     * Se suscribe a eventos de registro de plugins
     */
    async subscribeToPluginEvents() {
        try {
            const subscriber = this.redisClient.duplicate();
            await subscriber.connect();

            await subscriber.subscribe('SYSTEM:PLUGIN_REGISTER', async (message) => {
                try {
                    const data = JSON.parse(message);
                    console.log(`📢 New plugin registered: ${data.key}`);

                    // Sincronizar funciones al nuevo plugin
                    await this.syncToPlugin(data.key);
                } catch (error) {
                    console.error('Error handling plugin registration:', error);
                }
            });

            console.log('✅ Subscribed to SYSTEM:PLUGIN_REGISTER');
        } catch (error) {
            console.error('❌ Error subscribing to plugin events:', error);
        }
    }

    /**
     * Sincroniza funciones core a un plugin específico
     */
    async syncToPlugin(pluginKey) {
        try {
            const pluginPath = path.join(this.pluginsBasePath, pluginKey);

            // Verificar que el plugin existe
            const pluginExists = await this.directoryExists(pluginPath);
            if (!pluginExists) {
                console.warn(`⚠️  Plugin directory not found: ${pluginPath}`);
                return;
            }

            // Crear directorio gestas-core en el plugin
            const gestasCoreDir = path.join(pluginPath, 'gestas-core');
            await fs.mkdir(gestasCoreDir, { recursive: true });

            console.log(`🔄 Syncing core functions to: ${pluginKey}`);

            let syncedCount = 0;

            // Copiar cada función core
            for (const functionFile of this.coreFunctions) {
                const sourcePath = path.join(this.coreFunctionsPath, functionFile);
                const destPath = path.join(gestasCoreDir, functionFile);

                try {
                    await fs.copyFile(sourcePath, destPath);
                    syncedCount++;
                } catch (error) {
                    console.warn(`⚠️  Could not sync ${functionFile}:`, error.message);
                }
            }

            // Crear archivo de versión
            const versionInfo = {
                synced_at: new Date().toISOString(),
                core_version: await this.getCoreVersion(),
                functions: this.coreFunctions,
                plugin: pluginKey
            };

            const versionPath = path.join(gestasCoreDir, 'version.json');
            await fs.writeFile(versionPath, JSON.stringify(versionInfo, null, 2));

            // Guardar en registro de plugins sincronizados
            this.syncedPlugins.set(pluginKey, versionInfo.core_version);

            console.log(`✅ Synced ${syncedCount} functions to ${pluginKey}`);
            console.log(`   Version: ${versionInfo.core_version}`);

            // Notificar al plugin que se actualizó
            await this.notifyPluginUpdate(pluginKey, versionInfo);

            return {
                plugin: pluginKey,
                synced: syncedCount,
                version: versionInfo.core_version
            };
        } catch (error) {
            console.error(`❌ Error syncing to plugin ${pluginKey}:`, error);
            throw error;
        }
    }

    /**
     * Sincroniza funciones core a TODOS los plugins registrados
     */
    async syncFunctionsToPlugins() {
        try {
            console.log('🔄 Syncing core functions to all plugins...');

            // Obtener lista de plugins desde el directorio packages/
            const plugins = await this.discoverPlugins();

            console.log(`📦 Found ${plugins.length} plugins`);

            const results = [];

            for (const plugin of plugins) {
                try {
                    const result = await this.syncToPlugin(plugin);
                    results.push(result);
                } catch (error) {
                    console.error(`Failed to sync to ${plugin}:`, error.message);
                }
            }

            console.log(`✅ Sync completed: ${results.length}/${plugins.length} plugins updated`);

            return results;
        } catch (error) {
            console.error('❌ Error syncing functions to plugins:', error);
            throw error;
        }
    }

    /**
     * Descubre todos los plugins en el directorio packages/
     */
    async discoverPlugins() {
        try {
            const entries = await fs.readdir(this.pluginsBasePath, { withFileTypes: true });

            const plugins = [];

            for (const entry of entries) {
                if (entry.isDirectory() && entry.name.startsWith('plugin-')) {
                    // Excluir plugin-gestascore-acide (es el core)
                    if (entry.name !== 'plugin-gestascore-acide') {
                        plugins.push(entry.name);
                    }
                }
            }

            return plugins;
        } catch (error) {
            console.error('Error discovering plugins:', error);
            return [];
        }
    }

    /**
     * Actualiza las funciones core en un plugin específico
     */
    async updatePluginCore(pluginKey) {
        try {
            console.log(`🔄 Updating core functions in: ${pluginKey}`);

            // Verificar versión actual del plugin
            const currentVersion = await this.getPluginCoreVersion(pluginKey);
            const latestVersion = await this.getCoreVersion();

            if (currentVersion === latestVersion) {
                console.log(`✅ Plugin ${pluginKey} is already up to date (${currentVersion})`);
                return {
                    updated: false,
                    version: currentVersion
                };
            }

            console.log(`   Current: ${currentVersion || 'none'}`);
            console.log(`   Latest: ${latestVersion}`);

            // Sincronizar funciones
            const result = await this.syncToPlugin(pluginKey);

            console.log(`✅ Plugin ${pluginKey} updated to version ${latestVersion}`);

            return {
                updated: true,
                from: currentVersion,
                to: latestVersion,
                ...result
            };
        } catch (error) {
            console.error(`❌ Error updating plugin ${pluginKey}:`, error);
            throw error;
        }
    }

    /**
     * Obtiene la versión del core
     */
    async getCoreVersion() {
        try {
            const versionPath = path.join(__dirname, '../version.json');
            const content = await fs.readFile(versionPath, 'utf-8');
            const versionData = JSON.parse(content);
            return versionData.version;
        } catch (error) {
            return '1.0.0'; // Versión por defecto
        }
    }

    /**
     * Obtiene la versión del core instalada en un plugin
     */
    async getPluginCoreVersion(pluginKey) {
        try {
            const versionPath = path.join(
                this.pluginsBasePath,
                pluginKey,
                'gestas-core',
                'version.json'
            );
            const content = await fs.readFile(versionPath, 'utf-8');
            const versionData = JSON.parse(content);
            return versionData.core_version;
        } catch (error) {
            return null; // No tiene versión instalada
        }
    }

    /**
     * Notifica a un plugin que sus funciones core se actualizaron
     */
    async notifyPluginUpdate(pluginKey, versionInfo) {
        try {
            if (!this.redisClient) return;

            const message = {
                event: 'CORE_UPDATED',
                plugin: pluginKey,
                version: versionInfo.core_version,
                synced_at: versionInfo.synced_at,
                functions: versionInfo.functions
            };

            await this.redisClient.publish('SYSTEM:CORE_UPDATED', JSON.stringify(message));

            console.log(`📢 Notified ${pluginKey} of core update`);
        } catch (error) {
            console.warn('Could not notify plugin:', error.message);
        }
    }

    /**
     * Lista todos los plugins y sus versiones de core
     */
    async listPluginsWithVersions() {
        try {
            const plugins = await this.discoverPlugins();
            const results = [];

            for (const plugin of plugins) {
                const version = await this.getPluginCoreVersion(plugin);
                const latestVersion = await this.getCoreVersion();

                results.push({
                    plugin,
                    coreVersion: version,
                    latestVersion,
                    upToDate: version === latestVersion,
                    needsUpdate: version !== latestVersion
                });
            }

            return results;
        } catch (error) {
            console.error('Error listing plugins:', error);
            return [];
        }
    }

    /**
     * Verifica si un directorio existe
     */
    async directoryExists(dirPath) {
        try {
            const stats = await fs.stat(dirPath);
            return stats.isDirectory();
        } catch (error) {
            return false;
        }
    }

    /**
     * Cierra la conexión a Redis
     */
    async close() {
        if (this.redisClient) {
            await this.redisClient.quit();
            console.log('✅ PluginSync disconnected from Redis');
        }
    }

    /**
     * Obtiene estadísticas de sincronización
     */
    getStats() {
        return {
            syncedPlugins: this.syncedPlugins.size,
            plugins: Array.from(this.syncedPlugins.entries()).map(([name, version]) => ({
                name,
                version
            })),
            coreFunctions: this.coreFunctions.length,
            functions: this.coreFunctions
        };
    }
}

module.exports = new PluginSync();
