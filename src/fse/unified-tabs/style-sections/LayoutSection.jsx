import React from 'react';

export function LayoutSection({ customStyles, handleCustomStyleChange, selectedElement, onUpdateStyle }) {
    return (
        <>
            <div className="section-header-compact">Layout & Display</div>
            <div className="form-group-compact">
                <label className="form-label-compact">Display</label>
                <select
                    className="form-input-compact"
                    value={customStyles['display'] || ''}
                    onChange={(e) => handleCustomStyleChange('display', e.target.value)}
                >
                    <option value="">Por defecto</option>
                    <option value="block">Block</option>
                    <option value="inline-block">Inline Block</option>
                    <option value="flex">Flex</option>
                    <option value="grid">Grid</option>
                    <option value="none">Ocultar</option>
                </select>
            </div>

            {/* Flexbox Options */}
            {customStyles['display'] === 'flex' && (
                <div className="mt-sm p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="form-group-compact">
                        <label className="form-label-compact">Dirección</label>
                        <select
                            className="form-input-compact"
                            value={customStyles['flexDirection'] || 'row'}
                            onChange={(e) => handleCustomStyleChange('flexDirection', e.target.value)}
                        >
                            <option value="row">Horizontal (Row)</option>
                            <option value="column">Vertical (Column)</option>
                        </select>
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Justificar</label>
                        <select
                            className="form-input-compact"
                            value={customStyles['justifyContent'] || ''}
                            onChange={(e) => handleCustomStyleChange('justifyContent', e.target.value)}
                        >
                            <option value="">Default</option>
                            <option value="flex-start">Inicio</option>
                            <option value="center">Centro</option>
                            <option value="flex-end">Fin</option>
                            <option value="space-between">Espaciado</option>
                        </select>
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Gap</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            value={customStyles['gap'] || ''}
                            onChange={(e) => handleCustomStyleChange('gap', e.target.value)}
                            placeholder="16px"
                        />
                    </div>
                </div>
            )}

            {/* Configuración de Columnas (Bloque 'columns') */}
            {selectedElement.element === 'columns' && (
                <div className="mt-sm p-2 bg-indigo-50 rounded border border-indigo-100">
                    <label className="form-label-compact text-indigo-700">Número de Columnas</label>
                    <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 6].map(num => (
                            <button
                                key={num}
                                className={`action-icon-btn flex-1 ${selectedElement.content?.length === num ? 'active' : ''}`}
                                onClick={() => {
                                    const currentContent = [...(selectedElement.content || [])];
                                    let newContent;
                                    if (num > currentContent.length) {
                                        const toAdd = num - currentContent.length;
                                        const newCols = Array(toAdd).fill(0).map(() => ({
                                            element: 'column',
                                            id: `column-${Date.now()}-${Math.random()}`,
                                            class: 'column',
                                            content: []
                                        }));
                                        newContent = [...currentContent, ...newCols];
                                    } else {
                                        newContent = currentContent.slice(0, num);
                                    }
                                    onUpdateStyle(selectedElement.id, 'content', newContent);
                                }}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
