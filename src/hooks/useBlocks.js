import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook para gestionar bloques de una página (FSE)
 * @param {Array} initialBlocks - Bloques iniciales
 * @returns {Object} Métodos para manipular bloques
 * 
 * @example
 * const { blocks, addBlock, updateBlock, deleteBlock, reorderBlocks } = useBlocks([]);
 */
export function useBlocks(initialBlocks = []) {
    const [blocks, setBlocks] = useState(initialBlocks);

    const addBlock = useCallback((blockType, position = -1) => {
        const newBlock = {
            id: uuidv4(),
            type: blockType,
            settings: {},
            content: '',
            createdAt: new Date().toISOString()
        };

        setBlocks(prev => {
            if (position === -1) {
                return [...prev, newBlock];
            }
            const updated = [...prev];
            updated.splice(position, 0, newBlock);
            return updated;
        });

        return newBlock.id;
    }, []);

    const updateBlock = useCallback((blockId, updates) => {
        setBlocks(prev => prev.map(block =>
            block.id === blockId
                ? { ...block, ...updates, updatedAt: new Date().toISOString() }
                : block
        ));
    }, []);

    const deleteBlock = useCallback((blockId) => {
        setBlocks(prev => prev.filter(block => block.id !== blockId));
    }, []);

    const duplicateBlock = useCallback((blockId) => {
        setBlocks(prev => {
            const index = prev.findIndex(b => b.id === blockId);
            if (index === -1) return prev;

            const blockToDuplicate = prev[index];
            const duplicated = {
                ...blockToDuplicate,
                id: uuidv4(),
                createdAt: new Date().toISOString()
            };

            const updated = [...prev];
            updated.splice(index + 1, 0, duplicated);
            return updated;
        });
    }, []);

    const reorderBlocks = useCallback((startIndex, endIndex) => {
        setBlocks(prev => {
            const result = Array.from(prev);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
        });
    }, []);

    const clearBlocks = useCallback(() => {
        setBlocks([]);
    }, []);

    return {
        blocks,
        addBlock,
        updateBlock,
        deleteBlock,
        duplicateBlock,
        reorderBlocks,
        clearBlocks,
        setBlocks
    };
}
