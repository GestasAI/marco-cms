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
 * Obtiene el tema activo desde settings
 */
async function getActiveTheme() {
    try {
        const settings = await acideService.get('theme_settings', 'current');
        return settings?.active_theme || 'gestasai-default';
    } catch (err) {
        console.warn('No se pudo obtener tema activo, usando default');
        return 'gestasai-default';
    }
}

/**
 * Intenta cargar una página desde el tema activo
 */
export async function loadPageFromTheme(slug) {
    try {
        const activeTheme = await getActiveTheme();
        const response = await fetch(`/themes/${activeTheme}/pages/${slug}.json`);

        if (response.ok) {
            const pageData = await response.json();
            console.log(`✅ Cargado desde tema: ${activeTheme}/pages/${slug}.json`);
            return pageData;
        }
        return null;
    } catch (err) {
        console.warn('Carga desde tema falló:', err);
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
            console.log('✅ Cargado desde /data/pages');
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
 * 1. Desde el tema activo (para 'home' y páginas específicas del tema)
 * 2. Desde ACIDE (contenido creado por el usuario)
 * 3. Desde /data/pages (fallback)
 */
export async function loadPageData(slug) {
    const normalizedSlug = normalizeSlug(slug);

    // Verificar si es slug reservado
    if (isReservedSlug(normalizedSlug)) {
        return null;
    }

    // 1. Intentar cargar desde el tema activo (especialmente para 'home')
    let pageData = await loadPageFromTheme(normalizedSlug);
    if (pageData) return pageData;

    // 2. Intentar cargar desde ACIDE (contenido del usuario)
    pageData = await loadPageFromACIDE(normalizedSlug);
    if (pageData) return pageData;

    // 3. Fallback: cargar desde /data/pages
    pageData = await loadPageFromJSON(normalizedSlug);

    return pageData;
}
