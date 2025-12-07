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
        const updateInContent = (content) => {
            if (!content || !Array.isArray(content)) return content;
            return content.map(el => {
                if (el.id === elementId) {
                    const updated = { ...el, [field]: value };

                    // Si se actualiza la clase, asegurar que tiene clase única
                    if (field === 'class') {
                        const uniqueClass = `${el.element}-${el.id}`;
                        const classes = value.split(' ').filter(c => c.trim());

                        // Añadir clase única si no existe
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
     * Actualizar estilo personalizado de un elemento
     */
    const updateCustomStyle = (elementId, property, value) => {
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
        updateCustomStyle,
        selectElement,
        findElementInContent
    };
}
