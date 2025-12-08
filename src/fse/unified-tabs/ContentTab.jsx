import React from 'react';

/**
 * Pestaña Content - Propiedades básicas del elemento
 * Migrado desde PropertiesSidebar manteniendo TODA la funcionalidad
 */
export function ContentTab({ selectedElement, onUpdate, onDelete, onMoveUp, onMoveDown, onDuplicate }) {

    return (
        <div className="tab-content">
            {/* Botones de Acción - Solo Iconos Unicode */}
            <div className="action-icons-row">
                <button className="action-icon-btn" onClick={() => onMoveUp(selectedElement.id)} title="Mover arriba">
                    ↑
                </button>
                <button className="action-icon-btn" onClick={() => onMoveDown(selectedElement.id)} title="Mover abajo">
                    ↓
                </button>
                <button className="action-icon-btn" onClick={() => onDuplicate(selectedElement.id)} title="Duplicar">
                    ⎘
                </button>
                <button className="action-icon-btn action-icon-delete" onClick={() => onDelete(selectedElement.id)} title="Eliminar">
                    🗑
                </button>
            </div>

            {/* Contenido según tipo de elemento */}

            {/* HEADING */}
            {selectedElement.element === 'heading' && (
                <>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Texto</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            value={selectedElement.text || ''}
                            onChange={(e) => onUpdate(selectedElement.id, 'text', e.target.value)}
                        />
                    </div>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Etiqueta</label>
                        <select
                            className="form-input-compact"
                            value={selectedElement.tag || 'h2'}
                            onChange={(e) => onUpdate(selectedElement.id, 'tag', e.target.value)}
                        >
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                            <option value="h5">H5</option>
                            <option value="h6">H6</option>
                        </select>
                    </div>
                </>
            )}

            {/* TEXT */}
            {selectedElement.element === 'text' && (
                <div className="form-group-compact">
                    <label className="form-label-compact">Texto</label>
                    <textarea
                        className="form-input-compact"
                        rows="4"
                        value={selectedElement.text || ''}
                        onChange={(e) => onUpdate(selectedElement.id, 'text', e.target.value)}
                    />
                </div>
            )}

            {/* BUTTON */}
            {selectedElement.element === 'button' && (
                <>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Texto</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            value={selectedElement.text || ''}
                            onChange={(e) => onUpdate(selectedElement.id, 'text', e.target.value)}
                        />
                    </div>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Enlace</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            value={selectedElement.link || ''}
                            onChange={(e) => onUpdate(selectedElement.id, 'link', e.target.value)}
                            placeholder="https://ejemplo.com"
                        />
                    </div>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Abrir en</label>
                        <select
                            className="form-input-compact"
                            value={selectedElement.target || '_self'}
                            onChange={(e) => onUpdate(selectedElement.id, 'target', e.target.value)}
                        >
                            <option value="_self">Misma ventana</option>
                            <option value="_blank">Nueva ventana</option>
                        </select>
                    </div>
                </>
            )}

            {/* SEARCH */}
            {selectedElement.element === 'search' && (
                <div className="form-group-compact">
                    <label className="form-label-compact">Placeholder</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={selectedElement.placeholder || ''}
                        onChange={(e) => onUpdate(selectedElement.id, 'placeholder', e.target.value)}
                        placeholder="Buscar..."
                    />
                </div>
            )}

            {/* CONTAINER / SECTION / LOGO */}
            {(selectedElement.element === 'container' || selectedElement.element === 'section' || selectedElement.element === 'logo') && (
                <div className="form-group-compact">
                    <p className="text-xs text-gray-600">
                        Este es un elemento contenedor. Usa las otras pestañas para configurar su diseño y estilos.
                    </p>
                </div>
            )}

            {/* IMAGE y VIDEO se manejan en la pestaña Media */}
            {(selectedElement.element === 'image' || selectedElement.element === 'video') && (
                <div className="form-group-compact">
                    <p className="text-xs text-gray-600">
                        📸 Ve a la pestaña <strong>Media</strong> para gestionar este elemento.
                    </p>
                </div>
            )}
        </div>
    );
}
