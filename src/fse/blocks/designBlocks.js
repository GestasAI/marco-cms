import { Box, Layout, Star, Zap, Layers, Columns } from 'lucide-react';

/**
 * Bloques de diseño avanzados (Layout y Estructura)
 * Utilizamos una estrategia de doble clase: [clase-tema] [clase-cms]
 * Ejemplo: 'section mc-section' permite que el tema aplique sus estilos
 * mientras que 'mc-section' nos da un hook estable para el editor.
 */
export const designBlocks = [
    {
        id: 'section',
        label: 'Sección',
        icon: Layout,
        category: 'layout',
        template: {
            element: 'section',
            id: '',
            class: 'section mc-section',
            content: [],
            settings: {
                layout: { width: 'full-width', maxWidth: '100%' },
                spacing: { padding: '40px 0', margin: '0' },
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
            class: 'container mc-container',
            content: [],
            settings: {
                layout: { width: 'boxed', maxWidth: '1200px' },
                spacing: { padding: '20px', margin: '0 auto' },
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
            class: 'columns mc-columns',
            content: [
                {
                    element: 'column',
                    id: `col-1-${Date.now()}`,
                    class: 'column mc-column',
                    content: [],
                    settings: { spacing: { padding: '15px' } }
                },
                {
                    element: 'column',
                    id: `col-2-${Date.now()}`,
                    class: 'column mc-column',
                    content: [],
                    settings: { spacing: { padding: '15px' } }
                }
            ],
            settings: {
                layout: { gap: '20px', align: 'stretch', justify: 'flex-start' },
                spacing: { padding: '0', margin: '0' },
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
            class: 'card mc-card shadow-sm',
            content: [],
            settings: {
                spacing: { padding: '20px', margin: '10px' },
                border: { radius: '8px', width: '1px', color: '#eee', style: 'solid' },
                background: { type: 'color', color: '#ffffff' }
            }
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
            class: 'grid mc-grid',
            content: [],
            settings: {
                layout: { columns: 3, gap: '20px' },
                spacing: { padding: '20px', margin: '0' },
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
            class: 'nav mc-nav',
            content: [],
            settings: {
                layout: { justify: 'space-between', align: 'center' },
                spacing: { padding: '10px 20px', margin: '0' }
            }
        }
    }
];
