/**
 * ACIDE Service (Simulado)
 *
 * Este es un mock del servicio que se comunicaría con el motor de contenido ACIDE.
 * En una implementación real, usaría `fetch` o `axios` para hacer llamadas HTTP.
 * Por ahora, utiliza localStorage para simular la persistencia de datos.
 */

const simulateDelay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export const acideService = {
    /**
     * Obtiene un documento por su schema y ID.
     * @param {string} schema - El nombre del schema (ej: 'theme_settings').
     * @param {string} id - El ID del documento (ej: 'current').
     * @returns {Promise<object>} El documento encontrado.
     */
    get: async (schema, id) => {
        await simulateDelay();
        const key = `${schema}_${id}`;
        const data = localStorage.getItem(key);

        if (!data) {
            console.warn(`ACIDE Mock: No se encontró el documento para la clave ${key}.`);
            // Lanzamos un error similar a una respuesta 404 de API.
            throw new Error(`404: Documento no encontrado para ${key}`);
        }

        console.log(`ACIDE Mock: Documento cargado para ${key}.`);
        return JSON.parse(data);
    },

    /**
     * Actualiza (o crea) un documento.
     * @param {string} schema - El nombre del schema.
     * @param {string} id - El ID del documento.
     * @param {object} data - Los nuevos datos para el documento.
     * @returns {Promise<object>} El documento actualizado.
     */
    update: async (schema, id, data) => {
        await simulateDelay(500); // Simular un delay de guardado más largo
        const key = `${schema}_${id}`;

        localStorage.setItem(key, JSON.stringify(data));
        console.log(`ACIDE Mock: Documento guardado para ${key}.`);
        return data;
    },
};