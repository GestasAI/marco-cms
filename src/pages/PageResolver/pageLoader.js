import { acideService } from '../../acide/acideService';

const RESERVED_SLUGS = [
    'admin', 'dashboard', 'login', 'editor',
    'pages', 'posts', 'media', 'products',
    'categories', 'tags', 'settings', 'documentation',
    'theme-parts', 'theme-settings', 'themes', 'build',
    'seo', 'academy', 'users', 'ads'
];

export function isReservedSlug(slug) {
    return RESERVED_SLUGS.includes(slug);
}

export function normalizeSlug(slug) {
    return !slug || slug === '' ? 'home' : slug;
}

export async function loadHomeFromActiveTheme() {
    try {
        const homeData = await acideService.getActiveThemeHome();
        console.log(' Cargado home desde tema activo');
        return homeData;
    } catch (err) {
        console.warn('No se pudo cargar home del tema activo:', err.message);
        return null;
    }
}

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

export async function loadPageFromJSON(slug) {
    try {
        const response = await fetch(`/data/pages/${slug}.json`);
        if (response.ok) {
            // ROBUSTNESS: Check if response is actually JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                console.warn(`Se esperaba JSON pero se recibió HTML para /data/pages/${slug}.json`);
                return null;
            }

            const pageData = await response.json();
            console.log(` Cargado desde /data/pages/${slug}.json`);
            return pageData;
        }
        return null;
    } catch (err) {
        console.warn('Carga desde /data/pages falló:', err);
        return null;
    }
}

export async function loadPageData(slug) {
    const normalizedSlug = normalizeSlug(slug);

    if (isReservedSlug(normalizedSlug)) {
        return null;
    }

    if (normalizedSlug === 'home') {
        const homeData = await loadHomeFromActiveTheme();
        if (homeData) return homeData;
    }

    let pageData = await loadPageFromACIDE(normalizedSlug);
    if (pageData) return pageData;

    pageData = await loadPageFromJSON(normalizedSlug);

    return pageData;
}
