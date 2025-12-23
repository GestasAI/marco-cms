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

        // Si no hay targetElementId o es la sección raíz, añadir al final de la raíz
        if (!targetElementId || targetElementId === contentSection.id) {
            const updatedContent = {
                ...contentSection,
                content: [...(contentSection.content || []), newBlock]
            };
            setContentSection(updatedContent);
            setHasChanges(true);
            console.log('✅ Bloque añadido a la raíz:', newBlock);
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

    const moveBlock = (blockId, targetElementId, position = 'after') => {
        if (!contentSection) return;

        let blockToMove = null;

        // 1. Extraer el bloque de su posición actual
        const extractBlock = (content) => {
            if (!content || !Array.isArray(content)) return content;
            return content.filter(el => {
                if (el.id === blockId) {
                    blockToMove = el;
                    return false;
                }
                return true;
            }).map(el => ({
                ...el,
                content: el.content ? extractBlock(el.content) : el.content
            }));
        };

        // 2. Insertar el bloque en la nueva posición
        const insertBlock = (content) => {
            if (!content || !Array.isArray(content)) return content;

            return content.reduce((acc, el) => {
                if (el.id === targetElementId) {
                    if (position === 'before') {
                        acc.push(blockToMove);
                        acc.push(el);
                    } else if (position === 'after') {
                        acc.push(el);
                        acc.push(blockToMove);
                    } else if (position === 'inside') {
                        acc.push({
                            ...el,
                            content: [...(el.content || []), blockToMove]
                        });
                    }
                } else {
                    if (el.content) {
                        acc.push({
                            ...el,
                            content: insertBlock(el.content)
                        });
                    } else {
                        acc.push(el);
                    }
                }
                return acc;
            }, []);
        };

        // Ejecutar extracción
        const contentAfterExtraction = extractBlock(contentSection.content);

        if (!blockToMove) {
            console.warn('⚠️ No se encontró el bloque a mover:', blockId);
            return;
        }

        // Caso especial: Mover a la raíz (si el target es el ID de la sección)
        let finalContent;
        if (targetElementId === contentSection.id) {
            finalContent = [...contentAfterExtraction, blockToMove];
        } else {
            finalContent = insertBlock(contentAfterExtraction);
        }

        const updatedContent = {
            ...contentSection,
            content: finalContent
        };

        setContentSection(updatedContent);
        setHasChanges(true);
        console.log(`🔄 Bloque ${blockId} movido ${position} de ${targetElementId}`);
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
