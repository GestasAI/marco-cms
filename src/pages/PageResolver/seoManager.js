/**
 * Actualiza una meta tag en el documento
 */
export function updateMetaTag(name, content) {
    if (!content) return;

    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
    }
    tag.content = content;
}

/**
 * Actualiza una Open Graph tag en el documento
 */
export function updateOGTag(property, content) {
    if (!content) return;

    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
    }
    tag.content = content;
}

/**
 * Actualiza el canonical link
 */
export function updateCanonicalLink(href) {
    if (!href) return;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = href;
}

/**
 * Aplica todos los metadatos SEO de una página
 */
export function applySEOMetadata(page) {
    if (!page?.seo) return;

    // Título
    document.title = page.seo.meta_title || page.title || 'Marco CMS';

    // Meta tags básicos
    updateMetaTag('description', page.seo.meta_description);
    updateMetaTag('keywords', page.seo.meta_keywords);

    // Open Graph
    updateOGTag('og:title', page.seo.og_title);
    updateOGTag('og:description', page.seo.og_description);
    updateOGTag('og:image', page.seo.og_image);
    updateOGTag('og:type', 'website');

    // Canonical
    updateCanonicalLink(page.seo.canonical);
}
