import React from 'react';
import * as Renderers from './renderElements';

/**
 * Mapeo de tipos de elementos a funciones de renderizado
 */
const RENDERER_MAP = {
    'image': Renderers.renderImageElement,
    'video': Renderers.renderVideoElement,
    'heading': Renderers.renderHeadingElement,
    'text': Renderers.renderTextElement,
    'button': Renderers.renderButtonElement,
    'search': Renderers.renderSearchElement,
    'container': Renderers.renderContainerElement,
    'section': Renderers.renderSectionElement,
    'logo': Renderers.renderLogoElement
};

/**
 * Función principal para renderizar un elemento recursivamente
 */
export function renderElement(element, index) {
    if (!element) return null;

    const type = element.element;
    const Renderer = RENDERER_MAP[type];

    if (Renderer) {
        // Para contenedores y secciones, pasamos renderElement para recursividad
        if (type === 'container' || type === 'section' || type === 'logo') {
            return Renderer(element, index, renderElement);
        }
        return Renderer(element, index);
    }

    // Elementos no reconocidos o genéricos
    return Renderers.renderGenericElement(element, index, renderElement);
}

/**
 * Renderiza una sección completa de la página (header, content, footer)
 */
export function renderPageSection(section, index) {
    if (!section) return null;

    const { section: sectionType, id, class: className, content } = section;
    const contentElements = content && Array.isArray(content)
        ? content.map((el, i) => renderElement(el, i))
        : null;

    // Props comunes (sin key)
    const props = {
        id: id,
        className: className
    };

    const key = id || `section-${index}`;

    switch (sectionType) {
        case 'header':
            return <header key={key} {...props}>{contentElements}</header>;
        case 'content':
            return <main key={key} {...props}>{contentElements}</main>;
        case 'footer':
            return <footer key={key} {...props}>{contentElements}</footer>;
        default:
            return <section key={key} {...props}>{contentElements}</section>;
    }
}
