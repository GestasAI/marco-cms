const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs').promises;
const path = require('path');

/**
 * SchemaValidator - Validates data against JSON schemas
 * Part of GestasCore-ACIDE
 */
class SchemaValidator {
    constructor() {
        this.ajv = new Ajv({
            allErrors: true,
            strict: true,
            validateFormats: true
        });
        addFormats(this.ajv);

        this.schemaCache = new Map();
        this.schemasPath = path.join(__dirname, '../schemas/core');
    }

    /**
     * Load a schema from filesystem
     * @param {string} entityType - Type of entity (e.g., 'Post', 'Category')
     * @returns {object} - JSON Schema
     */
    async loadSchema(entityType) {
        const cacheKey = entityType.toLowerCase();

        // Check cache first
        if (this.schemaCache.has(cacheKey)) {
            return this.schemaCache.get(cacheKey);
        }

        // Load from filesystem
        const schemaPath = path.join(this.schemasPath, `${cacheKey}.json`);

        try {
            const schemaContent = await fs.readFile(schemaPath, 'utf8');
            const schema = JSON.parse(schemaContent);

            // Cache the schema
            this.schemaCache.set(cacheKey, schema);

            return schema;
        } catch (error) {
            throw new Error(`Schema not found for entity type: ${entityType}. Path: ${schemaPath}`);
        }
    }

    /**
     * Validate data against a schema
     * @param {string} entityType - Type of entity
     * @param {object} data - Data to validate
     * @returns {object} - {valid: boolean, errors: array|null, data: object}
     */
    async validate(entityType, data) {
        const schema = await this.loadSchema(entityType);

        const validate = this.ajv.compile(schema);
        const valid = validate(data);

        if (!valid) {
            return {
                valid: false,
                errors: validate.errors,
                data: null
            };
        }

        return {
            valid: true,
            errors: null,
            data: data
        };
    }

    /**
     * Validate and save data to filesystem
     * @param {string} entityType - Type of entity
     * @param {object} data - Data to save
     * @returns {object} - Saved data
     */
    async save(entityType, data) {
        // Validate first
        const validation = await this.validate(entityType, data);

        if (!validation.valid) {
            const errorMessages = validation.errors.map(err =>
                `${err.instancePath} ${err.message}`
            ).join(', ');
            throw new Error(`Validation failed: ${errorMessages}`);
        }

        // Ensure data has required timestamps
        const now = new Date().toISOString();
        if (!data.created_at) {
            data.created_at = now;
        }
        data.updated_at = now;

        // Save to filesystem
        const entityDir = path.join(__dirname, '../data', `${entityType.toLowerCase()}s`);
        await fs.mkdir(entityDir, { recursive: true });

        const filePath = path.join(entityDir, `${data.id}.json`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

        console.log(`✅ Saved ${entityType} with ID: ${data.id}`);
        return data;
    }

    /**
     * Load a document from filesystem
     * @param {string} entityType - Type of entity
     * @param {string} id - Document ID
     * @returns {object} - Document data
     */
    async load(entityType, id) {
        const filePath = path.join(
            __dirname,
            '../data',
            `${entityType.toLowerCase()}s`,
            `${id}.json`
        );

        try {
            const content = await fs.readFile(filePath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            throw new Error(`Document not found: ${entityType}/${id}`);
        }
    }

    /**
     * Delete a document from filesystem
     * @param {string} entityType - Type of entity
     * @param {string} id - Document ID
     * @returns {boolean} - Success
     */
    async delete(entityType, id) {
        const filePath = path.join(
            __dirname,
            '../data',
            `${entityType.toLowerCase()}s`,
            `${id}.json`
        );

        try {
            await fs.unlink(filePath);
            console.log(`🗑️  Deleted ${entityType} with ID: ${id}`);
            return true;
        } catch (error) {
            throw new Error(`Failed to delete document: ${entityType}/${id}`);
        }
    }

    /**
     * Clear schema cache
     */
    clearCache() {
        this.schemaCache.clear();
        console.log('🧹 Schema cache cleared');
    }
}

// Export singleton instance
module.exports = new SchemaValidator();
