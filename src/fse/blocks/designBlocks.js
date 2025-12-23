import { Box, Layout, Star, Zap, Layers, Columns } from 'lucide-react';

export const designBlocks = [
    {
        id: 'section',
        label: 'Sección',
        icon: Layout,
        category: 'layout',
        template: {
            element: 'section',
            id: '',
            class: 'section',
            content: [],
            settings: {
                background: { type: 'none', color: '', gradient: '', image: '', video: '', overlay: { enabled: false, color: 'rgba(0,0,0,0.5)', opacity: 0.5 } }
            }
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
            content: [],
            settings: {
                background: { type: 'none', color: '', gradient: '', image: '', video: '', overlay: { enabled: false, color: 'rgba(0,0,0,0.5)', opacity: 0.5 } }
            }
        }
    },
    {
        id: 'columns',
        label: 'Columnas',
        icon: Columns,
        category: 'layout',
        template: {
            element: 'columns',
            id: '',
            class: 'columns',
            content: [
                { element: 'column', id: `col-1-${Date.now()}`, class: 'column', content: [] },
                { element: 'column', id: `col-2-${Date.now()}`, class: 'column', content: [] }
            ],
            settings: {
                gap: '20px',
                align: 'stretch',
                background: { type: 'none', color: '', gradient: '', image: '', video: '', overlay: { enabled: false, color: 'rgba(0,0,0,0.5)', opacity: 0.5 } }
            }
        }
    },
    {
        id: 'card',
        label: 'Tarjeta',
        icon: Star,
        category: 'design',
        template: {
            element: 'card',
            id: '',
            class: 'card shadow-sm p-md',
            content: []
        }
    },
    {
        id: 'grid',
        label: 'Cuadrícula',
        icon: Zap,
        category: 'layout',
        template: {
            element: 'grid',
            id: '',
            class: 'grid-layout',
            content: [],
            settings: {
                columns: 3,
                gap: '20px',
                background: { type: 'none', color: '', gradient: '', image: '', video: '', overlay: { enabled: false, color: 'rgba(0,0,0,0.5)', opacity: 0.5 } }
            }
        }
    },
    {
        id: 'nav',
        label: 'Navegación',
        icon: Layers,
        category: 'layout',
        template: {
            element: 'nav',
            id: '',
            class: 'nav-container',
            content: []
        }
    }
];
