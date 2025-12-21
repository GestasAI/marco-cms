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
 * Normaliza el slug (convierte vacío a 'home')
 */
export function normalizeSlug(slug) {
    return !slug || slug === '' ? 'home' : slug;
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
 * Intenta cargar una página desde archivo JSON en /data/pages
 */
export async function loadPageFromJSON(slug) {
    try {
        const response = await fetch(`/data/pages/${slug}.json`);
        if (response.ok) {
            const pageData = await response.json();
            console.log(`✅ Cargado desde /data/pages/${slug}.json`);
            return pageData;
        }
        return null;
    } catch (err) {
        console.warn('Carga desde /data/pages falló:', err);
        return null;
    }
}

/**
 * Carga una página con el siguiente orden de prioridad:
 * 1. Desde ACIDE (contenido creado por el usuario)
 * 2. Desde /data/pages (fallback para desarrollo)
 * 
 * NOTA: En producción, ACIDE generará HTML estático del tema activo.
 * El tema se aplica mediante theme.css que se carga dinámicamente.
 */
export async function loadPageData(slug) {
    const normalizedSlug = normalizeSlug(slug);

    // Verificar si es slug reservado
    if (isReservedSlug(normalizedSlug)) {
        return null;
    }

    // 1. Intentar cargar desde ACIDE (contenido del usuario)
    let pageData = await loadPageFromACIDE(normalizedSlug);
    if (pageData) return pageData;

    // 2. Fallback: cargar desde /data/pages
    pageData = await loadPageFromJSON(normalizedSlug);

    return pageData;
}
