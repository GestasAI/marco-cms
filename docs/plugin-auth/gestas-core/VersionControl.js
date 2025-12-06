const fs = require('fs').promises;
const path = require('path');

/**
 * VersionControl - Control de Versiones Automático
 * Parte de GestasCore-ACIDE
 * 
 * Características:
 * - Incremento automático de versiones (major, minor, patch)
 * - Generación de changelog
 * - Comparación de versiones
 * - Integración con PluginSync
 */
class VersionControl {
    constructor() {
        this.versionFilePath = path.join(__dirname, '../version.json');
    }

    /**
     * Obtiene la versión actual del core
     */
    async getCoreVersion() {
        try {
            const content = await fs.readFile(this.versionFilePath, 'utf-8');
            const versionData = JSON.parse(content);
            return versionData.version;
        } catch (error) {
            console.error('Error reading version file:', error);
            return '1.0.0';
        }
    }

    /**
     * Obtiene toda la información de versión
     */
    async getVersionInfo() {
        try {
            const content = await fs.readFile(this.versionFilePath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            console.error('Error reading version file:', error);
            return null;
        }
    }

    /**
     * Incrementa la versión según el tipo
     * @param {string} type - 'major', 'minor', o 'patch'
     * @param {string} changeDescription - Descripción del cambio
     */
    async incrementVersion(type = 'patch', changeDescription = '') {
        try {
            const versionInfo = await this.getVersionInfo();
            const currentVersion = versionInfo.version;

            // Parsear versión actual
            const [major, minor, patch] = currentVersion.split('.').map(Number);

            // Calcular nueva versión
            let newVersion;
            switch (type) {
                case 'major':
                    newVersion = `${major + 1}.0.0`;
                    break;
                case 'minor':
                    newVersion = `${major}.${minor + 1}.0`;
                    break;
                case 'patch':
                default:
                    newVersion = `${major}.${minor}.${patch + 1}`;
                    break;
            }

            // Actualizar información de versión
            versionInfo.version = newVersion;
            versionInfo.updated_at = new Date().toISOString();

            // Añadir entrada al changelog
            if (!versionInfo.changelog) {
                versionInfo.changelog = [];
            }

            const changelogEntry = {
                version: newVersion,
                date: new Date().toISOString().split('T')[0],
                type: type,
                changes: changeDescription ? [changeDescription] : []
            };

            versionInfo.changelog.unshift(changelogEntry);

            // Guardar archivo actualizado
            await fs.writeFile(
                this.versionFilePath,
                JSON.stringify(versionInfo, null, 2),
                'utf-8'
            );

            console.log(`✅ Version incremented: ${currentVersion} → ${newVersion} (${type})`);

            return {
                from: currentVersion,
                to: newVersion,
                type: type,
                changelog: changelogEntry
            };
        } catch (error) {
            console.error('Error incrementing version:', error);
            throw error;
        }
    }

    /**
     * Actualiza la versión de un componente específico
     */
    async updateComponentVersion(componentName, newVersion) {
        try {
            const versionInfo = await this.getVersionInfo();

            if (!versionInfo.components) {
                versionInfo.components = {};
            }

            const oldVersion = versionInfo.components[componentName];
            versionInfo.components[componentName] = newVersion;
            versionInfo.updated_at = new Date().toISOString();

            await fs.writeFile(
                this.versionFilePath,
                JSON.stringify(versionInfo, null, 2),
                'utf-8'
            );

            console.log(`✅ Component ${componentName} updated: ${oldVersion} → ${newVersion}`);

            return {
                component: componentName,
                from: oldVersion,
                to: newVersion
            };
        } catch (error) {
            console.error('Error updating component version:', error);
            throw error;
        }
    }

    /**
     * Compara dos versiones
     * @returns {number} -1 si v1 < v2, 0 si v1 === v2, 1 si v1 > v2
     */
    compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);

        for (let i = 0; i < 3; i++) {
            if (parts1[i] > parts2[i]) return 1;
            if (parts1[i] < parts2[i]) return -1;
        }

        return 0;
    }

    /**
     * Verifica si una versión es mayor que otra
     */
    isNewerVersion(v1, v2) {
        return this.compareVersions(v1, v2) > 0;
    }

    /**
     * Obtiene el changelog completo
     */
    async getChangelog() {
        try {
            const versionInfo = await this.getVersionInfo();
            return versionInfo.changelog || [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Obtiene el changelog de una versión específica
     */
    async getChangelogForVersion(version) {
        try {
            const changelog = await this.getChangelog();
            return changelog.find(entry => entry.version === version);
        } catch (error) {
            return null;
        }
    }

    /**
     * Añade una entrada al changelog sin incrementar versión
     */
    async addChangelogEntry(version, changes) {
        try {
            const versionInfo = await this.getVersionInfo();

            if (!versionInfo.changelog) {
                versionInfo.changelog = [];
            }

            // Buscar entrada existente para esta versión
            const existingEntry = versionInfo.changelog.find(e => e.version === version);

            if (existingEntry) {
                // Añadir cambios a la entrada existente
                if (Array.isArray(changes)) {
                    existingEntry.changes.push(...changes);
                } else {
                    existingEntry.changes.push(changes);
                }
            } else {
                // Crear nueva entrada
                const newEntry = {
                    version: version,
                    date: new Date().toISOString().split('T')[0],
                    changes: Array.isArray(changes) ? changes : [changes]
                };
                versionInfo.changelog.unshift(newEntry);
            }

            versionInfo.updated_at = new Date().toISOString();

            await fs.writeFile(
                this.versionFilePath,
                JSON.stringify(versionInfo, null, 2),
                'utf-8'
            );

            console.log(`✅ Changelog updated for version ${version}`);

            return versionInfo.changelog;
        } catch (error) {
            console.error('Error adding changelog entry:', error);
            throw error;
        }
    }

    /**
     * Genera un resumen de versiones
     */
    async getVersionSummary() {
        try {
            const versionInfo = await this.getVersionInfo();

            const componentVersions = Object.entries(versionInfo.components || {}).map(
                ([name, version]) => ({ name, version })
            );

            return {
                coreVersion: versionInfo.version,
                releasedAt: versionInfo.released_at,
                updatedAt: versionInfo.updated_at,
                components: componentVersions,
                totalChangelogs: versionInfo.changelog?.length || 0
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Valida el formato de una versión (semver)
     */
    isValidVersion(version) {
        const semverRegex = /^\d+\.\d+\.\d+$/;
        return semverRegex.test(version);
    }

    /**
     * Obtiene la siguiente versión según el tipo
     */
    getNextVersion(currentVersion, type = 'patch') {
        const [major, minor, patch] = currentVersion.split('.').map(Number);

        switch (type) {
            case 'major':
                return `${major + 1}.0.0`;
            case 'minor':
                return `${major}.${minor + 1}.0`;
            case 'patch':
            default:
                return `${major}.${minor}.${patch + 1}`;
        }
    }
}

module.exports = new VersionControl();
