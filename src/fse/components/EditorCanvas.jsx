import React from 'react';
import { EditableContainer } from '../EditableContainer';
import { formatStyles } from '../../utils/styleUtils';

export function EditorCanvas({
    canvasRef,
    contentSection,
    document,
    selectedElementId,
    selectElement,
    addBlock,
    updateElement
}) {
    return (
        <div className="editor-canvas-container">
            <div className="editor-canvas" ref={canvasRef}>
                {contentSection ? (
                    <main
                        id={contentSection.id}
                        className={`${contentSection.class || ''} drop-zone`}
                        data-drop-target={contentSection.id}
                        onClick={() => selectElement(contentSection)}
                        style={{
                            position: 'relative',
                            minHeight: '100%',
                            ...formatStyles(contentSection.customStyles || {})
                        }}
                    >
                        {contentSection.content && contentSection.content.map((el, idx) => (
                            <EditableContainer
                                key={`${el.id}-${idx}`}
                                element={el}
                                document={document}
                                selectedElementId={selectedElementId}
                                onSelect={selectElement}
                                onAddBlock={addBlock}
                                onUpdate={updateElement}
                            />
                        ))}
                    </main>
                ) : (
                    <div className="text-center p-xl">
                        <p>No hay contenido para editar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
