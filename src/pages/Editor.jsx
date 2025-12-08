import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDocument } from '../hooks/useDocument';
import { useElementEditor } from '../hooks/useElementEditor';
import { useSaveDocument } from '../hooks/useSaveDocument';
import { useBlockManager } from '../hooks/useBlockManager';
import { EditorToolbar } from '../fse/EditorToolbar';
import { BlockLibrary } from '../fse/BlockLibrary';
import { EditableContainer } from '../fse/EditableContainer';
import { UnifiedSidebar } from '../fse/UnifiedSidebar';
import { basicBlocks, designBlocks } from '../fse/blocks';
import '../styles/editor-selection.css';
import '../styles/block-library.css';
import '../styles/editor-layout.css';
import '../styles/drop-zones.css';
import '../styles/editable-elements.css';
import '../styles/element-actions.css';
import '../styles/media-library.css';
import '../styles/unified-sidebar.css';

export default function Editor() {
    const { collection, id } = useParams();
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    const {
        document,
        setDocument,
        pageData,
        setPageData,
        contentSection,
        setContentSection,
        loading,
        error
    } = useDocument(collection, id);

    const {
        selectedElementId,
        selectedElement,
        hasChanges,
        setHasChanges,
        updateElement,
        updateMultipleFields,
        updateCustomStyle,
        selectElement
    } = useElementEditor(contentSection, setContentSection);

    const { saving, saveDocument } = useSaveDocument();
    const { addBlock, removeBlock, moveUp, moveDown, duplicateBlock } = useBlockManager(contentSection, setContentSection, setHasChanges);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleDragOver = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            const dropZone = e.target.closest('.drop-zone, .empty-container');
            if (dropZone) dropZone.classList.add('drop-zone-active');
        };

        const handleDragLeave = (e) => {
            const dropZone = e.target.closest('.drop-zone, .empty-container');
            if (dropZone) dropZone.classList.remove('drop-zone-active');
        };

        const handleDrop = (e) => {
            e.preventDefault();
            if (canvasRef.current) {
                canvasRef.current.querySelectorAll('.drop-zone-active').forEach(el => {
                    el.classList.remove('drop-zone-active');
                });
            }

            const blockId = e.dataTransfer.getData('block-id');
            if (!blockId) return;

            let block = basicBlocks.find(b => b.id === blockId);
            if (!block) block = designBlocks.find(b => b.id === blockId);
            if (!block) return;

            const dropTarget = e.target.closest('[data-drop-target]');
            const targetId = dropTarget?.dataset.dropTarget || null;
            addBlock(block, targetId, 'inside');
        };

        canvas.addEventListener('dragover', handleDragOver);
        canvas.addEventListener('dragleave', handleDragLeave);
        canvas.addEventListener('drop', handleDrop);

        return () => {
            canvas.removeEventListener('dragover', handleDragOver);
            canvas.removeEventListener('dragleave', handleDragLeave);
            canvas.removeEventListener('drop', handleDrop);
        };
    }, [addBlock, contentSection]);

    const handleSave = async () => {
        const result = await saveDocument(collection, id, document, pageData, contentSection);
        if (result.success) {
            setHasChanges(false);
            if (result.data) {
                setDocument(result.data);
                setPageData(result.updatedPageData);
            }
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex-center">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="editor-root">
            <EditorToolbar
                document={document}
                hasChanges={hasChanges}
                saving={saving}
                onBack={() => navigate(-1)}
                onSave={handleSave}
                onPreview={() => document?.slug && window.open(`/${document.slug}`, '_blank')}
            />

            <div className="editor-workspace">
                <BlockLibrary />

                <div className="editor-canvas-container">
                    <link rel="stylesheet" href="/themes/gestasai-default/theme.css" />
                    <div className="editor-canvas" ref={canvasRef}>
                        {contentSection ? (
                            <main
                                id={contentSection.id}
                                className={`${contentSection.class} drop-zone`}
                                data-drop-target={contentSection.id}
                            >
                                {contentSection.content && contentSection.content.map(el => (
                                    <EditableContainer
                                        key={el.id}
                                        element={el}
                                        selectedElementId={selectedElementId}
                                        onSelect={selectElement}
                                        onAddBlock={addBlock}
                                    />
                                ))}
                            </main>
                        ) : (
                            <div className="text-center text-secondary p-xl">
                                <p>No hay contenido para editar</p>
                                <p className="text-xs mt-sm">Arrastra bloques desde la izquierda</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="editor-right-sidebar">
                    <UnifiedSidebar
                        selectedElement={selectedElement}
                        contentSection={contentSection}
                        onUpdate={updateElement}
                        onUpdateMultiple={updateMultipleFields}
                        onUpdateStyle={updateElement}
                        onUpdateCustomStyle={updateCustomStyle}
                        onSelectElement={selectElement}
                        onDelete={removeBlock}
                        onMoveUp={moveUp}
                        onMoveDown={moveDown}
                        onDuplicate={duplicateBlock}
                    />
                </div>
            </div>
        </div>
    );
}
