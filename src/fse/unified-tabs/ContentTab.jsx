import React from 'react';

/**
 * Pestaña Content - Propiedades básicas del elemento
 * Migrado desde PropertiesSidebar manteniendo TODA la funcionalidad
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
    const isContainer = ['container', 'section', 'logo', 'grid', 'card', 'nav'].includes(selectedElement.element);

    return (
        <div className="tab-content">
            {/* Identificador del Elemento */}
            <div className="element-id-badge">
                <span className="text-xs font-mono text-gray-500">ID: {selectedElement.id}</span>
            </div>

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
            <div className="tab-section-title">Contenido</div>

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

            {/* BUTTON / LINK */}
            {(selectedElement.element === 'button' || selectedElement.element === 'link') && (
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

            {/* CONTAINER / SECTION / LOGO / GRID / CARD / NAV */}
            {isContainer && (
                <div className="form-group-compact">
                    <p className="text-xs text-gray-500 italic">
                        Elemento contenedor. Gestiona sus hijos arrastrando bloques.
                    </p>
                </div>
            )}

            {/* IMAGE y VIDEO se manejan en la pestaña Media */}
            {(selectedElement.element === 'image' || selectedElement.element === 'video') && (
                <div className="form-group-compact">
                    <p className="text-xs text-gray-600">
                        📸 Ve a la pestaña <strong>Media</strong> para gestionar el contenido.
                    </p>
                </div>
            )}

            {/* LAYOUT PROPERTIES (Para todos los elementos) */}
            <div className="tab-section-divider"></div>
            <div className="tab-section-title">Diseño y Layout</div>

            <div className="form-row-compact">
                <div className="form-group-compact half">
                    <label className="form-label-compact">Ancho</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={selectedElement.customStyles?.width || ''}
                        onChange={(e) => onUpdateCustomStyle(selectedElement.id, 'width', e.target.value)}
                        placeholder="auto, 100%"
                    />
                </div>
                <div className="form-group-compact half">
                    <label className="form-label-compact">Alto</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={selectedElement.customStyles?.height || ''}
                        onChange={(e) => onUpdateCustomStyle(selectedElement.id, 'height', e.target.value)}
                        placeholder="auto, 400px"
                    />
                </div>
            </div>

            <div className="form-row-compact">
                <div className="form-group-compact half">
                    <label className="form-label-compact">Padding</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={selectedElement.customStyles?.padding || ''}
                        onChange={(e) => onUpdateCustomStyle(selectedElement.id, 'padding', e.target.value)}
                        placeholder="10px, 1rem"
                    />
                </div>
                <div className="form-group-compact half">
                    <label className="form-label-compact">Margen</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={selectedElement.customStyles?.margin || ''}
                        onChange={(e) => onUpdateCustomStyle(selectedElement.id, 'margin', e.target.value)}
                        placeholder="0 auto, 20px"
                    />
                </div>
            </div>

            {/* Alineación / Flex (Solo para contenedores) */}
            {isContainer && (
                <div className="form-group-compact">
                    <label className="form-label-compact">Alineación (Flex)</label>
                    <div className="flex-options-grid">
                        <select
                            className="form-input-compact"
                            value={selectedElement.customStyles?.display || 'block'}
                            onChange={(e) => onUpdateCustomStyle(selectedElement.id, 'display', e.target.value)}
                        >
                            <option value="block">Bloque (Normal)</option>
                            <option value="flex">Flexbox</option>
                            <option value="grid">Grid</option>
                        </select>

                        {selectedElement.customStyles?.display === 'flex' && (
                            <>
                                <select
                                    className="form-input-compact mt-xs"
                                    value={selectedElement.customStyles?.flexDirection || 'row'}
                                    onChange={(e) => onUpdateCustomStyle(selectedElement.id, 'flexDirection', e.target.value)}
                                >
                                    <option value="row">Horizontal (Row)</option>
                                    <option value="column">Vertical (Column)</option>
                                </select>
                                <select
                                    className="form-input-compact mt-xs"
                                    value={selectedElement.customStyles?.justifyContent || 'flex-start'}
                                    onChange={(e) => onUpdateCustomStyle(selectedElement.id, 'justifyContent', e.target.value)}
                                >
                                    <option value="flex-start">Inicio</option>
                                    <option value="center">Centro</option>
                                    <option value="flex-end">Fin</option>
                                    <option value="space-between">Espaciado</option>
                                </select>
                                <select
                                    className="form-input-compact mt-xs"
                                    value={selectedElement.customStyles?.alignItems || 'stretch'}
                                    onChange={(e) => onUpdateCustomStyle(selectedElement.id, 'alignItems', e.target.value)}
                                >
                                    <option value="stretch">Estirar</option>
                                    <option value="center">Centro</option>
                                    <option value="flex-start">Inicio</option>
                                    <option value="flex-end">Fin</option>
                                </select>
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
