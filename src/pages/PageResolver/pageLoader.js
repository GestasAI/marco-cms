import { acideService } from '../../acide/acideService';

/**
 * Slugs reservados que no deben ser cargados como páginas
 */
const RESERVED_SLUGS = [
    'admin', 'dashboard', 'login', 'editor',
    'pages', 'posts', 'media', 'products',
    'categories', 'tags', 'settings'
];

/**
 * Verifica si un slug está reservado
 */
export function isReservedSlug(slug) {
    return RESERVED_SLUGS.includes(slug);
}

/**
 * Normaliza el slug (convierte vacío a 'inicio')
 */
export function normalizeSlug(slug) {
    return !slug || slug === '' ? 'inicio' : slug;
}

/**
 * Intenta cargar una página desde ACIDE
 */
export async function loadPageFromACIDE(slug) {
    try {
        const result = await acideService.query('pages', {
            where: [['slug', '=', slug]],
            limit: 1
        });

        if (result?.items && result.items.length > 0) {
            return result.items[0];
        }

        return null;
    } catch (err) {
        console.warn('Query ACIDE falló:', err);
        return null;
    }
}

/**
 * Intenta cargar una página desde archivo JSON
 */
export async function loadPageFromJSON(slug) {
    try {
        const response = await fetch(`/data/pages/${slug}.json`);
        if (response.ok) {
            const pageData = await response.json();
            console.log('✅ Cargado directamente desde archivo JSON');
            return pageData;
        }
        return null;
    } catch (err) {
        console.warn('Carga directa desde JSON falló:', err);
        return null;
    }
}

/**
 * Carga una página intentando primero ACIDE y luego JSON
 */
export async function loadPageData(slug) {
    const normalizedSlug = normalizeSlug(slug);

    // Verificar si es slug reservado
    if (isReservedSlug(normalizedSlug)) {
        return null;
    }

    // Intentar cargar desde ACIDE
    let pageData = await loadPageFromACIDE(normalizedSlug);

    // Si no se encuentra, intentar desde JSON
    if (!pageData) {
        pageData = await loadPageFromJSON(normalizedSlug);
    }

    return pageData;
}
