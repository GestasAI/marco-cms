import React from 'react';
import { formatStyles } from '../../../utils/styleUtils';
import { resolveDynamicValue } from './utils';

export function renderHeadingElement(element, index, doc) {
    const { id, class: className, tag, text, customStyles } = element;
    const Tag = tag || 'h2';
    const styles = formatStyles(customStyles);
    const dynamicValue = resolveDynamicValue(element, doc);
    const finalText = dynamicValue !== null ? dynamicValue : text;
    return <Tag key={id || index} id={id} className={className} style={styles}>{finalText || ''}</Tag>;
}

export function renderTextElement(element, index, doc) {
    const { id, class: className, tag, text, customStyles } = element;
    const Tag = tag || 'p';
    const styles = formatStyles(customStyles);
    const dynamicValue = resolveDynamicValue(element, doc);
    const finalText = dynamicValue !== null ? dynamicValue : text;
    return <Tag key={id || index} id={id} className={className} style={styles}>{finalText || ''}</Tag>;
}

export function renderButtonElement(element, index, doc) {
    const { id, class: className, text, link, target, customStyles } = element;
    const styles = formatStyles(customStyles);
    const dynamicValue = resolveDynamicValue(element, doc);
    const finalText = dynamicValue !== null ? dynamicValue : text;
    return (
        <a key={id || index} id={id} href={link || '#'} className={className} style={styles} target={target || '_self'}>
            {finalText || 'Botón'}
        </a>
    );
}

export function renderListElement(element, index, doc) {
    const { id, class: className, tag, items, customStyles } = element;
    const Tag = tag || 'ul';
    const styles = formatStyles(customStyles);
    const dynamicValue = resolveDynamicValue(element, doc);
    const finalItems = Array.isArray(dynamicValue) ? dynamicValue : (items || []);
    return (
        <Tag key={id || index} id={id} className={className} style={styles}>
            {finalItems.map((item, i) => <li key={i}>{item}</li>)}
        </Tag>
    );
}
