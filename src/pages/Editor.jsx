import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDocument } from '../hooks/useDocument';
import { useElementEditor } from '../hooks/useElementEditor';
import { useSaveDocument } from '../hooks/useSaveDocument';
import { useBlockManager } from '../hooks/useBlockManager';
import { useEditorDragAndDrop } from '../hooks/useEditorDragAndDrop';
import { EditorToolbar } from '../fse/EditorToolbar';
import { BlockLibrary } from '../fse/BlockLibrary';
import { UnifiedSidebar } from '../fse/UnifiedSidebar';
import { EditorCanvas } from '../fse/components/EditorCanvas';

// Estilos
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

    // Lógica de Drag & Drop
    useEditorDragAndDrop(canvasRef, contentSection, addBlock, moveBlock);

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

    if (loading) return <div className="h-screen flex-center"><Loader2 className="animate-spin" size={32} /></div>;
    if (error) return <div className="h-screen flex-center text-red-500">{error}</div>;

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

            {pageData?.theme && (
                <link rel="stylesheet" href={`/themes/${pageData.theme}/theme.css`} />
            )}

            <div className="editor-workspace">
                <BlockLibrary onAddBlock={addBlock} />

                <EditorCanvas
                    canvasRef={canvasRef}
                    contentSection={contentSection}
                    document={document}
                    selectedElementId={selectedElementId}
                    selectElement={selectElement}
                    addBlock={addBlock}
                    updateElement={updateElement}
                />

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
