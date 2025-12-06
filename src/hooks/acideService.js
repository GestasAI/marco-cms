import { acideRequest } from './acideRequest';

/**
 * 🎨 Marco CMS - ACIDE Service
 *
 * Este servicio centraliza todas las operaciones de lectura/escritura
 * con el motor ACIDE embebido. En desarrollo, utiliza un middleware
 * de Vite para interactuar con el sistema de archivos local (Node.js).
 *
 * Principio: El frontend NUNCA interactúa directamente con `fs`.
 * Solo envía peticiones a una API local simulada que el middleware intercepta.
 */

/**
 * Obtiene un único documento del motor ACIDE.
 *
 * @param {string} schema - El nombre del schema (ej: 'pages', 'posts', 'theme_settings').
 * @param {string} id - El ID del documento (nombre del archivo sin extensión).
 * @returns {Promise<Object>} El contenido del documento parseado.
 * @throws {Error} Si el documento no se encuentra o hay un error.
 */
const get = async (schema, id) => {
  console.log(`[ACIDE Service] GET: schema=${schema}, id=${id}`);
  try {
    const data = await acideRequest(`/api/acide/get/${schema}/${id}`);
    return data;
  } catch (error) {
    console.error(`[ACIDE Service] Error en GET para ${schema}/${id}:`, error.message);
    throw error;
  }
};

/**
 * Obtiene una lista de documentos de un schema.
 *
 * @param {string} schema - El nombre del schema.
 * @param {Object} [options] - Opciones de consulta (filtros, orden, etc.).
 * @returns {Promise<Array<Object>>} Un array de documentos.
 */
const list = async (schema, options = {}) => {
  console.log(`[ACIDE Service] LIST: schema=${schema}`, options);
  try {
    // Las opciones se pueden pasar como query params
    const queryString = new URLSearchParams(options).toString();
    const data = await acideRequest(`/api/acide/list/${schema}?${queryString}`);
    return data;
  } catch (error) {
    console.error(`[ACIDE Service] Error en LIST para ${schema}:`, error.message);
    throw error;
  }
};

/**
 * Crea un nuevo documento.
 *
 * @param {string} schema - El nombre del schema.
 * @param {string} id - El ID para el nuevo documento.
 * @param {Object} content - El contenido a escribir en el archivo.
 * @returns {Promise<Object>} La respuesta del servidor.
 */
const create = async (schema, id, content) => {
  console.log(`[ACIDE Service] CREATE: schema=${schema}, id=${id}`);
  try {
    const data = await acideRequest(`/api/acide/create/${schema}/${id}`, {
      method: 'POST',
      body: JSON.stringify(content),
    });
    return data;
  } catch (error) {
    console.error(`[ACIDE Service] Error en CREATE para ${schema}/${id}:`, error.message);
    throw error;
  }
};

/**
 * Actualiza un documento existente.
 *
 * @param {string} schema - El nombre del schema.
 * @param {string} id - El ID del documento a actualizar.
 * @param {Object} content - El nuevo contenido del documento.
 * @returns {Promise<Object>} La respuesta del servidor.
 */
const update = async (schema, id, content) => {
  console.log(`[ACIDE Service] UPDATE: schema=${schema}, id=${id}`);
  try {
    const data = await acideRequest(`/api/acide/update/${schema}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });
    return data;
  } catch (error) {
    console.error(`[ACIDE Service] Error en UPDATE para ${schema}/${id}:`, error.message);
    throw error;
  }
};

/**
 * Elimina un documento.
 *
 * @param {string} schema - El nombre del schema.
 * @param {string} id - El ID del documento a eliminar.
 * @returns {Promise<Object>} La respuesta del servidor.
 */
const remove = async (schema, id) => {
  console.log(`[ACIDE Service] DELETE: schema=${schema}, id=${id}`);
  try {
    return await acideRequest(`/api/acide/delete/${schema}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`[ACIDE Service] Error en DELETE para ${schema}/${id}:`, error.message);
    throw error;
  }
};

export const acideService = {
  get,
  list,
  create,
  update,
  remove,
};