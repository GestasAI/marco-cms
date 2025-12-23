import React from 'react';
import { HeadingEditor } from '../content-controls/HeadingEditor';
import { TextEditor } from '../content-controls/TextEditor';
import { ButtonEditor } from '../content-controls/ButtonEditor';
import { ImageEditor } from '../content-controls/ImageEditor';
import { VideoEditor } from '../content-controls/VideoEditor';
import { LayoutEditor } from '../content-controls/LayoutEditor';

/**
 * Pestaña Content - Propiedades dinámicas y CSS del elemento
 */
export function ContentTab({
    selectedElement,
    onUpdate,
    onUpdateCustomStyle,
    onDelete,
    onMoveUp,
    onMoveDown,
    onDuplicate
}) {
    const styles = selectedElement.customStyles || {};

    return (
        <div className="tab-content">
            {/* Identificador del Elemento */}
            <div className="element-id-badge">
                <span className="text-xs font-mono text-gray-500">ID: {selectedElement.id} ({selectedElement.element})</span>
            </div>

            {/* Botones de Acción */}
            <div className="action-icons-row">
                <button className="action-icon-btn" onClick={() => onMoveUp(selectedElement.id)} title="Mover arriba">↑</button>
                <button className="action-icon-btn" onClick={() => onMoveDown(selectedElement.id)} title="Mover abajo">↓</button>
                <button className="action-icon-btn" onClick={() => onDuplicate(selectedElement.id)} title="Duplicar">⎘</button>
                <button className="action-icon-btn action-icon-delete" onClick={() => onDelete(selectedElement.id)} title="Eliminar">🗑</button>
            </div>

            {/* CONTENIDO ESPECÍFICO */}
            <div className="tab-section-title">Contenido</div>

            {selectedElement.element === 'heading' && (
                <HeadingEditor element={selectedElement} onUpdate={onUpdate} />
            )}

            {selectedElement.element === 'text' && (
                <TextEditor element={selectedElement} onUpdate={onUpdate} />
            )}

            {(selectedElement.element === 'button' || selectedElement.element === 'link') && (
                <ButtonEditor element={selectedElement} onUpdate={onUpdate} />
            )}

            {selectedElement.element === 'image' && (
                <ImageEditor element={selectedElement} onUpdate={onUpdate} />
            )}

            {selectedElement.element === 'video' && (
                <VideoEditor element={selectedElement} onUpdate={onUpdate} />
            )}

            {/* DISEÑO Y LAYOUT (DINÁMICO PARA TODOS) */}
            <LayoutEditor
                styles={styles}
                onUpdateStyle={(prop, val) => onUpdateCustomStyle(selectedElement.id, prop, val)}
            />
        </div>
    );
}
