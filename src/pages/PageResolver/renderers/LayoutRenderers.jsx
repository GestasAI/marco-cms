import React from 'react';
import { formatStyles } from '../../../utils/styleUtils';
import { getBackgroundStyles, renderBackgroundExtras } from './utils';
import { renderEffectElement } from './EffectRenderers';

/**
 * Helper para renderizar la animación de fondo (Three.js)
 */
const renderBgAnimation = (element) => {
    const settings = element.settings;
    if (settings?.background?.type === 'animation' && settings.background.animation) {
        const anim = settings.background.animation;
        const effectElement = {
            id: `bg-anim-${element.id}`,
            settings: {
                particles: {
                    count: anim.count !== undefined ? anim.count : 2000,
                    size: anim.size || 0.06,
                    color: anim.color || '#4285F4',
                    shape: anim.shape || 'points'
                },
                animation: {
                    mode: anim.mode || 'follow',
                    intensity: anim.intensity || 1.5,
                    timeScale: anim.timeScale || 1.2
                },
                layout: {
                    height: '100%',
                    background: anim.backgroundColor || 'transparent'
                }
            }
        };
        return (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
                {renderEffectElement({ element: effectElement, index: `bg-${element.id}` })}
            </div>
        );
    }
    return null;
};

export function renderContainerElement({ element, index, renderElement, doc }) {
    const { id, class: className, content, customStyles, settings } = element;
    const baseStyles = formatStyles(customStyles);
    const bgStyles = getBackgroundStyles(element);

    const isAnimation = settings?.background?.type === 'animation';
    const styles = {
        ...baseStyles,
        ...bgStyles,
        position: 'relative',
        isolation: 'isolate',
        ...(isAnimation ? { backgroundColor: 'transparent', backgroundImage: 'none' } : {})
    };

    return (
        <div id={id} className={className} style={styles}>
            {renderBackgroundExtras(element)}
            {renderBgAnimation(element)}
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
        </div>
    );
}

export function renderSectionElement(props) {
    const { element, index, renderElement, doc } = props;
    const { id, class: className, content, customStyles, settings } = element;
    const baseStyles = formatStyles(customStyles);
    const bgStyles = getBackgroundStyles(element);

    const isAnimation = settings?.background?.type === 'animation';
    const styles = {
        ...baseStyles,
        ...bgStyles,
        position: 'relative',
        isolation: 'isolate',
        ...(isAnimation ? { backgroundColor: 'transparent', backgroundImage: 'none' } : {})
    };

    return (
        <section id={id} className={className} style={styles}>
            {renderBackgroundExtras(element)}
            {renderBgAnimation(element)}
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
        </section>
    );
}

export function renderColumnsElement({ element, index, renderElement, doc }) {
    const { id, class: className, content, customStyles, settings } = element;
    const baseStyles = formatStyles(customStyles);
    const bgStyles = getBackgroundStyles(element);

    const isAnimation = settings?.background?.type === 'animation';
    const styles = {
        ...baseStyles,
        ...bgStyles,
        display: 'flex',
        flexWrap: 'wrap',
        gap: settings?.gap || '20px',
        alignItems: settings?.align || 'stretch',
        position: 'relative',
        isolation: 'isolate',
        ...(isAnimation ? { backgroundColor: 'transparent', backgroundImage: 'none' } : {})
    };

    return (
        <div id={id} className={className} style={styles}>
            {renderBackgroundExtras(element)}
            {renderBgAnimation(element)}
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
        </div>
    );
}

export function renderColumnElement({ element, index, renderElement, doc }) {
    const { id, class: className, content, customStyles, settings } = element;
    const baseStyles = formatStyles(customStyles);
    const bgStyles = getBackgroundStyles(element);

    const isAnimation = settings?.background?.type === 'animation';
    const styles = {
        ...baseStyles,
        ...bgStyles,
        flex: 1,
        minWidth: 0,
        position: 'relative',
        isolation: 'isolate',
        ...(isAnimation ? { backgroundColor: 'transparent', backgroundImage: 'none' } : {})
    };

    return (
        <div id={id} className={className} style={styles}>
            {renderBackgroundExtras(element)}
            {renderBgAnimation(element)}
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
        </div>
    );
}

export function renderLogoElement({ element, index, renderElement, doc }) {
    const { id, class: className, content, customStyles } = element;
    const styles = formatStyles(customStyles);
    return (
        <div id={id} className={className} style={styles}>
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
        </div>
    );
}

export function renderCardElement(props) {
    return renderContainerElement(props);
}

export function renderNavElement({ element, index, renderElement, doc }) {
    const { id, class: className, content, customStyles, settings } = element;
    const baseStyles = formatStyles(customStyles);
    const bgStyles = getBackgroundStyles(element);

    const isAnimation = settings?.background?.type === 'animation';
    const styles = {
        ...baseStyles,
        ...bgStyles,
        position: 'relative',
        isolation: 'isolate',
        ...(isAnimation ? { backgroundColor: 'transparent', backgroundImage: 'none' } : {})
    };

    return (
        <nav id={id} className={className} style={styles}>
            {renderBackgroundExtras(element)}
            {renderBgAnimation(element)}
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
        </nav>
    );
}

export function renderGridElement({ element, index, renderElement, doc }) {
    const { id, class: className, content, customStyles, settings } = element;
    const baseStyles = formatStyles(customStyles);
    const bgStyles = getBackgroundStyles(element);

    const isAnimation = settings?.background?.type === 'animation';
    const styles = {
        ...baseStyles,
        ...bgStyles,
        display: 'grid',
        gridTemplateColumns: `repeat(${settings?.columns || 3}, 1fr)`,
        gap: settings?.gap || '20px',
        position: 'relative',
        isolation: 'isolate',
        ...(isAnimation ? { backgroundColor: 'transparent', backgroundImage: 'none' } : {})
    };

    return (
        <div id={id} className={className} style={styles}>
            {renderBackgroundExtras(element)}
            {renderBgAnimation(element)}
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
        </div>
    );
}
