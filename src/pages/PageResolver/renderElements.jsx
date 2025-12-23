import { formatStyles } from '../../utils/styleUtils';

/**
 * Renderiza un elemento de imagen
 */
export function renderImageElement(element, index) {
    const { id, class: className, src, alt, width, height, customStyles } = element;

    // Combinar customStyles con width/height base
    const baseStyles = {
        width: width || '100%',
        height: height || 'auto',
        display: 'block'
    };

    // customStyles tienen prioridad sobre baseStyles
    const imgStyles = formatStyles({
        ...baseStyles,
        ...customStyles
    });

    return (
        <img
            key={id || index}
            id={id}
            src={src || '/placeholder-image.jpg'}
            alt={alt || 'Imagen'}
            className={className}
            style={imgStyles}
        />
    );
}

/**
 * Renderiza un elemento de video (YouTube o upload)
 */
export function renderVideoElement(element, index) {
    const { id, class: className, type, youtubeId, src, controls, autoplay, loop, muted, poster, width, height, customStyles } = element;

    // Estilos base para videos
    const baseStyles = {
        width: width || '100%',
        height: height || 'auto',
        display: 'block'
    };

    // customStyles tienen prioridad
    const videoStyles = formatStyles({
        ...baseStyles,
        ...customStyles
    });

    // YouTube video
    if (type === 'youtube' && youtubeId) {
        // Si hay height personalizado, usar ese; si no, usar aspect ratio 16:9
        const hasCustomHeight = customStyles?.height || height;

        // Estilos base del contenedor
        let containerStyles = {
            position: 'relative',
            ...videoStyles
        };

        // Si NO hay height personalizado, usar aspect ratio 16:9
        if (!hasCustomHeight) {
            containerStyles = {
                ...containerStyles,
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden'
            };
        }

        // Añadir poster si existe
        if (poster) {
            containerStyles = {
                ...containerStyles,
                backgroundImage: `url(${poster})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        }

        return (
            <div
                key={id || index}
                id={id}
                className={className}
                style={containerStyles}
            >
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}${autoplay ? '?autoplay=1' : ''}${muted ? '&mute=1' : ''}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }

    // Uploaded video
    return (
        <video
            key={id || index}
            id={id}
            src={src || ''}
            className={className}
            style={videoStyles}
            controls={controls !== false}
            autoPlay={autoplay || false}
            loop={loop || false}
            muted={muted || false}
            poster={poster || ''}
        >
            Tu navegador no soporta el elemento de video.
        </video>
    );
}

/**
 * Renderiza un elemento de heading
 */
export function renderHeadingElement(element, index) {
    const { id, class: className, tag, text, customStyles } = element;
    const Tag = tag || 'h2';
    const styles = formatStyles(customStyles);

    return <Tag key={id || index} id={id} className={className} style={styles}>{text || ''}</Tag>;
}

/**
 * Renderiza un elemento de texto
 */
export function renderTextElement(element, index) {
    const { id, class: className, tag, text, customStyles } = element;
    const Tag = tag || 'p';
    const styles = formatStyles(customStyles);

    return <Tag key={id || index} id={id} className={className} style={styles}>{text || ''}</Tag>;
}

/**
 * Renderiza un elemento de botón
 */
export function renderButtonElement(element, index) {
    const { id, class: className, text, link, target, customStyles } = element;
    const styles = formatStyles(customStyles);

    return (
        <a key={id || index} id={id} href={link || '#'} className={className} style={styles} target={target || '_self'}>
            {text || 'Botón'}
        </a>
    );
}

/**
 * Renderiza un elemento de búsqueda
 */
export function renderSearchElement(element, index) {
    const { id, class: className, placeholder, customStyles } = element;
    const styles = formatStyles(customStyles);

    return (
        <div key={id || index} id={id} className={className} style={styles}>
            <input type="text" placeholder={placeholder || 'Buscar...'} className="w-full" />
        </div>
    );
}

/**
 * Renderiza un contenedor
 */
export function renderContainerElement(element, index, renderElement) {
    const { id, class: className, content, customStyles } = element;
    const styles = formatStyles(customStyles);

    return (
        <div key={id || index} id={id} className={className} style={styles}>
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i))}
        </div>
    );
}

/**
 * Renderiza una sección
 */
export function renderSectionElement(element, index, renderElement) {
    const { id, class: className, content, customStyles } = element;
    const styles = formatStyles(customStyles);

    return (
        <section key={id || index} id={id} className={className} style={styles}>
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i))}
        </section>
    );
}

/**
 * Renderiza un elemento de logo
 */
export function renderLogoElement(element, index, renderElement) {
    const { id, class: className, content, customStyles } = element;
    const styles = formatStyles(customStyles);

    return (
        <div key={id || index} id={id} className={className} style={styles}>
            {content && Array.isArray(content) && content.map((child, i) => renderElement(child, i))}
        </div>
    );
}

/**
 * Renderiza un elemento genérico
 */
export function renderGenericElement(element, index, renderElement) {
    const { id, class: className, text, content, customStyles } = element;
    const styles = formatStyles(customStyles);

    return (
        <div key={id || index} id={id} className={className} style={styles}>
            {text || (content && Array.isArray(content) && content.map((child, i) => renderElement(child, i)))}
        </div>
    );
}
