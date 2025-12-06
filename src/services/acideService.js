/**
 * MARCO CMS - ACIDE Service
 * Sistema de almacenamiento PERSISTENTE en servidor
 * 
 * Usa GestasCore-ACIDE (SchemaValidator + QueryEngine)
 * Almacenamiento: Archivos JSON en servidor (como WordPress usa MySQL)
 */

import axios from 'axios';

// URL del backend de Marco CMS (Node.js server)
const API_URL = import.meta.env.VITE_MARCO_API_URL || 'http://localhost:4000';

class ACIDEService {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Crear documento
     * Guarda en servidor como archivo JSON
     */
    async create(collection, data) {
        try {
            const response = await axios.post(`${API_URL}/acide/create`, {
                collection,
                data
            });

            // Invalidar cache
            this.cache.delete(collection);

            return response.data.document;
        } catch (error) {
            console.error('Error creating document:', error);
            throw error;
        }
    }

    /**
     * Consultar documentos
     * Lee desde servidor (archivos JSON)
     */
    async query(collection, where = {}, options = {}) {
        try {
            // Verificar cache
            const cacheKey = `${collection}:${JSON.stringify(where)}:${JSON.stringify(options)}`;
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            const response = await axios.post(`${API_URL}/acide/query`, {
                collection,
                where,
                options
            });

            const results = response.data.documents || [];

            // Guardar en cache
            this.cache.set(cacheKey, results);

            return results;
        } catch (error) {
            console.error('Error querying documents:', error);
            return [];
        }
    }

    /**
     * Obtener por ID
     */
    async findById(collection, id) {
        try {
            const response = await axios.get(`${API_URL}/acide/${collection}/${id}`);
            return response.data.document;
        } catch (error) {
            console.error('Error finding document:', error);
            return null;
        }
    }

    /**
     * Actualizar documento
     * Actualiza archivo JSON en servidor
     */
    async update(collection, id, updates) {
        try {
            const response = await axios.put(`${API_URL}/acide/update`, {
                collection,
                id,
                updates
            });

            // Invalidar cache
            this.cache.delete(collection);

            return response.data.document;
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    }

    /**
     * Eliminar documento
     * Elimina archivo JSON en servidor
     */
    async delete(collection, id) {
        try {
            await axios.delete(`${API_URL}/acide/${collection}/${id}`);

            // Invalidar cache
            this.cache.delete(collection);

            return true;
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }

    /**
     * Contar documentos
     */
    async count(collection, where = {}) {
        try {
            const response = await axios.post(`${API_URL}/acide/count`, {
                collection,
                where
            });
            return response.data.count;
        } catch (error) {
            console.error('Error counting documents:', error);
            return 0;
        }
    }

    /**
     * Búsqueda de texto
     */
    async search(collection, searchTerm, fields = []) {
        try {
            const response = await axios.post(`${API_URL}/acide/search`, {
                collection,
                searchTerm,
                fields
            });
            return response.data.documents || [];
        } catch (error) {
            console.error('Error searching documents:', error);
            return [];
        }
    }

    /**
     * Exportar todos los datos
     */
    async exportAll() {
        try {
            const response = await axios.get(`${API_URL}/acide/export`);
            return response.data;
        } catch (error) {
            console.error('Error exporting data:', error);
            throw error;
        }
    }

    /**
     * Importar datos
     */
    async importAll(data) {
        try {
            await axios.post(`${API_URL}/acide/import`, { data });
            this.cache.clear();
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            throw error;
        }
    }

    /**
     * Limpiar cache
     */
    clearCache() {
        this.cache.clear();
    }
}

// Singleton
const acideService = new ACIDEService();

export default acideService;
