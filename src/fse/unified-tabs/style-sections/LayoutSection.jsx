import React from 'react';

export function LayoutSection({
    customStyles,
    handleCustomStyleChange,
    handleSettingsChange,
    selectedElement,
    onUpdateStyle
}) {
    const isLayoutElement = ['section', 'container', 'columns', 'column', 'grid', 'nav'].includes(selectedElement.element);
    const settings = selectedElement.settings || {};

    return (
        <>
            <div className="section-header-compact">Layout & Spacing</div>

            {/* Ancho y Contenedor (Solo para Section/Container) */}
            {(selectedElement.element === 'section' || selectedElement.element === 'container') && (
                <div className="form-group-compact">
                    <label className="form-label-compact">Ancho del Contenido</label>
                    <select
                        className="form-input-compact"
                        value={settings.layout?.width || (selectedElement.element === 'section' ? 'full-width' : 'boxed')}
                        onChange={(e) => handleSettingsChange('layout.width', e.target.value)}
                    >
                        <option value="boxed">Boxed (Centrado)</option>
                        <option value="full-width">Full Width (Ancho Total)</option>
                    </select>
                </div>
            )}

            {settings.layout?.width === 'boxed' && (
                <div className="form-group-compact">
                    <label className="form-label-compact">Ancho Máximo</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={settings.layout?.maxWidth || '1200px'}
                        onChange={(e) => handleSettingsChange('layout.maxWidth', e.target.value)}
                        placeholder="1200px"
                    />
                </div>
            )}

            {/* Spacing (Padding & Margin) */}
            <div className="mt-sm grid grid-cols-2 gap-2">
                <div className="form-group-compact">
                    <label className="form-label-compact">Padding</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={settings.spacing?.padding || customStyles['padding'] || ''}
                        onChange={(e) => {
                            if (isLayoutElement) handleSettingsChange('spacing.padding', e.target.value);
                            else handleCustomStyleChange('padding', e.target.value);
                        }}
                        placeholder="20px"
                    />
                </div>
                <div className="form-group-compact">
                    <label className="form-label-compact">Margin</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={settings.spacing?.margin || customStyles['margin'] || ''}
                        onChange={(e) => {
                            if (isLayoutElement) handleSettingsChange('spacing.margin', e.target.value);
                            else handleCustomStyleChange('margin', e.target.value);
                        }}
                        placeholder="0 auto"
                    />
                </div>
            </div>

            <div className="divider-compact"></div>

            {/* Display & Flexbox */}
            <div className="form-group-compact">
                <label className="form-label-compact">Display</label>
                <select
                    className="form-input-compact"
                    value={customStyles['display'] || ''}
                    onChange={(e) => handleCustomStyleChange('display', e.target.value)}
                >
                    <option value="">Default</option>
                    <option value="block">Block</option>
                    <option value="inline-block">Inline Block</option>
                    <option value="flex">Flex</option>
                    <option value="grid">Grid</option>
                    <option value="none">Ocultar</option>
                </select>
            </div>

            {/* Flexbox / Alignment Options */}
            {(customStyles['display'] === 'flex' || selectedElement.element === 'columns' || selectedElement.element === 'nav') && (
                <div className="mt-sm p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="form-group-compact">
                        <label className="form-label-compact">Alineación (Align)</label>
                        <select
                            className="form-input-compact"
                            value={settings.layout?.align || customStyles['alignItems'] || 'stretch'}
                            onChange={(e) => {
                                if (isLayoutElement) handleSettingsChange('layout.align', e.target.value);
                                else handleCustomStyleChange('alignItems', e.target.value);
                            }}
                        >
                            <option value="stretch">Stretch</option>
                            <option value="flex-start">Inicio</option>
                            <option value="center">Centro</option>
                            <option value="flex-end">Fin</option>
                        </select>
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Justificar (Justify)</label>
                        <select
                            className="form-input-compact"
                            value={settings.layout?.justify || customStyles['justifyContent'] || 'flex-start'}
                            onChange={(e) => {
                                if (isLayoutElement) handleSettingsChange('layout.justify', e.target.value);
                                else handleCustomStyleChange('justifyContent', e.target.value);
                            }}
                        >
                            <option value="flex-start">Inicio</option>
                            <option value="center">Centro</option>
                            <option value="flex-end">Fin</option>
                            <option value="space-between">Espaciado (Between)</option>
                            <option value="space-around">Alrededor (Around)</option>
                        </select>
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Gap</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            value={settings.layout?.gap || customStyles['gap'] || ''}
                            onChange={(e) => {
                                if (isLayoutElement) handleSettingsChange('layout.gap', e.target.value);
                                else handleCustomStyleChange('gap', e.target.value);
                            }}
                            placeholder="20px"
                        />
                    </div>
                </div>
            )}

            {/* Configuración de Columnas (Bloque 'columns') */}
            {selectedElement.element === 'columns' && (
                <div className="mt-sm p-2 bg-indigo-50 rounded border border-indigo-100">
                    <label className="form-label-compact text-indigo-700 font-bold">Estructura de Columnas</label>
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
                                        const newCols = Array(toAdd).fill(0).map((_, i) => ({
                                            element: 'column',
                                            id: `column-${Date.now()}-${i}`,
                                            class: 'column mc-column',
                                            content: [],
                                            settings: { spacing: { padding: '15px' } }
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
