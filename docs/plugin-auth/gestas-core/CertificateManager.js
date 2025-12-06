const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

/**
 * CertificateManager - Gestor de Certificados SSL/TLS
 * Parte de GestasCore-ACIDE
 * 
 * Características:
 * - Generación de certificados maestros
 * - Distribución automática a plugins
 * - Rotación automática cada 90 días
 * - Almacenamiento seguro
 * - Validación de certificados
 */
class CertificateManager {
    constructor() {
        this.certsPath = path.join(__dirname, '../certs');
        this.masterCertPath = path.join(this.certsPath, 'master');
        this.pluginCertsPath = path.join(this.certsPath, 'plugins');
        this.rotationInterval = 90 * 24 * 60 * 60 * 1000; // 90 días en ms
        this.rotationTimer = null;
    }

    /**
     * Inicializa el gestor de certificados
     * Crea directorios y verifica certificado maestro
     */
    async init() {
        try {
            // Crear directorios si no existen
            await this.ensureDirectories();

            // Verificar o generar certificado maestro
            const hasMasterCert = await this.hasMasterCertificate();

            if (!hasMasterCert) {
                console.log('📜 No master certificate found, generating...');
                await this.generateMasterCertificate();
            } else {
                console.log('✅ Master certificate found');

                // Verificar si necesita rotación
                const needsRotation = await this.needsRotation();
                if (needsRotation) {
                    console.log('🔄 Master certificate needs rotation');
                    await this.rotateMasterCertificate();
                }
            }

            console.log('✅ CertificateManager initialized');
        } catch (error) {
            console.error('❌ Error initializing CertificateManager:', error);
            throw error;
        }
    }

    /**
     * Asegura que existan los directorios necesarios
     */
    async ensureDirectories() {
        const dirs = [this.certsPath, this.masterCertPath, this.pluginCertsPath];

        for (const dir of dirs) {
            try {
                await fs.mkdir(dir, { recursive: true });
            } catch (error) {
                if (error.code !== 'EEXIST') {
                    throw error;
                }
            }
        }
    }

    /**
     * Verifica si existe el certificado maestro
     */
    async hasMasterCertificate() {
        try {
            const keyPath = path.join(this.masterCertPath, 'master.key');
            const certPath = path.join(this.masterCertPath, 'master.crt');

            await fs.access(keyPath);
            await fs.access(certPath);

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Genera un certificado maestro autofirmado
     * Válido por 1 año (se rotará cada 90 días)
     */
    async generateMasterCertificate() {
        try {
            const keyPath = path.join(this.masterCertPath, 'master.key');
            const certPath = path.join(this.masterCertPath, 'master.crt');
            const metaPath = path.join(this.masterCertPath, 'meta.json');

            // Generar clave privada RSA 2048 bits
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });

            // Guardar clave privada
            await fs.writeFile(keyPath, privateKey, { mode: 0o600 }); // Solo lectura para owner

            // Crear certificado autofirmado usando OpenSSL (si está disponible)
            // Si no, usar una implementación simplificada
            try {
                const subject = '/C=ES/ST=Madrid/L=Madrid/O=GestasAI/OU=Core/CN=gestascore-acide';
                const days = 365;

                await exec(`openssl req -new -x509 -key "${keyPath}" -out "${certPath}" -days ${days} -subj "${subject}"`);
            } catch (opensslError) {
                // Fallback: Crear un certificado simple (para desarrollo)
                console.warn('⚠️  OpenSSL not available, using simplified certificate');
                await fs.writeFile(certPath, publicKey);
            }

            // Guardar metadata
            const metadata = {
                generated_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                rotation_due: new Date(Date.now() + this.rotationInterval).toISOString(),
                version: 1,
                algorithm: 'RSA-2048'
            };

            await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2));

            console.log('✅ Master certificate generated successfully');
            console.log(`   Key: ${keyPath}`);
            console.log(`   Cert: ${certPath}`);
            console.log(`   Rotation due: ${metadata.rotation_due}`);

            return { keyPath, certPath, metadata };
        } catch (error) {
            console.error('❌ Error generating master certificate:', error);
            throw error;
        }
    }

    /**
     * Verifica si el certificado necesita rotación
     */
    async needsRotation() {
        try {
            const metaPath = path.join(this.masterCertPath, 'meta.json');
            const content = await fs.readFile(metaPath, 'utf-8');
            const metadata = JSON.parse(content);

            const rotationDue = new Date(metadata.rotation_due);
            const now = new Date();

            return now >= rotationDue;
        } catch (error) {
            // Si no hay metadata, asumir que necesita rotación
            return true;
        }
    }

    /**
     * Rota el certificado maestro
     * Genera uno nuevo y distribuye a todos los plugins
     */
    async rotateMasterCertificate() {
        try {
            console.log('🔄 Starting certificate rotation...');

            // Backup del certificado anterior
            await this.backupOldCertificate();

            // Generar nuevo certificado
            await this.generateMasterCertificate();

            // Distribuir a todos los plugins
            await this.distributeToAllPlugins();

            console.log('✅ Certificate rotation completed');
        } catch (error) {
            console.error('❌ Error rotating certificate:', error);
            throw error;
        }
    }

    /**
     * Hace backup del certificado anterior
     */
    async backupOldCertificate() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupDir = path.join(this.certsPath, 'backups', timestamp);

            await fs.mkdir(backupDir, { recursive: true });

            const files = ['master.key', 'master.crt', 'meta.json'];

            for (const file of files) {
                const sourcePath = path.join(this.masterCertPath, file);
                const destPath = path.join(backupDir, file);

                try {
                    await fs.copyFile(sourcePath, destPath);
                } catch (error) {
                    // Archivo no existe, continuar
                }
            }

            console.log(`📦 Old certificate backed up to: ${backupDir}`);
        } catch (error) {
            console.warn('⚠️  Could not backup old certificate:', error.message);
        }
    }

    /**
     * Distribuye el certificado maestro a un plugin específico
     */
    async distributeCertificate(pluginName) {
        try {
            const pluginCertDir = path.join(this.pluginCertsPath, pluginName);
            await fs.mkdir(pluginCertDir, { recursive: true });

            // Copiar certificado y clave
            const masterKey = path.join(this.masterCertPath, 'master.key');
            const masterCert = path.join(this.masterCertPath, 'master.crt');

            const pluginKey = path.join(pluginCertDir, 'cert.key');
            const pluginCert = path.join(pluginCertDir, 'cert.crt');

            await fs.copyFile(masterKey, pluginKey);
            await fs.copyFile(masterCert, pluginCert);

            // Establecer permisos seguros
            await fs.chmod(pluginKey, 0o600);
            await fs.chmod(pluginCert, 0o644);

            console.log(`✅ Certificate distributed to plugin: ${pluginName}`);

            return { keyPath: pluginKey, certPath: pluginCert };
        } catch (error) {
            console.error(`❌ Error distributing certificate to ${pluginName}:`, error);
            throw error;
        }
    }

    /**
     * Distribuye el certificado a todos los plugins registrados
     */
    async distributeToAllPlugins() {
        try {
            // Obtener lista de plugins (desde directorio)
            const plugins = await fs.readdir(this.pluginCertsPath);

            for (const plugin of plugins) {
                await this.distributeCertificate(plugin);
            }

            console.log(`✅ Certificate distributed to ${plugins.length} plugins`);
        } catch (error) {
            console.error('❌ Error distributing to all plugins:', error);
        }
    }

    /**
     * Configura la rotación automática
     * Se ejecuta cada 90 días
     */
    setupAutoRotation() {
        // Limpiar timer anterior si existe
        if (this.rotationTimer) {
            clearInterval(this.rotationTimer);
        }

        // Configurar nuevo timer
        this.rotationTimer = setInterval(async () => {
            console.log('⏰ Auto-rotation triggered');
            await this.rotateMasterCertificate();
        }, this.rotationInterval);

        console.log('✅ Auto-rotation configured (every 90 days)');
    }

    /**
     * Detiene la rotación automática
     */
    stopAutoRotation() {
        if (this.rotationTimer) {
            clearInterval(this.rotationTimer);
            this.rotationTimer = null;
            console.log('🛑 Auto-rotation stopped');
        }
    }

    /**
     * Obtiene información del certificado maestro
     */
    async getMasterCertificateInfo() {
        try {
            const metaPath = path.join(this.masterCertPath, 'meta.json');
            const content = await fs.readFile(metaPath, 'utf-8');
            const metadata = JSON.parse(content);

            const now = new Date();
            const rotationDue = new Date(metadata.rotation_due);
            const daysUntilRotation = Math.ceil((rotationDue - now) / (24 * 60 * 60 * 1000));

            return {
                ...metadata,
                days_until_rotation: daysUntilRotation,
                needs_rotation: daysUntilRotation <= 0
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Valida un certificado de plugin
     */
    async validatePluginCertificate(pluginName) {
        try {
            const pluginCertDir = path.join(this.pluginCertsPath, pluginName);
            const keyPath = path.join(pluginCertDir, 'cert.key');
            const certPath = path.join(pluginCertDir, 'cert.crt');

            // Verificar que existan los archivos
            await fs.access(keyPath);
            await fs.access(certPath);

            return {
                valid: true,
                keyPath,
                certPath
            };
        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }

    /**
     * Lista todos los plugins con certificados
     */
    async listPluginsWithCertificates() {
        try {
            const plugins = await fs.readdir(this.pluginCertsPath);

            const results = [];
            for (const plugin of plugins) {
                const validation = await this.validatePluginCertificate(plugin);
                results.push({
                    plugin,
                    ...validation
                });
            }

            return results;
        } catch (error) {
            return [];
        }
    }

    /**
     * Limpia certificados antiguos (backups > 6 meses)
     */
    async cleanOldBackups() {
        try {
            const backupsDir = path.join(this.certsPath, 'backups');
            const backups = await fs.readdir(backupsDir);

            const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);
            let cleaned = 0;

            for (const backup of backups) {
                const backupPath = path.join(backupsDir, backup);
                const stats = await fs.stat(backupPath);

                if (stats.mtimeMs < sixMonthsAgo) {
                    await fs.rm(backupPath, { recursive: true });
                    cleaned++;
                }
            }

            console.log(`🧹 Cleaned ${cleaned} old backups`);
            return cleaned;
        } catch (error) {
            console.warn('⚠️  Error cleaning old backups:', error.message);
            return 0;
        }
    }
}

module.exports = new CertificateManager();
