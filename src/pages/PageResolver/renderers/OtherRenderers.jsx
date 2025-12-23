import React from 'react';
import { formatStyles } from '../../../utils/styleUtils';
import { resolveDynamicValue } from './utils';

export function renderHtmlElement(element, index, doc) {
    const { id, class: className, content, customStyles } = element;
    const styles = formatStyles(customStyles);
    const dynamicValue = resolveDynamicValue(element, doc);
    const finalContent = dynamicValue !== null ? dynamicValue : content;
    return <div key={id || index} id={id} className={className} style={styles} dangerouslySetInnerHTML={{ __html: finalContent || '' }} />;
}

export function renderCodeElement(element, index, doc) {
    const { id, class: className, code, language, customStyles } = element;
    const styles = formatStyles(customStyles);
    const dynamicValue = resolveDynamicValue(element, doc);
    const finalCode = dynamicValue !== null ? dynamicValue : code;
    return (
        <div key={id || index} id={id} className={className} style={styles}>
            <pre><code className={`language-${language || 'javascript'}`}>{finalCode || ''}</code></pre>
        </div>
    );
}

export function renderSearchElement(element, index) {
    const { id, class: className, placeholder, customStyles } = element;
    const styles = formatStyles(customStyles);
    return (
        <div key={id || index} id={id} className={className} style={styles}>
            <input type="text" placeholder={placeholder || 'Buscar...'} className="w-full" />
        </div>
    );
}

export function renderGenericElement(element, index, renderElement, doc) {
    const { id, class: className, text, content, customStyles } = element;
    const styles = formatStyles(customStyles);
    return (
        <div key={id || index} id={id} className={className} style={styles}>
            {text || (content && Array.isArray(content) && content.map((child, i) => renderElement(child, i, doc)))}
        </div>
    );
}
