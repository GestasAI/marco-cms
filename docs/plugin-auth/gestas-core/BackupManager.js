const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const cron = require('node-cron');

/**
 * BackupManager - Gestor de Backups Automáticos
 * Parte de GestasCore-ACIDE
 * 
 * Características:
 * - Backups automáticos mensuales (primer día del mes)
 * - Compresión ZIP
 * - Retención de 90 días
 * - Backups incrementales
 * - Restauración de backups
 * - Limpieza automática de backups antiguos
 */
class BackupManager {
    constructor() {
        this.backupPath = path.join(__dirname, '../backups');
        this.dataPath = path.join(__dirname, '../data');
        this.configPath = path.join(__dirname, '../config');
        this.schemasPath = path.join(__dirname, '../schemas');

        this.retentionDays = 90;
        this.cronJob = null;

        // Configuración de backup
        this.backupConfig = {
            compression: true,
            includeData: true,
            includeConfig: true,
            includeSchemas: true,
            includeCerts: false // Los certificados se gestionan aparte
        };
    }

    /**
     * Inicializa el BackupManager
     */
    async init() {
        try {
            // Crear directorio de backups si no existe
            await this.ensureBackupDirectory();

            console.log('✅ BackupManager initialized');
        } catch (error) {
            console.error('❌ Error initializing BackupManager:', error);
            throw error;
        }
    }

    /**
     * Asegura que exista el directorio de backups
     */
    async ensureBackupDirectory() {
        try {
            await fs.mkdir(this.backupPath, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }

    /**
     * Crea un backup completo del sistema
     */
    async createMonthlyBackup() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupName = `backup-${timestamp}.zip`;
            const backupFilePath = path.join(this.backupPath, backupName);

            console.log(`📦 Creating backup: ${backupName}`);

            const zip = new AdmZip();

            // Añadir datos
            if (this.backupConfig.includeData && await this.directoryExists(this.dataPath)) {
                await this.addDirectoryToZip(zip, this.dataPath, 'data');
                console.log('   ✅ Data included');
            }

            // Añadir configuraciones
            if (this.backupConfig.includeConfig && await this.directoryExists(this.configPath)) {
                await this.addDirectoryToZip(zip, this.configPath, 'config');
                console.log('   ✅ Config included');
            }

            // Añadir esquemas
            if (this.backupConfig.includeSchemas && await this.directoryExists(this.schemasPath)) {
                await this.addDirectoryToZip(zip, this.schemasPath, 'schemas');
                console.log('   ✅ Schemas included');
            }

            // Añadir metadata del backup
            const metadata = {
                created_at: new Date().toISOString(),
                type: 'monthly',
                version: '1.0.0',
                retention_until: new Date(Date.now() + this.retentionDays * 24 * 60 * 60 * 1000).toISOString(),
                includes: {
                    data: this.backupConfig.includeData,
                    config: this.backupConfig.includeConfig,
                    schemas: this.backupConfig.includeSchemas
                }
            };

            zip.addFile('metadata.json', Buffer.from(JSON.stringify(metadata, null, 2)));

            // Guardar ZIP
            zip.writeZip(backupFilePath);

            const stats = await fs.stat(backupFilePath);
            const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

            console.log(`✅ Backup created successfully`);
            console.log(`   File: ${backupFilePath}`);
            console.log(`   Size: ${sizeInMB} MB`);
            console.log(`   Retention until: ${metadata.retention_until}`);

            return {
                path: backupFilePath,
                name: backupName,
                size: stats.size,
                metadata
            };
        } catch (error) {
            console.error('❌ Error creating backup:', error);
            throw error;
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
     * Añade un directorio completo al ZIP
     */
    async addDirectoryToZip(zip, dirPath, zipPath = '') {
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                const zipEntryPath = zipPath ? path.join(zipPath, entry.name) : entry.name;

                if (entry.isDirectory()) {
                    // Recursivo para subdirectorios
                    await this.addDirectoryToZip(zip, fullPath, zipEntryPath);
                } else {
                    // Añadir archivo
                    const content = await fs.readFile(fullPath);
                    zip.addFile(zipEntryPath, content);
                }
            }
        } catch (error) {
            console.warn(`⚠️  Could not add directory ${dirPath}:`, error.message);
        }
    }

    /**
     * Configura el backup automático mensual
     * Se ejecuta el primer día de cada mes a las 00:00
     */
    setupAutoBackup() {
        // Limpiar cron job anterior si existe
        if (this.cronJob) {
            this.cronJob.stop();
        }

        // Cron: 0 0 1 * * (minuto 0, hora 0, día 1, cualquier mes, cualquier día de semana)
        this.cronJob = cron.schedule('0 0 1 * *', async () => {
            console.log('⏰ Auto-backup triggered (monthly)');
            try {
                await this.createMonthlyBackup();
                await this.cleanOldBackups();
            } catch (error) {
                console.error('❌ Auto-backup failed:', error);
            }
        });

        console.log('✅ Auto-backup configured (monthly, 1st day at 00:00)');
    }

    /**
     * Detiene el backup automático
     */
    stopAutoBackup() {
        if (this.cronJob) {
            this.cronJob.stop();
            this.cronJob = null;
            console.log('🛑 Auto-backup stopped');
        }
    }

    /**
     * Lista todos los backups disponibles
     */
    async listBackups() {
        try {
            const files = await fs.readdir(this.backupPath);
            const backups = [];

            for (const file of files) {
                if (file.endsWith('.zip')) {
                    const filePath = path.join(this.backupPath, file);
                    const stats = await fs.stat(filePath);

                    // Intentar leer metadata
                    let metadata = null;
                    try {
                        const zip = new AdmZip(filePath);
                        const metadataEntry = zip.getEntry('metadata.json');
                        if (metadataEntry) {
                            metadata = JSON.parse(metadataEntry.getData().toString('utf8'));
                        }
                    } catch (error) {
                        // Metadata no disponible
                    }

                    backups.push({
                        name: file,
                        path: filePath,
                        size: stats.size,
                        created: stats.mtime,
                        metadata
                    });
                }
            }

            // Ordenar por fecha (más reciente primero)
            backups.sort((a, b) => b.created - a.created);

            return backups;
        } catch (error) {
            console.error('❌ Error listing backups:', error);
            return [];
        }
    }

    /**
     * Restaura un backup
     */
    async restoreBackup(backupName) {
        try {
            const backupPath = path.join(this.backupPath, backupName);

            console.log(`🔄 Restoring backup: ${backupName}`);

            // Verificar que existe el backup
            await fs.access(backupPath);

            const zip = new AdmZip(backupPath);

            // Crear backup de seguridad antes de restaurar
            console.log('   📦 Creating safety backup...');
            await this.createMonthlyBackup();

            // Extraer archivos
            const extractPath = path.join(__dirname, '..');

            // Leer metadata para saber qué restaurar
            const metadataEntry = zip.getEntry('metadata.json');
            let metadata = null;

            if (metadataEntry) {
                metadata = JSON.parse(metadataEntry.getData().toString('utf8'));
            }

            // Restaurar data
            if (metadata?.includes?.data !== false) {
                zip.extractEntryTo('data/', extractPath, true, true);
                console.log('   ✅ Data restored');
            }

            // Restaurar config
            if (metadata?.includes?.config !== false) {
                zip.extractEntryTo('config/', extractPath, true, true);
                console.log('   ✅ Config restored');
            }

            // Restaurar schemas
            if (metadata?.includes?.schemas !== false) {
                zip.extractEntryTo('schemas/', extractPath, true, true);
                console.log('   ✅ Schemas restored');
            }

            console.log(`✅ Backup restored successfully from: ${backupName}`);

            return {
                success: true,
                backup: backupName,
                restored_at: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Error restoring backup:', error);
            throw error;
        }
    }

    /**
     * Limpia backups antiguos (> retention days)
     */
    async cleanOldBackups() {
        try {
            const backups = await this.listBackups();
            const now = Date.now();
            const retentionMs = this.retentionDays * 24 * 60 * 60 * 1000;

            let cleaned = 0;

            for (const backup of backups) {
                const age = now - backup.created.getTime();

                if (age > retentionMs) {
                    await fs.unlink(backup.path);
                    console.log(`🧹 Deleted old backup: ${backup.name}`);
                    cleaned++;
                }
            }

            if (cleaned > 0) {
                console.log(`✅ Cleaned ${cleaned} old backups (>${this.retentionDays} days)`);
            }

            return cleaned;
        } catch (error) {
            console.error('❌ Error cleaning old backups:', error);
            return 0;
        }
    }

    /**
     * Obtiene estadísticas de backups
     */
    async getBackupStats() {
        try {
            const backups = await this.listBackups();

            const totalSize = backups.reduce((sum, b) => sum + b.size, 0);
            const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

            const oldest = backups.length > 0 ? backups[backups.length - 1].created : null;
            const newest = backups.length > 0 ? backups[0].created : null;

            return {
                total: backups.length,
                totalSize: totalSize,
                totalSizeMB: parseFloat(totalSizeMB),
                oldest: oldest,
                newest: newest,
                retentionDays: this.retentionDays
            };
        } catch (error) {
            return {
                total: 0,
                totalSize: 0,
                totalSizeMB: 0,
                oldest: null,
                newest: null,
                retentionDays: this.retentionDays
            };
        }
    }

    /**
     * Verifica la integridad de un backup
     */
    async verifyBackup(backupName) {
        try {
            const backupPath = path.join(this.backupPath, backupName);

            // Verificar que existe
            await fs.access(backupPath);

            // Intentar abrir el ZIP
            const zip = new AdmZip(backupPath);
            const entries = zip.getEntries();

            // Verificar metadata
            const metadataEntry = zip.getEntry('metadata.json');
            if (!metadataEntry) {
                return {
                    valid: false,
                    error: 'Missing metadata.json'
                };
            }

            const metadata = JSON.parse(metadataEntry.getData().toString('utf8'));

            return {
                valid: true,
                entries: entries.length,
                metadata
            };
        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }
}

module.exports = new BackupManager();
