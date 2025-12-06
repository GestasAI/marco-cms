import { useEffect } from 'react';

/**
 * Hook para agregar datos estructurados (Schema.org) a una página
 * Genera JSON-LD para Rich Snippets en Google
 * 
 * @param {Object|Array} schema - Schema.org data
 * @param {string} id - ID único para el script tag
 * 
 * @example
 * useStructuredData({
 *   '@context': 'https://schema.org',
 *   '@type': 'Article',
 *   headline: 'Mi Artículo',
 *   author: { '@type': 'Person', name: 'Juan' }
 * }, 'article-schema');
 */
export function useStructuredData(schema, id = 'structured-data') {
    useEffect(() => {
        if (!schema) return;

        const scriptId = `schema-${id}`;
        let scriptElement = document.getElementById(scriptId);

        if (!scriptElement) {
            scriptElement = document.createElement('script');
            scriptElement.id = scriptId;
            scriptElement.type = 'application/ld+json';
            document.head.appendChild(scriptElement);
        }

        scriptElement.textContent = JSON.stringify(schema, null, 2);

        return () => {
            const element = document.getElementById(scriptId);
            if (element) {
                element.remove();
            }
        };
    }, [schema, id]);
}

/**
 * Generadores de Schema.org para diferentes tipos de contenido
 */
export const SchemaGenerators = {
    /**
     * Genera Schema para un artículo
     */
    article: (data) => ({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image ? [data.image] : undefined,
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
        author: {
            '@type': 'Person',
            name: data.author?.name || 'Marco CMS',
            url: data.author?.url
        },
        publisher: {
            '@type': 'Organization',
            name: 'Marco CMS',
            logo: {
                '@type': 'ImageObject',
                url: `${window.location.origin}/logo.png`
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url || window.location.href
        }
    }),

    /**
     * Genera Schema para una organización
     */
    organization: (data) => ({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name || 'Marco CMS',
        url: data.url || window.location.origin,
        logo: data.logo || `${window.location.origin}/logo.png`,
        description: data.description,
        sameAs: data.socialLinks || [],
        contactPoint: data.contact ? {
            '@type': 'ContactPoint',
            telephone: data.contact.phone,
            contactType: data.contact.type || 'customer service',
            email: data.contact.email
        } : undefined
    }),

    /**
     * Genera Schema para un sitio web
     */
    website: (data) => ({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data.name || 'Marco CMS',
        url: data.url || window.location.origin,
        description: data.description,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${data.url || window.location.origin}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    }),

    /**
     * Genera Schema para breadcrumbs
     */
    breadcrumb: (items) => ({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    }),

    /**
     * Genera Schema para FAQ
     */
    faq: (questions) => ({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map(q => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer
            }
        }))
    }),

    /**
     * Genera Schema para HowTo
     */
    howTo: (data) => ({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: data.name,
        description: data.description,
        image: data.image,
        totalTime: data.totalTime,
        estimatedCost: data.cost,
        tool: data.tools?.map(tool => ({
            '@type': 'HowToTool',
            name: tool
        })),
        supply: data.supplies?.map(supply => ({
            '@type': 'HowToSupply',
            name: supply
        })),
        step: data.steps?.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
            image: step.image,
            url: step.url
        }))
    }),

    /**
     * Genera Schema para AI-Native Content (Futuro)
     * Estructura de inferencia para consumo de IA
     */
    aiNative: (data) => ({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: data.name,
        description: data.description,
        // Relaciones semánticas explícitas
        about: data.entities?.map(entity => ({
            '@type': entity.type || 'Thing',
            name: entity.name,
            identifier: entity.id
        })),
        // Inferencias explícitas
        'ai:inference': data.inferences?.map(inf => ({
            'ai:subject': inf.subject,
            'ai:predicate': inf.predicate,
            'ai:object': inf.object,
            'ai:confidence': inf.confidence
        })),
        // Relaciones entre entidades
        'ai:relationships': data.relationships?.map(rel => ({
            'ai:entity1': rel.entity1,
            'ai:relation': rel.type,
            'ai:entity2': rel.entity2,
            'ai:strength': rel.strength
        }))
    })
};
