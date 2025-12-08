import React from 'react';

/**
 * Pestaña Sections - Layout, Display, Flexbox, Grid
 * Migrado desde StylesPanel (pestaña Layout) manteniendo funcionalidad
 */
export function SectionsTab({ selectedElement, onUpdateStyle, onUpdateCustomStyle }) {
    const customStyles = selectedElement.customStyles || {};

    const handleCustomStyleChange = (property, value) => {
        onUpdateCustomStyle(selectedElement.id, property, value);
    };

    return (
        <div className="tab-content">
            {/* Display */}
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
                    <option value="none">None (Ocultar)</option>
                </select>
            </div>

            {/* Flexbox Options */}
            {customStyles['display'] === 'flex' && (
                <>
                    <div className="section-header-compact">Flexbox</div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Flex Direction</label>
                        <select
                            className="form-input-compact"
                            value={customStyles['flex-direction'] || 'row'}
                            onChange={(e) => handleCustomStyleChange('flex-direction', e.target.value)}
                        >
                            <option value="row">Row</option>
                            <option value="column">Column</option>
                        </select>
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Justify Content</label>
                        <select
                            className="form-input-compact"
                            value={customStyles['justify-content'] || ''}
                            onChange={(e) => handleCustomStyleChange('justify-content', e.target.value)}
                        >
                            <option value="">Default</option>
                            <option value="flex-start">Start</option>
                            <option value="center">Center</option>
                            <option value="flex-end">End</option>
                            <option value="space-between">Space Between</option>
                            <option value="space-around">Space Around</option>
                        </select>
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Align Items</label>
                        <select
                            className="form-input-compact"
                            value={customStyles['align-items'] || ''}
                            onChange={(e) => handleCustomStyleChange('align-items', e.target.value)}
                        >
                            <option value="">Default</option>
                            <option value="flex-start">Start</option>
                            <option value="center">Center</option>
                            <option value="flex-end">End</option>
                            <option value="stretch">Stretch</option>
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
                </>
            )}

            {/* Grid Options */}
            {customStyles['display'] === 'grid' && (
                <>
                    <div className="section-header-compact">Grid</div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Grid Template Columns</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            value={customStyles['grid-template-columns'] || ''}
                            onChange={(e) => handleCustomStyleChange('grid-template-columns', e.target.value)}
                            placeholder="repeat(3, 1fr)"
                        />
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
                </>
            )}

            <div className="divider-compact"></div>

            {/* Width & Height */}
            <div className="section-header-compact">Tamaño</div>

            <div className="form-group-compact">
                <label className="form-label-compact">Width</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={customStyles['width'] || ''}
                    onChange={(e) => handleCustomStyleChange('width', e.target.value)}
                    placeholder="auto, 100%, 300px"
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Height</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={customStyles['height'] || ''}
                    onChange={(e) => handleCustomStyleChange('height', e.target.value)}
                    placeholder="auto, 100%, 300px"
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Max Width</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={customStyles['max-width'] || ''}
                    onChange={(e) => handleCustomStyleChange('max-width', e.target.value)}
                    placeholder="1200px"
                />
            </div>
        </div>
    );
}
