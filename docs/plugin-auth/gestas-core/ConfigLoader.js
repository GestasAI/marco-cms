const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const yaml = require('yaml');

/**
 * ConfigLoader - Cargador de configuraciones YAML
 * Parte de GestasCore-ACIDE
 * 
 * Características:
 * - Carga configuraciones desde archivos YAML
 * - Sistema de caché en memoria
 * - Hot-reload automático (detecta cambios)
 * - Soporte para configuraciones anidadas
 * - Merge de configuraciones (defaults + custom)
 */
class ConfigLoader {
    constructor() {
        this.configPath = path.join(__dirname, '../config');
        this.cache = new Map();
        this.watchers = new Map();
        this.defaultTTL = 60000;
    }

    getConfigPath(configName) {
        return path.join(this.configPath, `${configName}.yaml`);
    }

    async loadYamlFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return yaml.parse(content);
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`Configuration file not found: ${filePath}`);
            }
            throw new Error(`Error parsing YAML file ${filePath}: ${error.message}`);
        }
    }

    async load(configName, options = {}) {
        const {
            useCache = true,
            watch = false,
            ttl = this.defaultTTL
        } = options;

        const filePath = this.getConfigPath(configName);

        if (useCache && this.cache.has(configName)) {
            const cached = this.cache.get(configName);
            const age = Date.now() - cached.timestamp;

            if (age < ttl) {
                return cached.data;
            }
        }

        const data = await this.loadYamlFile(filePath);

        this.cache.set(configName, {
            data,
            timestamp: Date.now(),
            filePath
        });

        if (watch && !this.watchers.has(configName)) {
            this.watchConfig(configName, filePath);
        }

        return data;
    }

    async get(configName, path = null, defaultValue = null) {
        const config = await this.load(configName);

        if (!path) {
            return config;
        }

        const value = path.split('.').reduce((current, key) => {
            return current?.[key];
        }, config);

        return value !== undefined ? value : defaultValue;
    }

    async loadPluginConfig(pluginName, options = {}) {
        const pluginConfigPath = path.join(this.configPath, 'plugins', `${pluginName}.yaml`);

        try {
            const data = await this.loadYamlFile(pluginConfigPath);

            const cacheKey = `plugin:${pluginName}`;
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now(),
                filePath: pluginConfigPath
            });

            return data;
        } catch (error) {
            console.warn(`Plugin config not found for ${pluginName}, using defaults`);
            return {};
        }
    }

    async merge(configName, overrides = {}) {
        const baseConfig = await this.load(configName);
        return this.deepMerge(baseConfig, overrides);
    }

    deepMerge(target, source) {
        const result = { ...target };

        for (const key in source) {
            if (source[key] instanceof Object && key in target) {
                result[key] = this.deepMerge(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }

        return result;
    }

    watchConfig(configName, filePath) {
        try {
            const watcher = fsSync.watch(filePath, async (eventType) => {
                if (eventType === 'change') {
                    console.log(`🔄 Config file changed: ${configName}, reloading...`);

                    try {
                        const data = await this.loadYamlFile(filePath);

                        this.cache.set(configName, {
                            data,
                            timestamp: Date.now(),
                            filePath
                        });

                        console.log(`✅ Config reloaded: ${configName}`);
                    } catch (error) {
                        console.error(`❌ Error reloading config ${configName}:`, error.message);
                    }
                }
            });

            this.watchers.set(configName, watcher);
        } catch (error) {
            console.error(`Error watching config ${configName}:`, error);
        }
    }

    unwatchConfig(configName) {
        if (this.watchers.has(configName)) {
            const watcher = this.watchers.get(configName);
            watcher.close();
            this.watchers.delete(configName);
        }
    }

    invalidate(configName) {
        this.cache.delete(configName);
    }

    clearCache() {
        this.cache.clear();
    }

    stopAllWatchers() {
        for (const [configName, watcher] of this.watchers.entries()) {
            watcher.close();
        }
        this.watchers.clear();
    }

    getCacheStats() {
        const stats = {
            size: this.cache.size,
            configs: [],
            watchers: Array.from(this.watchers.keys())
        };

        for (const [name, cached] of this.cache.entries()) {
            stats.configs.push({
                name,
                age: Date.now() - cached.timestamp,
                path: cached.filePath
            });
        }

        return stats;
    }

    validate(config, requiredFields = []) {
        const missing = [];

        for (const field of requiredFields) {
            const value = field.split('.').reduce((current, key) => {
                return current?.[key];
            }, config);

            if (value === undefined) {
                missing.push(field);
            }
        }

        if (missing.length > 0) {
            throw new Error(`Missing required configuration fields: ${missing.join(', ')}`);
        }

        return true;
    }

    async save(configName, data) {
        const filePath = this.getConfigPath(configName);
        const yamlContent = yaml.stringify(data);

        await fs.writeFile(filePath, yamlContent, 'utf-8');

        this.invalidate(configName);

        console.log(`✅ Configuration saved: ${configName}`);
    }
}

module.exports = new ConfigLoader();
