import { Type, AlignLeft, MousePointer, Image as ImageIcon, Box, Layout, Search, Video } from 'lucide-react';

/**
 * Definición de bloques básicos disponibles
 */
export const basicBlocks = [
    {
        id: 'heading',
        label: 'Título',
        icon: Type,
        category: 'text',
        template: {
            element: 'heading',
            id: '',
            class: 'heading-2',
            tag: 'h2',
            text: 'Nuevo Título'
        }
    },
    {
        id: 'text',
        label: 'Texto',
        icon: AlignLeft,
        category: 'text',
        template: {
            element: 'text',
            id: '',
            class: 'text-body',
            tag: 'p',
            text: 'Escribe tu texto aquí...'
        }
    },
    {
        id: 'image',
        label: 'Imagen',
        icon: ImageIcon,
        category: 'media',
        template: {
            element: 'image',
            id: '',
            class: 'w-full',
            src: '',
            alt: 'Imagen',
            width: '',
            height: ''
        }
    },
    {
        id: 'video',
        label: 'Video',
        icon: Video,
        category: 'media',
        template: {
            element: 'video',
            id: '',
            class: 'w-full',
            src: '',
            type: 'upload', // 'upload' o 'youtube'
            youtubeId: '',
            controls: true,
            autoplay: false,
            loop: false
        }
    },
    {
        id: 'button',
        label: 'Botón',
        icon: MousePointer,
        category: 'interactive',
        template: {
            element: 'button',
            id: '',
            class: 'btn btn-primary',
            text: 'Click aquí',
            link: '#',
            target: '_self'
        }
    },
    {
        id: 'search',
        label: 'Búsqueda',
        icon: Search,
        category: 'interactive',
        template: {
            element: 'search',
            id: '',
            class: 'card search-box',
            placeholder: 'Buscar...'
        }
    },
    {
        id: 'container',
        label: 'Contenedor',
        icon: Box,
        category: 'layout',
        template: {
            element: 'container',
            id: '',
            class: 'container',
            content: []
        }
    },
    {
        id: 'section',
        label: 'Sección',
        icon: Layout,
        category: 'layout',
        template: {
            element: 'section',
            id: '',
            class: 'section',
            content: []
        }
    }
];

/**
 * Bloques prediseñados (diseños completos)
 */
export const designBlocks = [
    {
        id: 'hero',
        label: 'Hero',
        category: 'sections',
        preview: '/previews/hero.jpg',
        template: {
            element: 'section',
            id: '',
            class: 'hero',
            content: [
                {
                    element: 'container',
                    id: '',
                    class: 'container hero-content',
                    content: [
                        {
                            element: 'heading',
                            id: '',
                            class: 'heading-1',
                            tag: 'h1',
                            text: 'Título Principal'
                        },
                        {
                            element: 'text',
                            id: '',
                            class: 'text-lead',
                            tag: 'p',
                            text: 'Subtítulo descriptivo'
                        },
                        {
                            element: 'button',
                            id: '',
                            class: 'btn btn-primary btn-lg',
                            text: 'Comenzar',
                            link: '#',
                            target: '_self'
                        }
                    ]
                }
            ]
        }
    },
    {
        id: 'cta',
        label: 'Call to Action',
        category: 'sections',
        preview: '/previews/cta.jpg',
        template: {
            element: 'section',
            id: '',
            class: 'section bg-primary text-white text-center',
            content: [
                {
                    element: 'container',
                    id: '',
                    class: 'container',
                    content: [
                        {
                            element: 'heading',
                            id: '',
                            class: 'heading-2 mb-md',
                            tag: 'h2',
                            text: '¿Listo para comenzar?'
                        },
                        {
                            element: 'text',
                            id: '',
                            class: 'text-body mb-lg',
                            tag: 'p',
                            text: 'Únete a miles de usuarios satisfechos'
                        },
                        {
                            element: 'button',
                            id: '',
                            class: 'btn btn-light btn-lg',
                            text: 'Registrarse Ahora',
                            link: '#',
                            target: '_self'
                        }
                    ]
                }
            ]
        }
    },
    {
        id: 'features',
        label: 'Características',
        category: 'sections',
        preview: '/previews/features.jpg',
        template: {
            element: 'section',
            id: '',
            class: 'section',
            content: [
                {
                    element: 'container',
                    id: '',
                    class: 'container',
                    content: [
                        {
                            element: 'heading',
                            id: '',
                            class: 'heading-2 text-center mb-xl',
                            tag: 'h2',
                            text: 'Características Principales'
                        },
                        {
                            element: 'container',
                            id: '',
                            class: 'grid grid-3 gap-lg',
                            content: [
                                {
                                    element: 'container',
                                    id: '',
                                    class: 'card text-center',
                                    content: [
                                        {
                                            element: 'heading',
                                            id: '',
                                            class: 'heading-4 mb-sm',
                                            tag: 'h3',
                                            text: 'Rápido'
                                        },
                                        {
                                            element: 'text',
                                            id: '',
                                            class: 'text-sm',
                                            tag: 'p',
                                            text: 'Rendimiento optimizado'
                                        }
                                    ]
                                },
                                {
                                    element: 'container',
                                    id: '',
                                    class: 'card text-center',
                                    content: [
                                        {
                                            element: 'heading',
                                            id: '',
                                            class: 'heading-4 mb-sm',
                                            tag: 'h3',
                                            text: 'Seguro'
                                        },
                                        {
                                            element: 'text',
                                            id: '',
                                            class: 'text-sm',
                                            tag: 'p',
                                            text: 'Protección avanzada'
                                        }
                                    ]
                                },
                                {
                                    element: 'container',
                                    id: '',
                                    class: 'card text-center',
                                    content: [
                                        {
                                            element: 'heading',
                                            id: '',
                                            class: 'heading-4 mb-sm',
                                            tag: 'h3',
                                            text: 'Escalable'
                                        },
                                        {
                                            element: 'text',
                                            id: '',
                                            class: 'text-sm',
                                            tag: 'p',
                                            text: 'Crece con tu negocio'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
];

/**
 * Generar ID único para un bloque
 */
export function generateBlockId(elementType) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${elementType}-${timestamp}-${random}`;
}

/**
 * Asignar IDs a un bloque y sus hijos recursivamente
 */
export function assignIds(block) {
    const newBlock = { ...block };
    newBlock.id = generateBlockId(block.element);

    if (newBlock.content && Array.isArray(newBlock.content)) {
        newBlock.content = newBlock.content.map(child => assignIds(child));
    }

    return newBlock;
}
