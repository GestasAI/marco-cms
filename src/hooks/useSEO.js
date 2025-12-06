import { useEffect } from 'react';

/**
 * Hook para gestionar SEO de una página
 * Actualiza meta tags, Open Graph, Twitter Cards, etc.
 * 
 * @param {Object} seoData - Datos SEO de la página
 * @returns {Object} Métodos para actualizar SEO
 * 
 * @example
 * useSEO({
 *   title: 'Mi Página',
 *   description: 'Descripción de mi página',
 *   keywords: ['keyword1', 'keyword2'],
 *   image: '/image.jpg',
 *   canonical: 'https://example.com/page'
 * });
 */
export function useSEO(seoData = {}) {
    useEffect(() => {
        if (!seoData) return;

        // Title
        if (seoData.title) {
            document.title = `${seoData.title} | Marco CMS`;
            updateMetaTag('og:title', seoData.title);
            updateMetaTag('twitter:title', seoData.title);
        }

        // Description
        if (seoData.description) {
            updateMetaTag('description', seoData.description);
            updateMetaTag('og:description', seoData.description);
            updateMetaTag('twitter:description', seoData.description);
        }

        // Keywords
        if (seoData.keywords && Array.isArray(seoData.keywords)) {
            updateMetaTag('keywords', seoData.keywords.join(', '));
        }

        // Image (Open Graph & Twitter)
        if (seoData.image) {
            const fullImageUrl = seoData.image.startsWith('http')
                ? seoData.image
                : `${window.location.origin}${seoData.image}`;

            updateMetaTag('og:image', fullImageUrl);
            updateMetaTag('twitter:image', fullImageUrl);
            updateMetaTag('twitter:card', 'summary_large_image');
        }

        // Canonical URL
        if (seoData.canonical) {
            updateLinkTag('canonical', seoData.canonical);
        }

        // Open Graph Type
        updateMetaTag('og:type', seoData.type || 'website');
        updateMetaTag('og:url', seoData.canonical || window.location.href);

        // Robots
        if (seoData.robots) {
            updateMetaTag('robots', seoData.robots);
        } else {
            updateMetaTag('robots', 'index, follow');
        }

        // Author
        if (seoData.author) {
            updateMetaTag('author', seoData.author);
        }

        // Published/Modified dates
        if (seoData.publishedTime) {
            updateMetaTag('article:published_time', seoData.publishedTime);
        }
        if (seoData.modifiedTime) {
            updateMetaTag('article:modified_time', seoData.modifiedTime);
        }

        // Language
        document.documentElement.lang = seoData.lang || 'es';

    }, [seoData]);

    const updateMetaTag = (name, content) => {
        if (!content) return;

        const isProperty = name.startsWith('og:') || name.startsWith('article:');
        const attribute = isProperty ? 'property' : 'name';

        let element = document.querySelector(`meta[${attribute}="${name}"]`);

        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attribute, name);
            document.head.appendChild(element);
        }

        element.setAttribute('content', content);
    };

    const updateLinkTag = (rel, href) => {
        if (!href) return;

        let element = document.querySelector(`link[rel="${rel}"]`);

        if (!element) {
            element = document.createElement('link');
            element.setAttribute('rel', rel);
            document.head.appendChild(element);
        }

        element.setAttribute('href', href);
    };

    return {
        updateSEO: (newData) => {
            // Permite actualizar SEO dinámicamente
            Object.assign(seoData, newData);
        }
    };
}
