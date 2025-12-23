import React from 'react';
import { resolveDynamicValue } from '../../utils/dynamicUtils';

export const ListRenderer = ({ element, doc, styles, handleClick, handleDoubleClick }) => {
    const Tag = element.tag || 'ul';
    const isDynamic = element.dynamic?.enabled;
    const dynamicValue = isDynamic ? resolveDynamicValue(element, doc) : null;

    return (
        <Tag
            id={element.id}
            className={`${element.class} ${isDynamic ? 'is-dynamic' : ''}`}
            style={styles}
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

    return (
        <div
            id={element.id}
            className={`${element.class} ${isDynamic ? 'is-dynamic' : ''}`}
            style={styles}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            dangerouslySetInnerHTML={{ __html: isDynamic ? (dynamicValue || '') : (element.content || '<div>HTML</div>') }}
        />
    );
};

export const CodeRenderer = ({ element, doc, styles, handleClick, handleDoubleClick }) => {
    const isDynamic = element.dynamic?.enabled;
    const dynamicValue = isDynamic ? resolveDynamicValue(element, doc) : null;

    return (
        <div
            id={element.id}
            className={`${element.class} ${isDynamic ? 'is-dynamic' : ''}`}
            style={styles}
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

    return (
        <Tag
            id={element.id}
            className={`${element.class} ${isDynamic ? 'is-dynamic' : ''}`}
            style={{
                ...styles,
                outline: isEditing ? '2px solid #2196f3' : 'none',
                minWidth: '20px'
            }}
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
    return (
        <a
            id={element.id}
            href={element.link || '#'}
            className={element.class}
            style={{
                ...styles,
                outline: isEditing ? '2px solid #2196f3' : 'none',
                display: styles.display || 'inline-block'
            }}
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
    return (
        <div
            className={element.class}
            style={styles}
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
