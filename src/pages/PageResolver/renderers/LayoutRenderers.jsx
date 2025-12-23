import React from 'react';
import { formatStyles } from '../../../utils/styleUtils';
import { getBackgroundStyles, renderBackgroundExtras } from './utils';

export function renderContainerElement(element, index, renderElement, doc) {
    const { id, class: className, content, customStyles } = element;
    const baseStyles = formatStyles(customStyles);
    const bgStyles = getBackgroundStyles(element);
    const styles = { ...baseStyles, ...bgStyles, position: 'relative' };

    return (
        <div key={id || index} id={id} className={className} style={styles}>
            {renderBackgroundExtras(element)}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
            </div>
        </div>
    );
}

export function renderSectionElement(element, index, renderElement, doc) {
    const { id, class: className, content, customStyles } = element;
    const baseStyles = formatStyles(customStyles);
    const bgStyles = getBackgroundStyles(element);
    const styles = { ...baseStyles, ...bgStyles, position: 'relative' };

    return (
        <section key={id || index} id={id} className={className} style={styles}>
            {renderBackgroundExtras(element)}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
            </div>
        </section>
    );
}

export function renderColumnsElement(element, index, renderElement, doc) {
    const { id, class: className, content, customStyles, settings } = element;
    const baseStyles = formatStyles(customStyles);
    const bgStyles = getBackgroundStyles(element);
    const styles = {
        ...baseStyles, ...bgStyles, display: 'flex',
        gap: settings?.gap || '20px', alignItems: settings?.align || 'stretch', position: 'relative'
    };

    return (
        <div key={id || index} id={id} className={className} style={styles}>
            {renderBackgroundExtras(element)}
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
        </div>
    );
}

export function renderColumnElement(element, index, renderElement, doc) {
    const { id, class: className, content, customStyles } = element;
    const baseStyles = formatStyles(customStyles);
    const bgStyles = getBackgroundStyles(element);
    const styles = { ...baseStyles, ...bgStyles, flex: 1, minWidth: 0, position: 'relative' };

    return (
        <div key={id || index} id={id} className={className} style={styles}>
            {renderBackgroundExtras(element)}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
            </div>
        </div>
    );
}

export function renderLogoElement(element, index, renderElement, doc) {
    const { id, class: className, content, customStyles } = element;
    const styles = formatStyles(customStyles);
    return (
        <div key={id || index} id={id} className={className} style={styles}>
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
        </div>
    );
}

export function renderCardElement(element, index, renderElement, doc) {
    return renderContainerElement(element, index, renderElement, doc);
}

export function renderNavElement(element, index, renderElement, doc) {
    return renderSectionElement(element, index, renderElement, doc);
}

export function renderGridElement(element, index, renderElement, doc) {
    const { id, class: className, content, customStyles, settings } = element;
    const baseStyles = formatStyles(customStyles);
    const bgStyles = getBackgroundStyles(element);
    const styles = {
        ...baseStyles, ...bgStyles,
        display: 'grid',
        gridTemplateColumns: `repeat(${settings?.columns || 3}, 1fr)`,
        gap: settings?.gap || '20px',
        position: 'relative'
    };

    return (
        <div key={id || index} id={id} className={className} style={styles}>
            {renderBackgroundExtras(element)}
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc))}
        </div>
    );
}

