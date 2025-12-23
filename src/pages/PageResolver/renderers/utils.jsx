import React from 'react';
import { formatStyles } from '../../../utils/styleUtils';

/**
 * Resuelve el valor dinámico basado en el origen configurado
 */
export function resolveDynamicValue(element, doc) {
    if (!element.dynamic?.enabled || !doc) return null;

    const { source, field } = element.dynamic;

    switch (source) {
        case 'post_title':
            return doc.title || '';
        case 'post_excerpt':
            return doc.excerpt || doc.description || '';
        case 'post_content':
            return doc.content || '';
        case 'post_date':
            return doc.date ? new Date(doc.date).toLocaleDateString() : '';
        case 'post_author':
            return doc.author || '';
        case 'featured_image':
            return doc.featured_image || doc.image || '';
        case 'custom_field':
            return field ? (doc[field] || doc.meta?.[field] || '') : '';
        default:
            return null;
    }
}

/**
 * Genera estilos de fondo basados en element.settings
 */
export function getBackgroundStyles(element) {
    if (!element.settings?.background) return {};
    const { background } = element.settings;
    const bgStyles = {};

    switch (background.type) {
        case 'color':
            bgStyles.backgroundColor = background.color;
            break;
        case 'gradient':
            bgStyles.backgroundImage = background.gradient;
            break;
        case 'image':
            bgStyles.backgroundImage = `url(${background.image})`;
            bgStyles.backgroundSize = 'cover';
            bgStyles.backgroundPosition = 'center';
            break;
        default:
            break;
    }
    return bgStyles;
}

/**
 * Renderiza extras de fondo (video y overlay)
 */
export function renderBackgroundExtras(element) {
    const extras = [];
    const settings = element.settings?.background;

    if (!settings) return null;

    if (settings.type === 'video' && settings.video) {
        extras.push(
            <video
                key="bg-video"
                autoPlay muted loop playsInline
                style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    objectFit: 'cover', zIndex: -1
                }}
            >
                <source src={settings.video} type="video/mp4" />
            </video>
        );
    }

    if (settings.overlay?.enabled) {
        extras.push(
            <div
                key="bg-overlay"
                style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: settings.overlay.color,
                    opacity: settings.overlay.opacity,
                    pointerEvents: 'none', zIndex: 0
                }}
            />
        );
    }

    return extras.length > 0 ? extras : null;
}
