import React from 'react';
import { formatStyles } from '../../../utils/styleUtils';
import { resolveDynamicValue, resolveMediaUrl } from './utils';

export function renderImageElement({ element, index, doc }) {
    const { id, class: className, src, alt, width, height, customStyles } = element;
    const dynamicValue = resolveDynamicValue(element, doc);
    const finalSrc = resolveMediaUrl(dynamicValue || src || '/placeholder-image.jpg');
    const imgStyles = formatStyles({
        width: width || '100%',
        height: height || 'auto',
        display: 'block',
        ...customStyles
    });
    return <img id={id} src={finalSrc} alt={alt || 'Imagen'} className={className} style={imgStyles} />;
}

export function renderVideoElement({ element, index }) {
    const { id, class: className, type, youtubeId, src, controls, autoplay, loop, muted, poster, width, height, customStyles } = element;
    const videoStyles = formatStyles({
        width: width || '100%',
        height: height || 'auto',
        display: 'block',
        ...customStyles
    });

    const finalSrc = resolveMediaUrl(src);
    const finalPoster = resolveMediaUrl(poster);

    if (type === 'youtube' && youtubeId) {
        const hasCustomHeight = customStyles?.height || height;
        let containerStyles = { position: 'relative', ...videoStyles };
        if (!hasCustomHeight) {
            containerStyles = { ...containerStyles, paddingBottom: '56.25%', height: 0, overflow: 'hidden' };
        }
        if (finalPoster) {
            containerStyles = { ...containerStyles, backgroundImage: `url(${finalPoster})`, backgroundSize: 'cover', backgroundPosition: 'center' };
        }
        return (
            <div id={id} className={className} style={containerStyles}>
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}${autoplay ? '?autoplay=1' : ''}${muted ? '&mute=1' : ''}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    frameBorder="0" allowFullScreen
                ></iframe>
            </div>
        );
    }

    return (
        <video
            id={id} src={finalSrc || ''} className={className} style={videoStyles}
            controls={controls !== false} autoPlay={autoplay || false} loop={loop || false}
            muted={muted || false} poster={finalPoster || ''}
        >
            Tu navegador no soporta el elemento de video.
        </video>
    );
}
