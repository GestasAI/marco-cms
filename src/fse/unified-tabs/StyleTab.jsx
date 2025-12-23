import React from 'react';
import { cssClasses, parseClasses, addClass, removeClass } from '../cssClasses';
import { ColorControl } from '../style-controls/ColorControl';
import { GradientControl } from '../style-controls/GradientControl';
import { TypographyControl } from '../style-controls/TypographyControl';
import { BorderControl } from '../style-controls/BorderControl';
import { ShadowControl } from '../style-controls/ShadowControl';

/**
 * Pestaña Style - Diseño Visual Avanzado
 * Modularizado para manejar Colores, Degradados, Tipografía, Bordes y Sombras
 */
export function StyleTab({
    selectedElement,
    onUpdateStyle,
    onUpdateCustomStyle,
    onDelete,
    onMoveUp,
    onMoveDown,
    onDuplicate
}) {
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

    const isTextElement = ['heading', 'text', 'button', 'link', 'nav', 'logo'].includes(selectedElement.element);
    const isContainer = ['container', 'section', 'grid', 'card', 'nav'].includes(selectedElement.element);
    const canHaveTextColor = isTextElement || isContainer;

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

            {/* 1. LAYOUT & DISPLAY */}
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

            {/* Flexbox Options (Solo si display es flex) */}
            {customStyles['display'] === 'flex' && (
                <div style={{ paddingLeft: '8px', borderLeft: '2px solid #96c8a2', marginBottom: '10px' }}>
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
                        <label className="form-label-compact">Alinear</label>
                        <select
                            className="form-input-compact"
                            value={customStyles['alignItems'] || ''}
                            onChange={(e) => handleCustomStyleChange('alignItems', e.target.value)}
                        >
                            <option value="">Default</option>
                            <option value="flex-start">Inicio</option>
                            <option value="center">Centro</option>
                            <option value="flex-end">Fin</option>
                            <option value="stretch">Estirar</option>
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

            {/* Grid Options (Solo si display es grid) */}
            {customStyles['display'] === 'grid' && (
                <div style={{ paddingLeft: '8px', borderLeft: '2px solid #96c8a2', marginBottom: '10px' }}>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Columnas</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            value={customStyles['gridTemplateColumns'] || ''}
                            onChange={(e) => handleCustomStyleChange('gridTemplateColumns', e.target.value)}
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

            <div className="form-row-compact">
                <div className="form-group-compact half">
                    <label className="form-label-compact">Opacidad</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={customStyles['opacity'] || '1'}
                        onChange={(e) => handleCustomStyleChange('opacity', e.target.value)}
                    />
                </div>
                <div className="form-group-compact half">
                    <label className="form-label-compact">Z-Index</label>
                    <input
                        type="number"
                        className="form-input-compact"
                        value={customStyles['zIndex'] || ''}
                        onChange={(e) => handleCustomStyleChange('zIndex', e.target.value)}
                    />
                </div>
            </div>

            <div className="divider-compact"></div>

            {/* 2. SECCIÓN DE TEXTO (Condicional) */}
            {isTextElement && (
                <>
                    <div className="divider-compact"></div>
                    <div className="section-header-compact">Configuración de Texto</div>

                    {/* Selector de Etiqueta (Tag Selector) */}
                    {(selectedElement.element === 'heading' || selectedElement.element === 'text') && (
                        <div className="form-group-compact">
                            <label className="form-label-compact">Tipo de Elemento (Tag)</label>
                            <select
                                className="form-input-compact"
                                value={selectedElement.tag || (selectedElement.element === 'heading' ? 'h2' : 'p')}
                                onChange={(e) => {
                                    const newTag = e.target.value;
                                    if (selectedElement.element === 'heading') {
                                        // Si es un heading, sincronizamos la clase heading-X con el tag hX
                                        const newClass = selectedElement.class.replace(/heading-[1-6]/, `heading-${newTag.charAt(1)}`);
                                        onUpdateMultiple(selectedElement.id, {
                                            tag: newTag,
                                            class: newClass
                                        });
                                    } else {
                                        onUpdateStyle(selectedElement.id, 'tag', newTag);
                                    }
                                }}
                            >
                                {selectedElement.element === 'heading' ? [
                                    <option key="h1" value="h1">Título 1 (H1)</option>,
                                    <option key="h2" value="h2">Título 2 (H2)</option>,
                                    <option key="h3" value="h3">Título 3 (H3)</option>,
                                    <option key="h4" value="h4">Título 4 (H4)</option>,
                                    <option key="h5" value="h5">Título 5 (H5)</option>,
                                    <option key="h6" value="h6">Título 6 (H6)</option>
                                ] : [
                                    <option key="p" value="p">Párrafo (P)</option>,
                                    <option key="span" value="span">Texto en línea (Span)</option>,
                                    <option key="div" value="div">Bloque de texto (Div)</option>,
                                    <option key="small" value="small">Texto pequeño (Small)</option>
                                ]}
                            </select>
                        </div>
                    )}

                    {canHaveTextColor && (
                        <ColorControl
                            label="Color de Texto"
                            value={customStyles['color'] || ''}
                            onChange={(val) => handleCustomStyleChange('color', val)}
                        />
                    )}

                    <div className="mt-sm">
                        <TypographyControl
                            styles={customStyles}
                            onChange={handleCustomStyleChange}
                        />
                    </div>
                </>
            )}

            <div className="divider-compact"></div>

            {/* 3. COLORES Y FONDO */}
            <div className="section-header-compact">Fondo y Superficie</div>

            <ColorControl
                label="Color de Fondo (Sólido)"
                value={customStyles['backgroundColor'] || ''}
                onChange={(val) => {
                    // Si se establece un color de fondo, forzamos backgroundImage a 'none' 
                    // para que los degradados del tema no lo tapen.
                    if (val) {
                        handleCustomStyleChange('backgroundImage', 'none');
                    } else {
                        // Si se limpia el color, permitimos que el tema vuelva a mostrar su fondo
                        handleCustomStyleChange('backgroundImage', '');
                    }
                    handleCustomStyleChange('backgroundColor', val);
                }}
            />

            <div className="mt-sm">
                <label className="form-label-compact">Degradado (Gradient)</label>
                <GradientControl
                    value={customStyles['backgroundImage']}
                    onChange={(val) => {
                        // Si se establece un degradado, limpiar el color de fondo sólido
                        if (val && customStyles['backgroundColor']) {
                            handleCustomStyleChange('backgroundColor', '');
                        }
                        handleCustomStyleChange('backgroundImage', val);
                    }}
                />
            </div>

            <div className="divider-compact"></div>

            {/* 4. BORDES */}
            <div className="section-header-compact">Bordes y Radio</div>
            <BorderControl
                styles={customStyles}
                onChange={handleCustomStyleChange}
            />

            <div className="divider-compact"></div>

            {/* 5. SOMBRAS */}
            <div className="section-header-compact">Sombra de Caja (Box Shadow)</div>
            <ShadowControl
                value={customStyles['boxShadow']}
                onChange={(val) => handleCustomStyleChange('boxShadow', val)}
            />

            <div className="divider-compact"></div>

            {/* 6. CLASES DEL TEMA */}
            <div className="section-header-compact">Estilos Rápidos (Tema)</div>
            <div className="form-label-compact">Colores de Texto</div>
            {renderClassButtons('textColors')}
            <div className="mt-sm">
                <div className="form-label-compact">Colores de Fondo</div>
                {renderClassButtons('bgColors')}
            </div>
            <div className="mt-sm">
                <div className="form-label-compact">Espaciado (Padding)</div>
                {renderClassButtons('padding')}
            </div>
            <div className="mt-sm">
                <div className="form-label-compact">Margen (Margin)</div>
                {renderClassButtons('margin')}
            </div>

            <div className="divider-compact"></div>

            {/* 7. AVANZADO (ID y Clases) */}
            <div className="section-header-compact">Avanzado</div>
            <div className="form-group-compact">
                <label className="form-label-compact">ID del Elemento</label>
                <input
                    type="text"
                    className="form-input-compact font-mono"
                    value={selectedElement.id || ''}
                    onChange={(e) => onUpdateStyle(selectedElement.id, 'id', e.target.value)}
                    placeholder="ej: mi-titulo-principal"
                />
            </div>
            <div className="form-group-compact">
                <label className="form-label-compact">Clases CSS</label>
                <input
                    type="text"
                    className="form-input-compact font-mono"
                    value={selectedElement.class || ''}
                    onChange={(e) => onUpdateStyle(selectedElement.id, 'class', e.target.value)}
                    placeholder="ej: mt-10 shadow-lg"
                />
            </div>
        </div>
    );
}
