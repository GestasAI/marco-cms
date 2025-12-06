/**
 * Bootstrap de GestasCore-ACIDE para Plugin Auth
 * Inicializa todas las funciones core del maestro
 */

const path = require('path');

// Cargar funciones core desde gestas-core/ (que está en la raíz del plugin)
const QueryEngine = require(path.join(__dirname, '../../gestas-core/QueryEngine'));
const ConfigLoader = require(path.join(__dirname, '../../gestas-core/ConfigLoader'));
const CertificateManager = require(path.join(__dirname, '../../gestas-core/CertificateManager'));
const BackupManager = require(path.join(__dirname, '../../gestas-core/BackupManager'));
const SchemaValidator = require(path.join(__dirname, '../../gestas-core/SchemaValidator'));
const PluginSync = require(path.join(__dirname, '../../gestas-core/PluginSync'));
const VersionControl = require(path.join(__dirname, '../../gestas-core/VersionControl'));

/**
 * Inicializa GestasCore para este plugin
 */
async function initGestasCore() {
    try {
        console.log('🚀 Inicializando GestasCore-ACIDE...');

        // Inicializar componentes que lo requieran
        await ConfigLoader.init?.();
        await CertificateManager.init?.();
        await BackupManager.init?.();

        console.log('✅ GestasCore-ACIDE inicializado correctamente');

        return {
            QueryEngine,
            ConfigLoader,
            CertificateManager,
            BackupManager,
            SchemaValidator,
            PluginSync,
            VersionControl
        };
    } catch (error) {
        console.error('❌ Error inicializando GestasCore:', error);
        throw error;
    }
}

// Exportar funciones core
module.exports = {
    initGestasCore,
    QueryEngine,
    ConfigLoader,
    CertificateManager,
    BackupManager,
    SchemaValidator,
    PluginSync,
    VersionControl
};
