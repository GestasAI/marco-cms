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
    'list': Renderers.renderListElement,
    'html': Renderers.renderHtmlElement,
    'code': Renderers.renderCodeElement,
    'search': Renderers.renderSearchElement,
    'container': Renderers.renderContainerElement,
    'section': Renderers.renderSectionElement,
    'logo': Renderers.renderLogoElement,
    'columns': Renderers.renderColumnsElement,
    'column': Renderers.renderColumnElement,
    'card': Renderers.renderCardElement,
    'nav': Renderers.renderNavElement,
    'grid': Renderers.renderGridElement
};

/**
 * Función principal para renderizar un elemento recursivamente
 */
export function renderElement(element, index, doc) {
    if (!element) return null;

    const type = element.element;
    const Renderer = RENDERER_MAP[type];

    if (Renderer) {
        // Para contenedores, secciones y columnas, pasamos renderElement para recursividad
        if (['container', 'section', 'logo', 'columns', 'column', 'card', 'nav', 'grid'].includes(type)) {
            return Renderer(element, index, renderElement, doc);
        }
        return Renderer(element, index, doc);
    }

    // Elementos no reconocidos o genéricos
    return Renderers.renderGenericElement(element, index, renderElement, doc);
}

/**
 * Renderiza una sección completa de la página (header, content, footer)
 */
export function renderPageSection(section, index, doc) {
    if (!section) return null;

    const { section: sectionType, id, class: className, content, customStyles } = section;
    const contentElements = content && Array.isArray(content)
        ? content.map((el, i) => renderElement(el, i, doc))
        : null;

    // Props comunes (sin key)
    const props = {
        id: id,
        className: className,
        style: customStyles || {}
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
