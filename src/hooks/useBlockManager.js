import { useState } from 'react';
import { assignIds } from '../fse/blocks';

/**
 * Hook para gestionar la adición de bloques al canvas
 */
export function useBlockManager(contentSection, setContentSection, setHasChanges) {
    /**
     * Añadir bloque en posición específica
     * @param {object} block - Template del bloque
     * @param {string} targetElementId - ID del elemento de referencia
     * @param {string} position - 'before', 'after', 'inside'
     */
    const addBlock = (block, targetElementId = null, position = 'after') => {
        if (!contentSection) return;

        // Asignar IDs únicos
        const newBlock = assignIds(block.template);

        // Si no hay targetElementId, añadir al final
        if (!targetElementId) {
            const updatedContent = {
                ...contentSection,
                content: [...(contentSection.content || []), newBlock]
            };
            setContentSection(updatedContent);
            setHasChanges(true);
            console.log('✅ Bloque añadido al final:', newBlock);
            return;
        }

        // Añadir en posición específica
        const addInPosition = (content, parentContent = null, parentIndex = -1) => {
            if (!content || !Array.isArray(content)) return content;

            return content.reduce((acc, el, index) => {
                // Si encontramos el elemento objetivo
                if (el.id === targetElementId) {
                    if (position === 'before') {
                        // Añadir ANTES
                        acc.push(newBlock);
                        acc.push(el);
                    } else if (position === 'after') {
                        // Añadir DESPUÉS
                        acc.push(el);
                        acc.push(newBlock);
                    } else if (position === 'inside') {
                        // Añadir DENTRO
                        acc.push({
                            ...el,
                            content: [...(el.content || []), newBlock]
                        });
                    }
                } else {
                    // Buscar recursivamente en hijos
                    if (el.content) {
                        acc.push({
                            ...el,
                            content: addInPosition(el.content, content, index)
                        });
                    } else {
                        acc.push(el);
                    }
                }
                return acc;
            }, []);
        };

        const updatedContent = {
            ...contentSection,
            content: addInPosition(contentSection.content)
        };

        setContentSection(updatedContent);
        setHasChanges(true);
        console.log(`✅ Bloque añadido ${position} de ${targetElementId}:`, newBlock);
    };

    const removeBlock = (blockId) => {
        if (!contentSection) return;

        const removeFromContent = (content) => {
            if (!content || !Array.isArray(content)) return content;

            return content
                .filter(el => el.id !== blockId)
                .map(el => ({
                    ...el,
                    content: el.content ? removeFromContent(el.content) : el.content
                }));
        };

        const updatedContent = {
            ...contentSection,
            content: removeFromContent(contentSection.content)
        };

        setContentSection(updatedContent);
        setHasChanges(true);
        console.log('🗑️ Bloque eliminado:', blockId);
    };

    const moveBlock = (blockId, sourceContainerId, targetContainerId, destinationIndex) => {
        if (!contentSection) return;

        let blockToMove = null;

        const extractBlock = (content) => {
            if (!content || !Array.isArray(content)) return content;

            return content
                .filter(el => {
                    if (el.id === blockId) {
                        blockToMove = el;
                        return false;
                    }
                    return true;
                })
                .map(el => ({
                    ...el,
                    content: el.content ? extractBlock(el.content) : el.content
                }));
        };

        const insertBlock = (content) => {
            if (!content || !Array.isArray(content)) return content;

            return content.map(el => {
                if (el.id === targetContainerId) {
                    const newContent = [...(el.content || [])];
                    newContent.splice(destinationIndex, 0, blockToMove);
                    return {
                        ...el,
                        content: newContent
                    };
                }
                if (el.content) {
                    return {
                        ...el,
                        content: insertBlock(el.content)
                    };
                }
                return el;
            });
        };

        let updatedContent = {
            ...contentSection,
            content: extractBlock(contentSection.content)
        };

        if (blockToMove) {
            updatedContent = {
                ...updatedContent,
                content: insertBlock(updatedContent.content)
            };
        }

        setContentSection(updatedContent);
        setHasChanges(true);
        console.log('🔄 Bloque movido:', blockId, 'a', targetContainerId);
    };

    const moveUp = (blockId) => {
        if (!contentSection) return;

        const moveInContent = (content) => {
            if (!content || !Array.isArray(content)) return content;

            const index = content.findIndex(el => el.id === blockId);
            if (index > 0) {
                const newContent = [...content];
                [newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]];
                return newContent;
            }

            return content.map(el => ({
                ...el,
                content: el.content ? moveInContent(el.content) : el.content
            }));
        };

        const updatedContent = {
            ...contentSection,
            content: moveInContent(contentSection.content)
        };

        setContentSection(updatedContent);
        setHasChanges(true);
        console.log('⬆️ Bloque movido arriba:', blockId);
    };

    const moveDown = (blockId) => {
        if (!contentSection) return;

        const moveInContent = (content) => {
            if (!content || !Array.isArray(content)) return content;

            const index = content.findIndex(el => el.id === blockId);
            if (index >= 0 && index < content.length - 1) {
                const newContent = [...content];
                [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
                return newContent;
            }

            return content.map(el => ({
                ...el,
                content: el.content ? moveInContent(el.content) : el.content
            }));
        };

        const updatedContent = {
            ...contentSection,
            content: moveInContent(contentSection.content)
        };

        setContentSection(updatedContent);
        setHasChanges(true);
        console.log('⬇️ Bloque movido abajo:', blockId);
    };

    const duplicateBlock = (blockId) => {
        if (!contentSection) return;

        let blockToDuplicate = null;

        const findAndDuplicate = (content) => {
            if (!content || !Array.isArray(content)) return content;

            return content.reduce((acc, el) => {
                acc.push(el);
                if (el.id === blockId) {
                    blockToDuplicate = JSON.parse(JSON.stringify(el));
                    blockToDuplicate = assignIds(blockToDuplicate);
                    acc.push(blockToDuplicate);
                } else if (el.content) {
                    acc[acc.length - 1] = {
                        ...el,
                        content: findAndDuplicate(el.content)
                    };
                }
                return acc;
            }, []);
        };

        const updatedContent = {
            ...contentSection,
            content: findAndDuplicate(contentSection.content)
        };

        setContentSection(updatedContent);
        setHasChanges(true);
        console.log('📋 Bloque duplicado:', blockId, '→', blockToDuplicate?.id);
    };

    return {
        addBlock,
        removeBlock,
        moveBlock,
        moveUp,
        moveDown,
        duplicateBlock
    };
}
