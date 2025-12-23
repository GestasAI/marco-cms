import { useEffect } from 'react';
import { basicBlocks, designBlocks } from '../fse/blocks';

/**
 * Hook para gestionar la lógica de arrastrar y soltar en el editor
 */
export function useEditorDragAndDrop(canvasRef, contentSection, addBlock, moveBlock) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleDragOver = (e) => {
            e.preventDefault();
            const isFromLibrary = e.dataTransfer.types.includes('block-id');
            e.dataTransfer.dropEffect = isFromLibrary ? 'copy' : 'move';

            const dropZone = e.target.closest('.drop-zone, .empty-container');
            if (!dropZone) return;

            canvas.querySelectorAll('.drop-zone-active, .drop-before, .drop-after').forEach(el => {
                el.classList.remove('drop-zone-active', 'drop-before', 'drop-after');
            });

            const rect = dropZone.getBoundingClientRect();
            const relativeY = e.clientY - rect.top;
            const threshold = rect.height * 0.2;

            if (relativeY < threshold) {
                dropZone.classList.add('drop-before');
                dropZone.dataset.dropPos = 'before';
            } else if (relativeY > rect.height - threshold) {
                dropZone.classList.add('drop-after');
                dropZone.dataset.dropPos = 'after';
            } else {
                dropZone.classList.add('drop-zone-active');
                dropZone.dataset.dropPos = 'inside';
            }
        };

        const handleDragLeave = (e) => {
            const dropZone = e.target.closest('.drop-zone, .empty-container');
            if (dropZone) {
                dropZone.classList.remove('drop-zone-active', 'drop-before', 'drop-after');
            }
        };

        const handleDrop = (e) => {
            e.preventDefault();
            const dropZone = e.target.closest('.drop-zone, .empty-container');
            const position = dropZone?.dataset.dropPos || 'inside';

            canvas.querySelectorAll('.drop-zone-active, .drop-before, .drop-after').forEach(el => {
                el.classList.remove('drop-zone-active', 'drop-before', 'drop-after');
            });

            const blockId = e.dataTransfer.getData('block-id');
            const draggedElementId = e.dataTransfer.getData('element-id') || e.dataTransfer.getData('text/plain');
            const targetId = dropZone?.dataset.dropTarget || null;

            if (draggedElementId && !blockId) {
                if (draggedElementId === targetId) return;
                moveBlock(draggedElementId, targetId, position);
                return;
            }

            if (!blockId) return;
            let block = basicBlocks.find(b => b.id === blockId) || designBlocks.find(b => b.id === blockId);
            if (!block) return;

            addBlock(block, targetId, position);
        };

        canvas.addEventListener('dragover', handleDragOver);
        canvas.addEventListener('dragleave', handleDragLeave);
        canvas.addEventListener('drop', handleDrop);

        return () => {
            canvas.removeEventListener('dragover', handleDragOver);
            canvas.removeEventListener('dragleave', handleDragLeave);
            canvas.removeEventListener('drop', handleDrop);
        };
    }, [addBlock, moveBlock, contentSection, canvasRef]);
}
