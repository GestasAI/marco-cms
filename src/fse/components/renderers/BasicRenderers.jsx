import React from 'react';
import { resolveDynamicValue } from '../../utils/dynamicUtils';

/**
 * Helper para aplicar settings comunes (spacing, border) a elementos básicos
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

export const ListRenderer = ({ element, doc, styles, handleClick, handleDoubleClick }) => {
    const Tag = element.tag || 'ul';
    const isDynamic = element.dynamic?.enabled;
    const dynamicValue = isDynamic ? resolveDynamicValue(element, doc) : null;
    const finalStyles = applyCommonSettings(element, styles);

    return (
        <Tag
            id={element.id}
            className={`${element.class} ${isDynamic ? 'is-dynamic' : ''}`}
            style={finalStyles}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            {isDynamic ? (
                Array.isArray(dynamicValue) ? (
                    dynamicValue.map((item, idx) => <li key={idx}>{item}</li>)
                ) : (
                    <li className="dynamic-placeholder">
                        {dynamicValue || `[Lista: ${element.dynamic.source}]`}
                    </li>
                )
            ) : (
                (element.items || []).map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))
            )}
        </Tag>
    );
};

export const HtmlRenderer = ({ element, doc, styles, handleClick, handleDoubleClick }) => {
    const isDynamic = element.dynamic?.enabled;
    const dynamicValue = isDynamic ? resolveDynamicValue(element, doc) : null;
    const finalStyles = applyCommonSettings(element, styles);

    return (
        <div
            id={element.id}
            className={`${element.class} ${isDynamic ? 'is-dynamic' : ''}`}
            style={finalStyles}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            dangerouslySetInnerHTML={{ __html: isDynamic ? (dynamicValue || '') : (element.content || '<div>HTML</div>') }}
        />
    );
};

export const CodeRenderer = ({ element, doc, styles, handleClick, handleDoubleClick }) => {
    const isDynamic = element.dynamic?.enabled;
    const dynamicValue = isDynamic ? resolveDynamicValue(element, doc) : null;
    const finalStyles = applyCommonSettings(element, styles);

    return (
        <div
            id={element.id}
            className={`${element.class} ${isDynamic ? 'is-dynamic' : ''}`}
            style={finalStyles}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <pre>
                <code>
                    {isDynamic
                        ? (dynamicValue || `// Sin datos: ${element.dynamic.source}`)
                        : (element.code || '// Escribe tu código aquí')}
                </code>
            </pre>
        </div>
    );
};

export const TextRenderer = ({ element, doc, styles, isEditing, handleTextBlur, handleClick, handleDoubleClick, type = 'text' }) => {
    const Tag = element.tag || (type === 'heading' ? 'h2' : 'p');
    const isDynamic = element.dynamic?.enabled;
    const dynamicValue = isDynamic ? resolveDynamicValue(element, doc) : null;
    const finalStyles = applyCommonSettings(element, {
        ...styles,
        outline: isEditing ? '2px solid #2196f3' : 'none',
        minWidth: '20px'
    });

    return (
        <Tag
            id={element.id}
            className={`${element.class} ${isDynamic ? 'is-dynamic' : ''}`}
            style={finalStyles}
            contentEditable={isEditing && !isDynamic}
            suppressContentEditableWarning={true}
            onBlur={handleTextBlur}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            {isDynamic
                ? (dynamicValue || `[${element.dynamic.source}]`)
                : (element.text || (type === 'heading' ? 'Título' : 'Texto'))}
        </Tag>
    );
};

export const ButtonRenderer = ({ element, styles, isEditing, handleTextBlur, handleClick, handleDoubleClick }) => {
    const finalStyles = applyCommonSettings(element, {
        ...styles,
        outline: isEditing ? '2px solid #2196f3' : 'none',
        display: styles.display || 'inline-block'
    });

    return (
        <a
            id={element.id}
            href={element.link || '#'}
            className={element.class}
            style={finalStyles}
            target={element.target || '_self'}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={handleTextBlur}
            onClick={(e) => {
                e.preventDefault();
                handleClick(e);
            }}
            onDoubleClick={handleDoubleClick}
        >
            {element.text || (element.element === 'link' ? 'Enlace' : 'Botón')}
        </a>
    );
};

export const SearchRenderer = ({ element, styles, handleClick, handleDoubleClick }) => {
    const finalStyles = applyCommonSettings(element, styles);

    return (
        <div
            className={element.class}
            style={finalStyles}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <input
                type="text"
                placeholder={element.placeholder || 'Buscar...'}
                className="w-full"
                readOnly
            />
        </div>
    );
};
