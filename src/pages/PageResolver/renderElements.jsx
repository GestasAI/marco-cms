/**
 * Convierte estilos de snake-case/kebab-case a camelCase para React
 */
function formatStyles(styles) {
    if (!styles) return {};

    // Lista de propiedades que suelen dar problemas
    // const specialProps = ['z-index']; 

    const formatted = {};
    Object.keys(styles).forEach(key => {
        // Convertir kebab-case a camelCase (ej: background-color -> backgroundColor)
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        formatted[camelKey] = styles[key];
    });
    return formatted;
}

/**
 * Renderiza un elemento de imagen
 */
export function renderImageElement(element, index) {
    const { id, class: className, src, alt, width, height, customStyles } = element;

    const rawStyles = customStyles || {};
    const imgStyles = formatStyles({
        ...rawStyles,
        width: rawStyles.width || width || '',
        height: rawStyles.height || height || ''
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
    const { id, class: className, type, youtubeId, src, controls, autoplay, loop, customStyles } = element;
    const styles = formatStyles(customStyles);

    // YouTube video
    if (type === 'youtube' && youtubeId) {
        return (
            <div
                key={id || index}
                id={id}
                className={className}
                style={{ ...styles, position: 'relative', paddingBottom: '56.25%', height: 0 }}
            >
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
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
            style={styles}
            controls={controls !== false}
            autoPlay={autoplay || false}
            loop={loop || false}
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
