/**
 * Sistema de Clases CSS del Tema
 * Lee las clases disponibles del theme.css activo
 */

// Clases extraídas del theme.css de gestasai-default
export const cssClasses = {
    // HEADINGS
    headings: {
        label: 'Títulos',
        classes: [
            { id: 'heading-1', label: 'Heading 1', value: 'heading-1', preview: 'H1 - 3.75rem' },
            { id: 'heading-2', label: 'Heading 2', value: 'heading-2', preview: 'H2 - 3rem' },
            { id: 'heading-3', label: 'Heading 3', value: 'heading-3', preview: 'H3 - 2.25rem' },
            { id: 'heading-4', label: 'Heading 4', value: 'heading-4', preview: 'H4 - 1.875rem' },
            { id: 'heading-5', label: 'Heading 5', value: 'heading-5', preview: 'H5 - 1.5rem' },
            { id: 'heading-6', label: 'Heading 6', value: 'heading-6', preview: 'H6 - 1.25rem' }
        ]
    },

    // TEXT
    text: {
        label: 'Texto',
        classes: [
            { id: 'text-lead', label: 'Text Lead', value: 'text-lead', preview: 'Texto destacado' },
            { id: 'text-body', label: 'Text Body', value: 'text-body', preview: 'Texto normal' },
            { id: 'text-sm', label: 'Text Small', value: 'text-sm', preview: 'Texto pequeño' },
            { id: 'text-xs', label: 'Text XSmall', value: 'text-xs', preview: 'Texto muy pequeño' }
        ]
    },

    // TEXT ALIGNMENT
    alignment: {
        label: 'Alineación',
        classes: [
            { id: 'text-left', label: 'Izquierda', value: 'text-left' },
            { id: 'text-center', label: 'Centro', value: 'text-center' },
            { id: 'text-right', label: 'Derecha', value: 'text-right' }
        ]
    },

    // TEXT COLORS
    textColors: {
        label: 'Color de Texto',
        classes: [
            { id: 'text-primary', label: 'Primary', value: 'text-primary', color: '#6366f1' },
            { id: 'text-secondary', label: 'Secondary', value: 'text-secondary', color: '#475569' },
            { id: 'text-white', label: 'White', value: 'text-white', color: '#ffffff' },
            { id: 'text-black', label: 'Black', value: 'text-black', color: '#000000' }
        ]
    },

    // BACKGROUND COLORS
    bgColors: {
        label: 'Color de Fondo',
        classes: [
            { id: 'bg-primary', label: 'Primary', value: 'bg-primary', color: '#6366f1' },
            { id: 'bg-secondary', label: 'Secondary', value: 'bg-secondary', color: '#ec4899' },
            { id: 'bg-white', label: 'White', value: 'bg-white', color: '#ffffff' },
            { id: 'bg-gradient', label: 'Gradient', value: 'bg-gradient' }
        ]
    },

    // SPACING - PADDING
    padding: {
        label: 'Padding',
        classes: [
            { id: 'p-xs', label: 'XS (0.25rem)', value: 'p-xs' },
            { id: 'p-sm', label: 'SM (0.5rem)', value: 'p-sm' },
            { id: 'p-md', label: 'MD (1rem)', value: 'p-md' },
            { id: 'p-lg', label: 'LG (1.5rem)', value: 'p-lg' },
            { id: 'p-xl', label: 'XL (2rem)', value: 'p-xl' },
            { id: 'p-2xl', label: '2XL (3rem)', value: 'p-2xl' }
        ]
    },

    // SPACING - MARGIN
    margin: {
        label: 'Margin',
        classes: [
            { id: 'm-xs', label: 'XS (0.25rem)', value: 'm-xs' },
            { id: 'm-sm', label: 'SM (0.5rem)', value: 'm-sm' },
            { id: 'm-md', label: 'MD (1rem)', value: 'm-md' },
            { id: 'm-lg', label: 'LG (1.5rem)', value: 'm-lg' },
            { id: 'm-xl', label: 'XL (2rem)', value: 'm-xl' },
            { id: 'm-2xl', label: '2XL (3rem)', value: 'm-2xl' }
        ]
    },

    // LAYOUT
    layout: {
        label: 'Layout',
        classes: [
            { id: 'container', label: 'Container', value: 'container' },
            { id: 'flex', label: 'Flex', value: 'flex' },
            { id: 'flex-center', label: 'Flex Center', value: 'flex-center' },
            { id: 'flex-between', label: 'Flex Between', value: 'flex-between' },
            { id: 'grid', label: 'Grid', value: 'grid' },
            { id: 'grid-2', label: 'Grid 2 Cols', value: 'grid-2' },
            { id: 'grid-3', label: 'Grid 3 Cols', value: 'grid-3' }
        ]
    },

    // BUTTONS
    buttons: {
        label: 'Botones',
        classes: [
            { id: 'btn', label: 'Button Base', value: 'btn' },
            { id: 'btn-primary', label: 'Primary', value: 'btn btn-primary' },
            { id: 'btn-secondary', label: 'Secondary', value: 'btn btn-secondary' },
            { id: 'btn-outline', label: 'Outline', value: 'btn btn-outline' }
        ]
    },

    // SECTIONS
    sections: {
        label: 'Secciones',
        classes: [
            { id: 'hero', label: 'Hero', value: 'hero' },
            { id: 'hero-content', label: 'Hero Content', value: 'hero-content' },
            { id: 'section', label: 'Section', value: 'section' },
            { id: 'section-dark', label: 'Section Dark', value: 'section section-dark' }
        ]
    },

    // UTILITIES
    utilities: {
        label: 'Utilidades',
        classes: [
            { id: 'w-full', label: 'Width Full', value: 'w-full' },
            { id: 'rounded', label: 'Rounded', value: 'rounded' },
            { id: 'shadow', label: 'Shadow', value: 'shadow' },
            { id: 'shadow-lg', label: 'Shadow Large', value: 'shadow-lg' }
        ]
    }
};

/**
 * Obtener todas las clases como array plano
 */
export function getAllClasses() {
    const allClasses = [];
    Object.values(cssClasses).forEach(category => {
        allClasses.push(...category.classes);
    });
    return allClasses;
}

/**
 * Buscar clase por valor
 */
export function getClassByValue(value) {
    const allClasses = getAllClasses();
    return allClasses.find(c => c.value === value);
}

/**
 * Obtener clases por categoría
 */
export function getClassesByCategory(category) {
    return cssClasses[category]?.classes || [];
}

/**
 * Parsear string de clases a array
 */
export function parseClasses(classString) {
    if (!classString) return [];
    return classString.split(' ').filter(c => c.trim());
}

/**
 * Añadir clase a un string de clases
 */
export function addClass(classString, newClass) {
    const classes = parseClasses(classString);
    if (!classes.includes(newClass)) {
        classes.push(newClass);
    }
    return classes.join(' ');
}

/**
 * Remover clase de un string de clases
 */
export function removeClass(classString, classToRemove) {
    const classes = parseClasses(classString);
    return classes.filter(c => c !== classToRemove).join(' ');
}

/**
 * Toggle clase en un string de clases
 */
export function toggleClass(classString, classToToggle) {
    const classes = parseClasses(classString);
    if (classes.includes(classToToggle)) {
        return removeClass(classString, classToToggle);
    } else {
        return addClass(classString, classToToggle);
    }
}
