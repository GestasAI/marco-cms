import { Type, AlignLeft, MousePointer, Image as ImageIcon, List, Code, FileCode, Search, Video } from 'lucide-react';

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
            text: 'Nuevo Título',
            dynamic: { enabled: false, source: '', field: '' }
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
            class: 'text-base',
            tag: 'p',
            text: 'Escribe aquí tu contenido...',
            dynamic: { enabled: false, source: '', field: '' }
        }
    },
    {
        id: 'button',
        label: 'Botón',
        icon: MousePointer,
        category: 'action',
        template: {
            element: 'button',
            id: '',
            class: 'btn btn-primary',
            text: 'Haz clic aquí',
            link: '#',
            dynamic: { enabled: false, source: '', field: '' }
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
            class: 'img-fluid rounded',
            src: '',
            alt: 'Descripción de imagen',
            dynamic: { enabled: false, source: '', field: '' }
        }
    },
    {
        id: 'list',
        label: 'Lista',
        icon: List,
        category: 'text',
        template: {
            element: 'list',
            id: '',
            class: 'list-default',
            tag: 'ul',
            items: ['Elemento 1', 'Elemento 2', 'Elemento 3'],
            dynamic: { enabled: false, source: '', field: '' }
        }
    },
    {
        id: 'html',
        label: 'HTML',
        icon: Code,
        category: 'advanced',
        template: {
            element: 'html',
            id: '',
            class: 'custom-html',
            content: '<div>Contenido HTML personalizado</div>',
            dynamic: { enabled: false, source: '', field: '' }
        }
    },
    {
        id: 'code',
        label: 'Código',
        icon: FileCode,
        category: 'advanced',
        template: {
            element: 'code',
            id: '',
            class: 'code-block',
            code: '// Tu código aquí',
            language: 'javascript',
            dynamic: { enabled: false, source: '', field: '' }
        }
    },
    {
        id: 'search',
        label: 'Buscador',
        icon: Search,
        category: 'action',
        template: {
            element: 'search',
            id: '',
            class: 'search-form',
            placeholder: 'Buscar...'
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
            class: 'video-wrapper',
            type: 'youtube',
            youtubeId: '',
            src: '',
            controls: true,
            autoplay: false,
            loop: false,
            muted: false,
            poster: ''
        }
    }
];
