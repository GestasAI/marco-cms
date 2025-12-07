import React, { useState } from 'react';
import { Layout, Type, Palette, Box, Sliders, Maximize2 } from 'lucide-react';
import { cssClasses, parseClasses, addClass, removeClass } from './cssClasses';

export function StylesPanel({ selectedElement, onUpdateStyle, onUpdateCustomStyle }) {
    const [activeTab, setActiveTab] = useState('layout');

    if (!selectedElement) {
        return (
            <div className="editor-sidebar">
                <div className="editor-sidebar-header">🎨 Estilos</div>
                <div className="editor-sidebar-content">
                    <p className="text-secondary text-sm">Selecciona un elemento para aplicar estilos</p>
                </div>
            </div>
        );
    }

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
            <div className="class-buttons-grid">
                {classes.map(cls => (
                    <button
                        key={cls.id}
                        className={`class-btn ${hasClass(cls.value) ? 'active' : ''}`}
                        onClick={() => toggleClassHandler(cls.value)}
                        title={cls.preview || cls.value}
                    >
                        {cls.color && (
                            <span
                                className="color-preview"
                                style={{ backgroundColor: cls.color }}
                            ></span>
                        )}
                        <span className="class-label">{cls.label}</span>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="editor-sidebar styles-panel">
            <div className="editor-sidebar-header">🎨 Estilos</div>

            <div className="styles-tabs">
                <button
                    className={`styles-tab ${activeTab === 'layout' ? 'active' : ''}`}
                    onClick={() => setActiveTab('layout')}
                    title="Layout"
                >
                    <Layout size={16} />
                </button>
                <button
                    className={`styles-tab ${activeTab === 'spacing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('spacing')}
                    title="Espaciado"
                >
                    <Box size={16} />
                </button>
                <button
                    className={`styles-tab ${activeTab === 'size' ? 'active' : ''}`}
                    onClick={() => setActiveTab('size')}
                    title="Tamaño"
                >
                    <Maximize2 size={16} />
                </button>
                <button
                    className={`styles-tab ${activeTab === 'typography' ? 'active' : ''}`}
                    onClick={() => setActiveTab('typography')}
                    title="Tipografía"
                >
                    <Type size={16} />
                </button>
                <button
                    className={`styles-tab ${activeTab === 'colors' ? 'active' : ''}`}
                    onClick={() => setActiveTab('colors')}
                    title="Colores"
                >
                    <Palette size={16} />
                </button>
                <button
                    className={`styles-tab ${activeTab === 'advanced' ? 'active' : ''}`}
                    onClick={() => setActiveTab('advanced')}
                    title="Avanzado"
                >
                    <Sliders size={16} />
                </button>
            </div>

            <div className="editor-sidebar-content">
                {/* LAYOUT */}
                {activeTab === 'layout' && (
                    <>
                        <h4 className="heading-6 mb-sm">Layout</h4>
                        {renderClassButtons('layout')}

                        <h4 className="heading-6 mb-sm mt-md">Display</h4>
                        <div className="form-group">
                            <select
                                className="form-input text-sm"
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

                        {customStyles['display'] === 'flex' && (
                            <>
                                <div className="form-group">
                                    <label className="form-label text-xs">Flex Direction</label>
                                    <select
                                        className="form-input text-sm"
                                        value={customStyles['flex-direction'] || 'row'}
                                        onChange={(e) => handleCustomStyleChange('flex-direction', e.target.value)}
                                    >
                                        <option value="row">Row</option>
                                        <option value="column">Column</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-xs">Justify Content</label>
                                    <select
                                        className="form-input text-sm"
                                        value={customStyles['justify-content'] || ''}
                                        onChange={(e) => handleCustomStyleChange('justify-content', e.target.value)}
                                    >
                                        <option value="">Normal</option>
                                        <option value="flex-start">Start</option>
                                        <option value="center">Center</option>
                                        <option value="flex-end">End</option>
                                        <option value="space-between">Space Between</option>
                                        <option value="space-around">Space Around</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-xs">Align Items</label>
                                    <select
                                        className="form-input text-sm"
                                        value={customStyles['align-items'] || ''}
                                        onChange={(e) => handleCustomStyleChange('align-items', e.target.value)}
                                    >
                                        <option value="">Normal</option>
                                        <option value="flex-start">Start</option>
                                        <option value="center">Center</option>
                                        <option value="flex-end">End</option>
                                        <option value="stretch">Stretch</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-xs">Gap</label>
                                    <input
                                        type="text"
                                        className="form-input text-sm"
                                        value={customStyles['gap'] || ''}
                                        onChange={(e) => handleCustomStyleChange('gap', e.target.value)}
                                        placeholder="ej: 1rem, 16px"
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* SPACING */}
                {activeTab === 'spacing' && (
                    <>
                        <h4 className="heading-6 mb-sm">Clases de Padding</h4>
                        {renderClassButtons('padding')}

                        <h4 className="heading-6 mb-sm mt-md">Padding Personalizado</h4>
                        <div className="spacing-grid">
                            <div className="form-group">
                                <label className="form-label text-xs">Top</label>
                                <input
                                    type="text"
                                    className="form-input text-sm"
                                    value={customStyles['padding-top'] || ''}
                                    onChange={(e) => handleCustomStyleChange('padding-top', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-xs">Right</label>
                                <input
                                    type="text"
                                    className="form-input text-sm"
                                    value={customStyles['padding-right'] || ''}
                                    onChange={(e) => handleCustomStyleChange('padding-right', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-xs">Bottom</label>
                                <input
                                    type="text"
                                    className="form-input text-sm"
                                    value={customStyles['padding-bottom'] || ''}
                                    onChange={(e) => handleCustomStyleChange('padding-bottom', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-xs">Left</label>
                                <input
                                    type="text"
                                    className="form-input text-sm"
                                    value={customStyles['padding-left'] || ''}
                                    onChange={(e) => handleCustomStyleChange('padding-left', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <h4 className="heading-6 mb-sm mt-lg">Clases de Margin</h4>
                        {renderClassButtons('margin')}

                        <h4 className="heading-6 mb-sm mt-md">Margin Personalizado</h4>
                        <div className="spacing-grid">
                            <div className="form-group">
                                <label className="form-label text-xs">Top</label>
                                <input
                                    type="text"
                                    className="form-input text-sm"
                                    value={customStyles['margin-top'] || ''}
                                    onChange={(e) => handleCustomStyleChange('margin-top', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-xs">Right</label>
                                <input
                                    type="text"
                                    className="form-input text-sm"
                                    value={customStyles['margin-right'] || ''}
                                    onChange={(e) => handleCustomStyleChange('margin-right', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-xs">Bottom</label>
                                <input
                                    type="text"
                                    className="form-input text-sm"
                                    value={customStyles['margin-bottom'] || ''}
                                    onChange={(e) => handleCustomStyleChange('margin-bottom', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-xs">Left</label>
                                <input
                                    type="text"
                                    className="form-input text-sm"
                                    value={customStyles['margin-left'] || ''}
                                    onChange={(e) => handleCustomStyleChange('margin-left', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* SIZE */}
                {activeTab === 'size' && (
                    <>
                        <h4 className="heading-6 mb-sm">Ancho (Width)</h4>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['width'] || ''}
                                onChange={(e) => handleCustomStyleChange('width', e.target.value)}
                                placeholder="ej: 100%, 500px, auto"
                            />
                        </div>

                        <h4 className="heading-6 mb-sm mt-md">Alto (Height)</h4>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['height'] || ''}
                                onChange={(e) => handleCustomStyleChange('height', e.target.value)}
                                placeholder="ej: 100%, 300px, auto"
                            />
                        </div>

                        <h4 className="heading-6 mb-sm mt-md">Min/Max Width</h4>
                        <div className="form-group">
                            <label className="form-label text-xs">Min Width</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['min-width'] || ''}
                                onChange={(e) => handleCustomStyleChange('min-width', e.target.value)}
                                placeholder="ej: 200px"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-xs">Max Width</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['max-width'] || ''}
                                onChange={(e) => handleCustomStyleChange('max-width', e.target.value)}
                                placeholder="ej: 1200px"
                            />
                        </div>

                        <h4 className="heading-6 mb-sm mt-md">Min/Max Height</h4>
                        <div className="form-group">
                            <label className="form-label text-xs">Min Height</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['min-height'] || ''}
                                onChange={(e) => handleCustomStyleChange('min-height', e.target.value)}
                                placeholder="ej: 100px"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-xs">Max Height</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['max-height'] || ''}
                                onChange={(e) => handleCustomStyleChange('max-height', e.target.value)}
                                placeholder="ej: 500px"
                            />
                        </div>
                    </>
                )}

                {/* TYPOGRAPHY */}
                {activeTab === 'typography' && (
                    <>
                        <h4 className="heading-6 mb-sm">Clases de Títulos</h4>
                        {renderClassButtons('headings')}

                        <h4 className="heading-6 mb-sm mt-md">Clases de Texto</h4>
                        {renderClassButtons('text')}

                        <h4 className="heading-6 mb-sm mt-md">Alineación</h4>
                        {renderClassButtons('alignment')}

                        <h4 className="heading-6 mb-sm mt-md">Tipografía Personalizada</h4>
                        <div className="form-group">
                            <label className="form-label text-xs">Tamaño de Fuente</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['font-size'] || ''}
                                onChange={(e) => handleCustomStyleChange('font-size', e.target.value)}
                                placeholder="ej: 2rem, 24px"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label text-xs">Peso de Fuente</label>
                            <select
                                className="form-input text-sm"
                                value={customStyles['font-weight'] || ''}
                                onChange={(e) => handleCustomStyleChange('font-weight', e.target.value)}
                            >
                                <option value="">Normal</option>
                                <option value="300">Light (300)</option>
                                <option value="400">Regular (400)</option>
                                <option value="500">Medium (500)</option>
                                <option value="600">Semibold (600)</option>
                                <option value="700">Bold (700)</option>
                                <option value="800">Extra Bold (800)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label text-xs">Altura de Línea</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['line-height'] || ''}
                                onChange={(e) => handleCustomStyleChange('line-height', e.target.value)}
                                placeholder="ej: 1.5, 24px"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label text-xs">Espaciado de Letras</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['letter-spacing'] || ''}
                                onChange={(e) => handleCustomStyleChange('letter-spacing', e.target.value)}
                                placeholder="ej: 0.05em, 1px"
                            />
                        </div>
                    </>
                )}

                {/* COLORS */}
                {activeTab === 'colors' && (
                    <>
                        <h4 className="heading-6 mb-sm">Clases de Color de Texto</h4>
                        {renderClassButtons('textColors')}

                        <h4 className="heading-6 mb-sm mt-md">Color de Texto Personalizado</h4>
                        <div className="form-group">
                            <div className="flex gap-xs">
                                <input
                                    type="color"
                                    value={customStyles['color'] || '#000000'}
                                    onChange={(e) => handleCustomStyleChange('color', e.target.value)}
                                    className="color-input"
                                />
                                <input
                                    type="text"
                                    className="form-input text-sm flex-1"
                                    value={customStyles['color'] || ''}
                                    onChange={(e) => handleCustomStyleChange('color', e.target.value)}
                                    placeholder="#000000"
                                />
                            </div>
                        </div>

                        <h4 className="heading-6 mb-sm mt-md">Clases de Color de Fondo</h4>
                        {renderClassButtons('bgColors')}

                        <h4 className="heading-6 mb-sm mt-md">Color de Fondo Personalizado</h4>
                        <div className="form-group">
                            <div className="flex gap-xs">
                                <input
                                    type="color"
                                    value={customStyles['background-color'] || '#ffffff'}
                                    onChange={(e) => handleCustomStyleChange('background-color', e.target.value)}
                                    className="color-input"
                                />
                                <input
                                    type="text"
                                    className="form-input text-sm flex-1"
                                    value={customStyles['background-color'] || ''}
                                    onChange={(e) => handleCustomStyleChange('background-color', e.target.value)}
                                    placeholder="#ffffff"
                                />
                            </div>
                        </div>

                        {selectedElement.element === 'button' && (
                            <>
                                <h4 className="heading-6 mb-sm mt-md">Estilos de Botón</h4>
                                {renderClassButtons('buttons')}
                            </>
                        )}

                        {selectedElement.element === 'section' && (
                            <>
                                <h4 className="heading-6 mb-sm mt-md">Estilos de Sección</h4>
                                {renderClassButtons('sections')}
                            </>
                        )}
                    </>
                )}

                {/* ADVANCED */}
                {activeTab === 'advanced' && (
                    <>
                        <h4 className="heading-6 mb-sm">Bordes</h4>
                        <div className="form-group">
                            <label className="form-label text-xs">Border</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['border'] || ''}
                                onChange={(e) => handleCustomStyleChange('border', e.target.value)}
                                placeholder="ej: 1px solid #000"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-xs">Border Radius</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['border-radius'] || ''}
                                onChange={(e) => handleCustomStyleChange('border-radius', e.target.value)}
                                placeholder="ej: 0.5rem, 8px"
                            />
                        </div>

                        <h4 className="heading-6 mb-sm mt-md">Sombras</h4>
                        <div className="form-group">
                            <label className="form-label text-xs">Box Shadow</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['box-shadow'] || ''}
                                onChange={(e) => handleCustomStyleChange('box-shadow', e.target.value)}
                                placeholder="ej: 0 4px 6px rgba(0,0,0,0.1)"
                            />
                        </div>

                        <h4 className="heading-6 mb-sm mt-md">Opacidad</h4>
                        <div className="form-group">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={customStyles['opacity'] || '1'}
                                onChange={(e) => handleCustomStyleChange('opacity', e.target.value)}
                                className="w-full"
                            />
                            <span className="text-xs text-secondary">{customStyles['opacity'] || '1'}</span>
                        </div>

                        <h4 className="heading-6 mb-sm mt-md">Transformaciones</h4>
                        <div className="form-group">
                            <label className="form-label text-xs">Transform</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['transform'] || ''}
                                onChange={(e) => handleCustomStyleChange('transform', e.target.value)}
                                placeholder="ej: rotate(45deg), scale(1.1)"
                            />
                        </div>

                        <h4 className="heading-6 mb-sm mt-md">Transiciones</h4>
                        <div className="form-group">
                            <label className="form-label text-xs">Transition</label>
                            <input
                                type="text"
                                className="form-input text-sm"
                                value={customStyles['transition'] || ''}
                                onChange={(e) => handleCustomStyleChange('transition', e.target.value)}
                                placeholder="ej: all 0.3s ease"
                            />
                        </div>

                        <h4 className="heading-6 mb-sm mt-md">Posicionamiento</h4>
                        <div className="form-group">
                            <label className="form-label text-xs">Position</label>
                            <select
                                className="form-input text-sm"
                                value={customStyles['position'] || ''}
                                onChange={(e) => handleCustomStyleChange('position', e.target.value)}
                            >
                                <option value="">Static</option>
                                <option value="relative">Relative</option>
                                <option value="absolute">Absolute</option>
                                <option value="fixed">Fixed</option>
                                <option value="sticky">Sticky</option>
                            </select>
                        </div>

                        {customStyles['position'] && customStyles['position'] !== 'static' && (
                            <div className="spacing-grid">
                                <div className="form-group">
                                    <label className="form-label text-xs">Top</label>
                                    <input
                                        type="text"
                                        className="form-input text-sm"
                                        value={customStyles['top'] || ''}
                                        onChange={(e) => handleCustomStyleChange('top', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-xs">Right</label>
                                    <input
                                        type="text"
                                        className="form-input text-sm"
                                        value={customStyles['right'] || ''}
                                        onChange={(e) => handleCustomStyleChange('right', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-xs">Bottom</label>
                                    <input
                                        type="text"
                                        className="form-input text-sm"
                                        value={customStyles['bottom'] || ''}
                                        onChange={(e) => handleCustomStyleChange('bottom', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-xs">Left</label>
                                    <input
                                        type="text"
                                        className="form-input text-sm"
                                        value={customStyles['left'] || ''}
                                        onChange={(e) => handleCustomStyleChange('left', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        )}

                        <h4 className="heading-6 mb-sm mt-md">Z-Index</h4>
                        <div className="form-group">
                            <input
                                type="number"
                                className="form-input text-sm"
                                value={customStyles['z-index'] || ''}
                                onChange={(e) => handleCustomStyleChange('z-index', e.target.value)}
                                placeholder="0"
                            />
                        </div>

                        <h4 className="heading-6 mb-sm mt-md">Overflow</h4>
                        <div className="form-group">
                            <select
                                className="form-input text-sm"
                                value={customStyles['overflow'] || ''}
                                onChange={(e) => handleCustomStyleChange('overflow', e.target.value)}
                            >
                                <option value="">Visible</option>
                                <option value="hidden">Hidden</option>
                                <option value="scroll">Scroll</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>
                    </>
                )}

                {/* Clases actuales */}
                <div className="divider my-lg"></div>
                <h4 className="heading-6 mb-sm">Clases Aplicadas</h4>
                <div className="current-classes">
                    {currentClasses.length > 0 ? (
                        currentClasses.map((cls, index) => (
                            <span key={index} className="class-tag">
                                {cls}
                                <button
                                    className="class-tag-remove"
                                    onClick={() => toggleClassHandler(cls)}
                                    title="Remover"
                                >
                                    ×
                                </button>
                            </span>
                        ))
                    ) : (
                        <p className="text-xs text-secondary">Sin clases</p>
                    )}
                </div>

                {/* Input manual */}
                <div className="form-group mt-md">
                    <label className="form-label text-xs">Clases CSS (manual)</label>
                    <input
                        type="text"
                        className="form-input font-mono text-sm"
                        value={selectedElement.class || ''}
                        onChange={(e) => onUpdateStyle(selectedElement.id, 'class', e.target.value)}
                        placeholder="ej: container flex-center p-lg"
                    />
                </div>
            </div>
        </div>
    );
}
