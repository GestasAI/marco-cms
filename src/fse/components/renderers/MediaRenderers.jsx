import React from 'react';
import { resolveDynamicValue } from '../../utils/dynamicUtils';
import { formatStyles } from '../../../utils/styleUtils';

/**
 * Helper para aplicar settings comunes (spacing, border) a elementos de medios
 */
const applyCommonSettings = (element, baseStyles) => {
    const settings = element.settings || {};
    const styles = { ...baseStyles };

    if (settings.spacing) {
        if (settings.spacing.padding) styles.padding = settings.spacing.padding;
        if (settings.spacing.margin) styles.margin = settings.spacing.margin;
    }

    if (settings.border) {
        if (settings.border.radius) styles.borderRadius = settings.border.radius;
        if (settings.border.width) styles.borderWidth = settings.border.width;
        if (settings.border.color) styles.borderColor = settings.border.color;
        if (settings.border.style) styles.borderStyle = settings.border.style;
    }

    return styles;
};

export const ImageRenderer = ({ element, doc, customStyles, handleClick, handleDoubleClick }) => {
    const isDynamic = element.dynamic?.enabled;
    const dynamicValue = isDynamic ? resolveDynamicValue(element, doc) : null;

    const baseImageStyles = formatStyles({
        ...customStyles,
        width: element.width || customStyles.width || '100%',
        height: element.height || customStyles.height || 'auto',
        display: customStyles.display || 'block',
        margin: customStyles.margin || (customStyles.textAlign === 'center' ? '0 auto' : '0')
    });

    const finalStyles = applyCommonSettings(element, baseImageStyles);

    return (
        <div
            className={`image-wrapper ${isDynamic ? 'is-dynamic' : ''}`}
            style={{ position: 'relative', ...finalStyles }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <img
                id={element.id}
                src={isDynamic ? (dynamicValue || element.src || '/placeholder-image.jpg') : (element.src || '/placeholder-image.jpg')}
                alt={element.alt || 'Imagen'}
                className={element.class}
                style={{
                    width: '100%',
                    height: (finalStyles.height && finalStyles.height !== 'auto') ? '100%' : 'auto',
                    objectFit: (finalStyles.height && finalStyles.height !== 'auto') ? 'cover' : 'initial',
                    display: 'block'
                }}
            />
            {isDynamic && (
                <div className="dynamic-badge">
                    <span>{element.dynamic.source || 'Imagen Dinámica'}</span>
                </div>
            )}
        </div>
    );
};

export const VideoRenderer = ({ element, customStyles, handleClick, handleDoubleClick }) => {
    const baseVideoStyles = formatStyles({
        ...customStyles,
        width: element.width || customStyles.width || '100%',
        height: element.height || customStyles.height || 'auto',
        display: customStyles.display || 'block',
        margin: customStyles.margin || '0'
    });

    const finalStyles = applyCommonSettings(element, baseVideoStyles);

    if (element.type === 'youtube' && element.youtubeId) {
        const hasCustomHeight = customStyles.height || element.height;
        let containerStyles = { position: 'relative', ...finalStyles };

        if (!hasCustomHeight) {
            containerStyles = {
                ...containerStyles,
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden'
            };
        }

        if (element.poster) {
            containerStyles = {
                ...containerStyles,
                backgroundImage: `url(${element.poster})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        }

        return (
            <div
                className={element.class}
                style={containerStyles}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
            >
                <iframe
                    src={`https://www.youtube.com/embed/${element.youtubeId}${element.autoplay ? '?autoplay=1' : ''}${element.muted ? '&mute=1' : ''}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }

    return (
        <video
            src={element.src || ''}
            className={element.class}
            style={finalStyles}
            controls={element.controls !== false}
            autoPlay={element.autoplay || false}
            loop={element.loop || false}
            muted={element.muted || false}
            poster={element.poster || ''}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            Tu navegador no soporta el elemento de video.
        </video>
    );
};
