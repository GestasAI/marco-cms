/**
 * Sistema de Estilos Inteligente
 * Maneja clases globales del tema + estilos únicos por elemento
 */

/**
 * Generar clase única para un elemento
 */
export function generateUniqueClass(elementId, elementType) {
    // Formato: element-type-id
    // Ejemplo: heading-hero-title-0012
    return `${elementType}-${elementId}`;
}

/**
 * Determinar si una clase es del tema o personalizada
 */
export function isThemeClass(className) {
    const themeClasses = [
        // Headings
        'heading-1', 'heading-2', 'heading-3', 'heading-4', 'heading-5', 'heading-6',
        // Text
        'text-lead', 'text-body', 'text-sm', 'text-xs',
        // Colors
        'text-primary', 'text-secondary', 'text-white', 'text-black',
        'bg-primary', 'bg-secondary', 'bg-white', 'bg-gradient',
        // Layout
        'container', 'flex', 'flex-center', 'flex-between', 'grid', 'grid-2', 'grid-3',
        // Spacing
        'p-xs', 'p-sm', 'p-md', 'p-lg', 'p-xl', 'p-2xl',
        'm-xs', 'm-sm', 'm-md', 'm-lg', 'm-xl', 'm-2xl',
        // Buttons
        'btn', 'btn-primary', 'btn-secondary', 'btn-outline',
        // Sections
        'hero', 'hero-content', 'section', 'section-dark',
        // Utilities
        'w-full', 'rounded', 'shadow', 'shadow-lg', 'text-center', 'text-left', 'text-right'
    ];

    return themeClasses.includes(className);
}

/**
 * Separar clases del tema de clases personalizadas
 */
export function separateClasses(classString) {
    if (!classString) return { themeClasses: [], customClasses: [] };

    const classes = classString.split(' ').filter(c => c.trim());
    const themeClasses = [];
    const customClasses = [];

    classes.forEach(cls => {
        if (isThemeClass(cls)) {
            themeClasses.push(cls);
        } else {
            customClasses.push(cls);
        }
    });

    return { themeClasses, customClasses };
}

/**
 * Estructura de estilos personalizados por elemento
 */
export class ElementStyles {
    constructor(elementId, elementType) {
        this.elementId = elementId;
        this.elementType = elementType;
        this.uniqueClass = generateUniqueClass(elementId, elementType);
        this.themeClasses = []; // Clases del tema (globales)
        this.customStyles = {}; // Estilos inline personalizados
    }

    /**
     * Añadir clase del tema
     */
    addThemeClass(className) {
        if (isThemeClass(className) && !this.themeClasses.includes(className)) {
            this.themeClasses.push(className);
        }
    }

    /**
     * Remover clase del tema
     */
    removeThemeClass(className) {
        this.themeClasses = this.themeClasses.filter(c => c !== className);
    }

    /**
     * Establecer estilo personalizado
     */
    setCustomStyle(property, value) {
        this.customStyles[property] = value;
    }

    /**
     * Remover estilo personalizado
     */
    removeCustomStyle(property) {
        delete this.customStyles[property];
    }

    /**
     * Obtener string de clases completo
     */
    getClassString() {
        return [...this.themeClasses, this.uniqueClass].join(' ');
    }

    /**
     * Obtener objeto de estilos inline
     */
    getInlineStyles() {
        return this.customStyles;
    }

    /**
     * Exportar a JSON
     */
    toJSON() {
        return {
            elementId: this.elementId,
            elementType: this.elementType,
            uniqueClass: this.uniqueClass,
            themeClasses: this.themeClasses,
            customStyles: this.customStyles
        };
    }

    /**
     * Importar desde JSON
     */
    static fromJSON(data) {
        const instance = new ElementStyles(data.elementId, data.elementType);
        instance.themeClasses = data.themeClasses || [];
        instance.customStyles = data.customStyles || {};
        return instance;
    }
}

/**
 * Gestor de estilos de la página
 */
export class PageStylesManager {
    constructor() {
        this.elementStyles = new Map(); // elementId -> ElementStyles
    }

    /**
     * Obtener o crear estilos para un elemento
     */
    getOrCreate(elementId, elementType) {
        if (!this.elementStyles.has(elementId)) {
            this.elementStyles.set(elementId, new ElementStyles(elementId, elementType));
        }
        return this.elementStyles.get(elementId);
    }

    /**
     * Aplicar clase del tema a un elemento
     */
    applyThemeClass(elementId, elementType, className) {
        const styles = this.getOrCreate(elementId, elementType);
        styles.addThemeClass(className);
        return styles.getClassString();
    }

    /**
     * Remover clase del tema de un elemento
     */
    removeThemeClass(elementId, className) {
        const styles = this.elementStyles.get(elementId);
        if (styles) {
            styles.removeThemeClass(className);
            return styles.getClassString();
        }
        return '';
    }

    /**
     * Aplicar estilo personalizado a un elemento
     */
    applyCustomStyle(elementId, elementType, property, value) {
        const styles = this.getOrCreate(elementId, elementType);
        styles.setCustomStyle(property, value);
        return styles.getInlineStyles();
    }

    /**
     * Generar CSS personalizado para todos los elementos
     */
    generateCustomCSS() {
        let css = '/* Estilos personalizados por elemento */\n\n';

        this.elementStyles.forEach((styles) => {
            const customStyles = styles.getInlineStyles();
            if (Object.keys(customStyles).length > 0) {
                css += `.${styles.uniqueClass} {\n`;
                Object.entries(customStyles).forEach(([prop, value]) => {
                    css += `    ${prop}: ${value};\n`;
                });
                css += '}\n\n';
            }
        });

        return css;
    }

    /**
     * Exportar a JSON
     */
    toJSON() {
        const data = {};
        this.elementStyles.forEach((styles, elementId) => {
            data[elementId] = styles.toJSON();
        });
        return data;
    }

    /**
     * Importar desde JSON
     */
    static fromJSON(data) {
        const manager = new PageStylesManager();
        Object.entries(data).forEach(([elementId, styleData]) => {
            manager.elementStyles.set(elementId, ElementStyles.fromJSON(styleData));
        });
        return manager;
    }
}

/**
 * Hook para React
 */
export function usePageStyles() {
    const [stylesManager] = React.useState(() => new PageStylesManager());

    return {
        applyThemeClass: (elementId, elementType, className) =>
            stylesManager.applyThemeClass(elementId, elementType, className),
        removeThemeClass: (elementId, className) =>
            stylesManager.removeThemeClass(elementId, className),
        applyCustomStyle: (elementId, elementType, property, value) =>
            stylesManager.applyCustomStyle(elementId, elementType, property, value),
        generateCSS: () => stylesManager.generateCustomCSS(),
        exportStyles: () => stylesManager.toJSON(),
        importStyles: (data) => PageStylesManager.fromJSON(data)
    };
}
