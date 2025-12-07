/**
 * 🧱 Default FSE Templates
 * 
 * These templates are used when the active theme does not provide a specific template file.
 * They ensure the site is always functional.
 */

export const DEFAULT_TEMPLATES = {
    // -------------------------------------------------------------------------
    // HEADER & FOOTER PARTS
    // -------------------------------------------------------------------------
    'part/header': {
        type: 'response',
        blocks: [
            {
                type: 'core/group',
                className: 'w-full bg-white border-b border-gray-100 py-md',
                blocks: [
                    {
                        type: 'core/container',
                        className: 'container flex-between',
                        blocks: [
                            { type: 'core/site-title', tag: 'h1', className: 'text-xl font-bold' },
                            { type: 'core/nav-menu', className: 'flex gap-md' }
                        ]
                    }
                ]
            }
        ]
    },

    'part/footer': {
        type: 'response',
        blocks: [
            {
                type: 'core/group',
                className: 'w-full bg-gray-900 text-white py-xl mt-auto',
                blocks: [
                    {
                        type: 'core/container',
                        className: 'container text-center text-sm text-gray-400',
                        blocks: [
                            { type: 'core/paragraph', content: '© 2024 GestasAI. Powered by Marco CMS.' }
                        ]
                    }
                ]
            }
        ]
    },

    // -------------------------------------------------------------------------
    // PAGE TEMPLATES
    // -------------------------------------------------------------------------

    // SINGLE (Posts, Pages, Products)
    'single': {
        type: 'template',
        blocks: [
            { type: 'core/template-part', slug: 'header' },
            {
                type: 'core/group',
                className: 'container py-xl max-w-4xl mx-auto',
                blocks: [
                    {
                        type: 'core/post-title',
                        tag: 'h1',
                        className: 'text-4xl font-bold mb-md',
                        placeholder: 'Añade el título aquí...'
                    },
                    {
                        type: 'core/post-meta',
                        className: 'text-gray-500 mb-lg flex gap-sm'
                    },
                    {
                        type: 'core/post-featured-image',
                        className: 'w-full aspect-video object-cover rounded-lg mb-xl bg-gray-100'
                    },
                    {
                        type: 'core/post-content',
                        className: 'prose prose-lg max-w-none'
                    }
                ]
            },
            { type: 'core/template-part', slug: 'footer' }
        ]
    },

    // ARCHIVE (Blog Index, Categories)
    'archive': {
        type: 'template',
        blocks: [
            { type: 'core/template-part', slug: 'header' },
            {
                type: 'core/group',
                className: 'container py-xl',
                blocks: [
                    {
                        type: 'core/archive-title',
                        tag: 'h1',
                        className: 'text-3xl font-bold mb-xl'
                    },
                    {
                        type: 'core/query-loop',
                        className: 'grid grid-3 gap-lg',
                        innerBlocks: [
                            {
                                type: 'core/post-card',
                                blocks: [
                                    { type: 'core/post-featured-image', className: 'aspect-video mb-md rounded' },
                                    { type: 'core/post-title', link: true, className: 'text-xl font-bold mb-sm' },
                                    { type: 'core/post-excerpt', className: 'text-gray-600 mb-md' },
                                    { type: 'core/read-more', text: 'Leer más', className: 'text-blue-600 font-medium' }
                                ]
                            }
                        ]
                    }
                ]
            },
            { type: 'core/template-part', slug: 'footer' }
        ]
    },

    // 404 ERROR
    '404': {
        type: 'template',
        blocks: [
            { type: 'core/template-part', slug: 'header' },
            {
                type: 'core/group',
                className: 'container py-32 text-center',
                blocks: [
                    { type: 'core/heading', level: 1, content: '404', className: 'text-6xl font-black text-gray-200 mb-md' },
                    { type: 'core/heading', level: 2, content: 'Página no encontrada', className: 'text-2xl font-bold mb-md' },
                    { type: 'core/paragraph', content: 'Parece que te has perdido. Vuelve al inicio.', className: 'text-gray-500 mb-lg' },
                    { type: 'core/button', text: 'Ir al Inicio', link: '/', className: 'btn btn-primary' }
                ]
            },
            { type: 'core/template-part', slug: 'footer' }
        ]
    }
};
