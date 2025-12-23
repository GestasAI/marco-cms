import { useState } from 'react';

/**
 * Hook para gestionar la selección y edición de elementos
 */
export function useElementEditor(contentSection, setContentSection) {
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    const findElementInContent = (content, targetId) => {
        if (!content || !Array.isArray(content)) return null;
        for (const el of content) {
            if (el.id === targetId) return el;
            if (el.content) {
                const found = findElementInContent(el.content, targetId);
                if (found) return found;
            }
        }
        return null;
    };

    const updateElement = (elementId, field, value) => {
        // 1. Si el elemento es la propia sección raíz
        if (contentSection.id === elementId) {
            const updated = { ...contentSection, [field]: value };
            setContentSection(updated);
            setSelectedElement(updated);
            setHasChanges(true);
            return;
        }

        // 2. Si es un elemento hijo
        const updateInContent = (content) => {
            if (!content || !Array.isArray(content)) return content;
            return content.map(el => {
                if (el.id === elementId) {
                    const updated = { ...el, [field]: value };
                    if (field === 'class') {
                        const uniqueClass = `${el.element}-${el.id}`;
                        const classes = value.split(' ').filter(c => c.trim());
                        if (!classes.includes(uniqueClass)) {
                            classes.push(uniqueClass);
                            updated.class = classes.join(' ');
                        }
                    }
                    return updated;
                }
                if (el.content) {
                    return { ...el, content: updateInContent(el.content) };
                }
                return el;
            });
        };

        const updatedContent = {
            ...contentSection,
            content: updateInContent(contentSection.content)
        };

        setContentSection(updatedContent);
        setHasChanges(true);
        const updated = findElementInContent(updatedContent.content, elementId);
        if (updated) setSelectedElement(updated);
    };

    /**
     * Actualizar múltiples campos de un elemento a la vez
     */
    const updateMultipleFields = (elementId, fields) => {
        // 1. Si el elemento es la propia sección raíz
        if (contentSection.id === elementId) {
            const updated = { ...contentSection, ...fields };
            setContentSection(updated);
            setSelectedElement(updated);
            setHasChanges(true);
            return;
        }

        // 2. Si es un elemento hijo
        const updateInContent = (content) => {
            if (!content || !Array.isArray(content)) return content;
            return content.map(el => {
                if (el.id === elementId) {
                    return { ...el, ...fields };
                }
                if (el.content) {
                    return { ...el, content: updateInContent(el.content) };
                }
                return el;
            });
        };

        const updatedContent = {
            ...contentSection,
            content: updateInContent(contentSection.content)
        };

        setContentSection(updatedContent);
        setHasChanges(true);
        const updated = findElementInContent(updatedContent.content, elementId);
        if (updated) setSelectedElement(updated);
    };

    /**
     * Actualizar estilo personalizado de un elemento
     */
    const updateCustomStyle = (elementId, property, value) => {

        // 1. Si el elemento es la propia sección raíz
        if (contentSection.id === elementId) {
            const customStyles = { ...(contentSection.customStyles || {}) };
            if (value === null || value === '' || value === undefined) {
                delete customStyles[property];
            } else {
                customStyles[property] = value;
            }
            const updated = { ...contentSection, customStyles };
            setContentSection(updated);
            setSelectedElement(updated);
            setHasChanges(true);
            return;
        }

        // 2. Si es un elemento hijo
        const updateInContent = (content) => {
            if (!content || !Array.isArray(content)) return content;
            return content.map(el => {
                if (el.id === elementId) {
                    const customStyles = { ...(el.customStyles || {}) };
                    if (value === null || value === '' || value === undefined) {
                        delete customStyles[property];
                    } else {
                        customStyles[property] = value;
                    }
                    return { ...el, customStyles };
                }
                if (el.content) {
                    return { ...el, content: updateInContent(el.content) };
                }
                return el;
            });
        };

        const updatedContent = {
            ...contentSection,
            content: updateInContent(contentSection.content)
        };

        setContentSection(updatedContent);
        setHasChanges(true);
        const updated = findElementInContent(updatedContent.content, elementId);
        if (updated) setSelectedElement(updated);
    };

    const selectElement = (element) => {
        setSelectedElementId(element?.id || null);
        setSelectedElement(element);
    };

    return {
        selectedElementId,
        selectedElement,
        hasChanges,
        setHasChanges,
        updateElement,
        updateMultipleFields,
        updateCustomStyle,
        selectElement,
        findElementInContent
    };
}
