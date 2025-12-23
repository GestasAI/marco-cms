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
import { formatStyles } from '../utils/styleUtils';
import '../styles/editor-selection.css';
import '../styles/block-library.css';
import '../styles/editor-layout.css';
import '../styles/drop-zones.css';
import '../styles/editable-elements.css';
import '../styles/element-actions.css';
import '../styles/media-library.css';
import '../styles/unified-sidebar.css';
import '../styles/fse-improvements.css';

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
    const { addBlock, removeBlock, moveBlock, moveUp, moveDown, duplicateBlock } = useBlockManager(contentSection, setContentSection, setHasChanges);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleDragOver = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';

            const dropZone = e.target.closest('.drop-zone, .empty-container');
            if (!dropZone) return;

            // Limpiar clases previas
            canvasRef.current.querySelectorAll('.drop-zone-active, .drop-before, .drop-after').forEach(el => {
                el.classList.remove('drop-zone-active', 'drop-before', 'drop-after');
            });

            const rect = dropZone.getBoundingClientRect();
            const relativeY = e.clientY - rect.top;
            const threshold = rect.height * 0.2; // 20% de margen

            // Si es una sección, preferimos añadir antes/después a menos que esté muy en el centro
            const isSection = dropZone.tagName.toLowerCase() === 'section' || dropZone.classList.contains('section');

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

            if (canvasRef.current) {
                canvasRef.current.querySelectorAll('.drop-zone-active, .drop-before, .drop-after').forEach(el => {
                    el.classList.remove('drop-zone-active', 'drop-before', 'drop-after');
                });
            }

            const blockId = e.dataTransfer.getData('block-id');
            if (!blockId) return;

            let block = basicBlocks.find(b => b.id === blockId);
            if (!block) block = designBlocks.find(b => b.id === blockId);
            if (!block) return;

            const targetId = dropZone?.dataset.dropTarget || null;

            // REGLA DE ORO: Si el bloque es una sección y el destino es una sección, 
            // NUNCA anidar, siempre antes o después.
            let finalPosition = position;
            if (block.template.element === 'section' && dropZone?.tagName.toLowerCase() === 'section') {
                if (finalPosition === 'inside') {
                    // Si soltó en el centro de una sección, decidimos según la mitad superior o inferior
                    const rect = dropZone.getBoundingClientRect();
                    finalPosition = (e.clientY - rect.top < rect.height / 2) ? 'before' : 'after';
                }
            }

            addBlock(block, targetId, finalPosition);
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
                    <div
                        className="editor-canvas"
                        ref={canvasRef}
                    >
                        {contentSection ? (
                            <main
                                id={contentSection.id || 'canvas-root'}
                                className={`${contentSection.class || ''} drop-zone ${selectedElementId === contentSection.id ? 'selected-root-section' : ''}`}
                                data-drop-target={contentSection.id}
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        selectElement(contentSection);
                                    }
                                }}
                                style={{
                                    minHeight: '100%',
                                    width: '100%',
                                    position: 'relative',
                                    ...formatStyles(contentSection.customStyles || {})
                                }}
                            >
                                {contentSection.content && contentSection.content.map((el, idx) => (
                                    <EditableContainer
                                        key={`${el.id}-${idx}-${el.tag || el.element}-${Object.keys(el.customStyles || {}).length}`}
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
                        document={document}
                        setDocument={setDocument}
                        pageData={pageData}
                        setPageData={setPageData}
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
                        onMoveBlock={moveBlock}
                    />
                </div>
            </div>
        </div>
    );
}
