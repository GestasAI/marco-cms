import React from 'react';
import { cssClasses, parseClasses, addClass, removeClass } from '../cssClasses';

/**
 * Pestaña Style - Colores, Tipografía, Spacing, Bordes
 * Migrado desde StylesPanel manteniendo funcionalidad
 */
export function StyleTab({ selectedElement, onUpdateStyle, onUpdateCustomStyle }) {
    const currentClasses = parseClasses(selectedElement.class || '');
    const customStyles = selectedElement.customStyles || {};

    const hasClass = (className) => currentClasses.includes(className);

    const toggleClassHandler = (className) => {
        const currentClassString = selectedElement.class || '';
        let newClassString;

        if (hasClass(className)) {
            newClassString = removeClass(currentClassString, className);
        } else {
            newClassString = addClass(currentClassString, className);
        }

        onUpdateStyle(selectedElement.id, 'class', newClassString);
    };

    const handleCustomStyleChange = (property, value) => {
        onUpdateCustomStyle(selectedElement.id, property, value);
    };

    const renderClassButtons = (category) => {
        const classes = cssClasses[category]?.classes || [];

        return (
            <div className="button-grid-compact">
                {classes.map(cls => (
                    <button
                        key={cls.id}
                        className={hasClass(cls.value) ? 'active' : ''}
                        onClick={() => toggleClassHandler(cls.value)}
                        title={cls.preview || cls.value}
                    >
                        {cls.color && (
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: cls.color,
                                    borderRadius: '2px',
                                    marginRight: '4px'
                                }}
                            ></span>
                        )}
                        <span style={{ fontSize: '10px' }}>{cls.label}</span>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="tab-content">
            {/* Layout & Display */}
            <div className="section-header-compact">Layout</div>

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
                <div style={{ paddingLeft: '8px', borderLeft: '2px solid #eee', marginBottom: '10px' }}>
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
                </div>
            )}

            {/* Grid Options */}
            {customStyles['display'] === 'grid' && (
                <div style={{ paddingLeft: '8px', borderLeft: '2px solid #eee', marginBottom: '10px' }}>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Grid Columns</label>
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
                </div>
            )}

            <div className="divider-compact"></div>

            {/* Colores del Tema */}
            <div className="section-header-compact">Colores del Tema</div>
            {renderClassButtons('colors')}

            <div className="divider-compact"></div>

            {/* Colores Personalizados */}
            <div className="section-header-compact">Colores Personalizados</div>

            <div className="form-group-compact">
                <label className="form-label-compact">Color de Texto</label>
                <div className="color-picker-compact">
                    <div className="color-swatch-compact" style={{ background: customStyles['color'] || '#000000' }}>
                        <input
                            type="color"
                            value={customStyles['color'] || '#000000'}
                            onChange={(e) => handleCustomStyleChange('color', e.target.value)}
                        />
                    </div>
                    <input
                        type="text"
                        className="form-input-compact"
                        style={{ flex: 1 }}
                        value={customStyles['color'] || ''}
                        onChange={(e) => handleCustomStyleChange('color', e.target.value)}
                        placeholder="#000000"
                    />
                </div>
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Color de Fondo</label>
                <div className="color-picker-compact">
                    <div className="color-swatch-compact" style={{ background: customStyles['background-color'] || '#ffffff' }}>
                        <input
                            type="color"
                            value={customStyles['background-color'] || '#ffffff'}
                            onChange={(e) => handleCustomStyleChange('background-color', e.target.value)}
                        />
                    </div>
                    <input
                        type="text"
                        className="form-input-compact"
                        style={{ flex: 1 }}
                        value={customStyles['background-color'] || ''}
                        onChange={(e) => handleCustomStyleChange('background-color', e.target.value)}
                        placeholder="#ffffff"
                    />
                </div>
            </div>

            <div className="divider-compact"></div>

            {/* Tipografía */}
            <div className="section-header-compact">Tipografía</div>

            <div className="form-group-compact">
                <label className="form-label-compact">Font Size</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={customStyles['font-size'] || ''}
                    onChange={(e) => handleCustomStyleChange('font-size', e.target.value)}
                    placeholder="16px, 1rem"
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Font Weight</label>
                <select
                    className="form-input-compact"
                    value={customStyles['font-weight'] || ''}
                    onChange={(e) => handleCustomStyleChange('font-weight', e.target.value)}
                >
                    <option value="">Default</option>
                    <option value="300">Light (300)</option>
                    <option value="400">Normal (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi Bold (600)</option>
                    <option value="700">Bold (700)</option>
                </select>
            </div>

            <div className="divider-compact"></div>

            {/* Alineación y Dimensiones */}
            <div className="section-header-compact">Alineación</div>

            <div className="form-group-compact">
                <label className="form-label-compact">Posición (Margin)</label>
                <div className="button-grid-compact">
                    <button
                        className={customStyles['margin'] === '0' ? 'active' : ''}
                        onClick={() => handleCustomStyleChange('margin', '0')}
                        title="Izquierda"
                    >
                        ← Izq
                    </button>
                    <button
                        className={customStyles['margin'] === '0 auto' ? 'active' : ''}
                        onClick={() => handleCustomStyleChange('margin', '0 auto')}
                        title="Centro"
                    >
                        ↔ Centro
                    </button>
                    <button
                        className={customStyles['margin'] === '0 0 0 auto' ? 'active' : ''}
                        onClick={() => handleCustomStyleChange('margin', '0 0 0 auto')}
                        title="Derecha"
                    >
                        Der →
                    </button>
                </div>
            </div>

            <div className="divider-compact"></div>

            <div className="section-header-compact">Dimensiones</div>

            <div className="form-group-compact">
                <label className="form-label-compact">Ancho (Width)</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={customStyles['width'] || selectedElement.width || ''}
                    onChange={(e) => handleCustomStyleChange('width', e.target.value)}
                    placeholder="100%, 500px, auto"
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Alto (Height)</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={customStyles['height'] || selectedElement.height || ''}
                    onChange={(e) => handleCustomStyleChange('height', e.target.value)}
                    placeholder="auto, 300px"
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Ancho Máximo (Max Width)</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={customStyles['max-width'] || ''}
                    onChange={(e) => handleCustomStyleChange('max-width', e.target.value)}
                    placeholder="1200px, 100%"
                />
            </div>

            {(selectedElement.element === 'image' || selectedElement.element === 'video') && (
                <div className="form-group-compact">
                    <label className="form-label-compact">Object Fit</label>
                    <select
                        className="form-input-compact"
                        value={customStyles['object-fit'] || ''}
                        onChange={(e) => handleCustomStyleChange('object-fit', e.target.value)}
                    >
                        <option value="">Default</option>
                        <option value="contain">Contain</option>
                        <option value="cover">Cover</option>
                        <option value="fill">Fill</option>
                        <option value="none">None</option>
                    </select>
                </div>
            )}

            <div className="divider-compact"></div>

            {/* Spacing */}
            <div className="section-header-compact">Spacing</div>

            <div className="form-group-compact">
                <label className="form-label-compact">Margin</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={customStyles['margin'] || ''}
                    onChange={(e) => handleCustomStyleChange('margin', e.target.value)}
                    placeholder="10px, 10px 20px"
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Padding</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={customStyles['padding'] || ''}
                    onChange={(e) => handleCustomStyleChange('padding', e.target.value)}
                    placeholder="10px, 10px 20px"
                />
            </div>

            <div className="divider-compact"></div>

            {/* Border */}
            <div className="section-header-compact">Bordes</div>

            <div className="form-group-compact">
                <label className="form-label-compact">Border Radius</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={customStyles['border-radius'] || ''}
                    onChange={(e) => handleCustomStyleChange('border-radius', e.target.value)}
                    placeholder="4px, 8px 8px 0 0"
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Box Shadow</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={customStyles['box-shadow'] || ''}
                    onChange={(e) => handleCustomStyleChange('box-shadow', e.target.value)}
                    placeholder="0 4px 6px rgba(0,0,0,0.1)"
                />
            </div>

            <div className="divider-compact"></div>

            {/* Opacity */}
            <div className="section-header-compact">Opacidad</div>

            <div className="form-group-compact">
                <div className="range-group-compact">
                    <input
                        type="range"
                        className="range-input-compact"
                        min="0"
                        max="1"
                        step="0.1"
                        value={customStyles['opacity'] || '1'}
                        onChange={(e) => handleCustomStyleChange('opacity', e.target.value)}
                    />
                    <span className="range-value-compact">{customStyles['opacity'] || '1'}</span>
                </div>
            </div>
        </div>
    );
}
