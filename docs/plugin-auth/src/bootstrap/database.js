const db = require('../db');
const fs = require('fs');
const path = require('path');

/**
 * Módulo de bootstrap para la base de datos
 */
const DatabaseBootstrap = {
    /**
     * Espera a que la base de datos esté disponible
     * @param {number} maxRetries - Número máximo de reintentos
     */
    async waitForDb(maxRetries = 10) {
        for (let i = 1; i <= maxRetries; i++) {
            try {
                await db.query('SELECT 1');
                console.log('✅ Connected to PostgreSQL');
                return true;
            } catch (err) {
                console.log(`⏳ Waiting for DB... (${i}/${maxRetries})`);
                if (i === maxRetries) {
                    console.error('❌ Could not connect to DB after', maxRetries, 'attempts');
                    throw err;
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    },

    /**
     * Inicializa el schema de la base de datos
     */
    async initDb() {
        try {
            const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
            if (fs.existsSync(schemaPath)) {
                const schemaSql = fs.readFileSync(schemaPath, 'utf8');
                await db.query(schemaSql);
                console.log('✅ DB Schema initialized');
            } else {
                console.log('ℹ️ No schema.sql found, skipping DB init');
            }
        } catch (err) {
            console.error('❌ DB Init Error:', err.message);
            // No lanzar error, el schema principal ya existe
        }
    }
};

module.exports = DatabaseBootstrap;
