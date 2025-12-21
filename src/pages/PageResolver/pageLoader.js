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
 * Carga la home del tema activo desde ACIDE
 */
export async function loadHomeFromActiveTheme() {
    try {
        const homeData = await acideService.getActiveThemeHome();
        console.log('✅ Cargado home desde tema activo');
        return homeData;
    } catch (err) {
        console.warn('No se pudo cargar home del tema activo:', err.message);
        return null;
    }
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
 * 1. Si es 'home' → Carga desde el tema activo (dinámico)
 * 2. Desde ACIDE (contenido creado por el usuario)
 * 3. Desde /data/pages (fallback para desarrollo)
 * 
 * NOTA: En producción, ACIDE generará HTML estático del tema activo.
 */
export async function loadPageData(slug) {
    const normalizedSlug = normalizeSlug(slug);

    // Verificar si es slug reservado
    if (isReservedSlug(normalizedSlug)) {
        return null;
    }

    // 1. Si es home, cargar desde el tema activo
    if (normalizedSlug === 'home') {
        const homeData = await loadHomeFromActiveTheme();
        if (homeData) return homeData;
    }

    // 2. Intentar cargar desde ACIDE (contenido del usuario)
    let pageData = await loadPageFromACIDE(normalizedSlug);
    if (pageData) return pageData;

    // 3. Fallback: cargar desde /data/pages
    pageData = await loadPageFromJSON(normalizedSlug);

    return pageData;
}
