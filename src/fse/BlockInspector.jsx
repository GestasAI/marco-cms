import React, { useState } from 'react';

export default function BlockInspector({ block, onUpdate }) {
    if (!block) {
        return (
            <div className="text-secondary text-sm p-md">
                <p>Selecciona un bloque para ver sus propiedades</p>
            </div>
        );
    }

    const [localBlock, setLocalBlock] = useState(block);

    const handleChange = (field, value) => {
        const updated = { ...localBlock, [field]: value };
        setLocalBlock(updated);
        if (onUpdate) onUpdate(updated);
    };

    const handleStyleChange = (property, value) => {
        const newStyles = { ...localBlock.customStyles, [property]: value };
        const updated = { ...localBlock, customStyles: newStyles };
        setLocalBlock(updated);
        if (onUpdate) onUpdate(updated);
    };

    // Propiedades específicas por tipo de bloque
    const renderContentProperties = () => {
        const type = block.type;

        // HEADING
        if (type === 'core/heading') {
            return (
                <>
                    <div className="form-group">
                        <label className="form-label">Texto del Título</label>
                        <input
                            type="text"
                            className="form-input"
                            value={localBlock.content || ''}
                            onChange={(e) => handleChange('content', e.target.value)}
                            placeholder="Escribe el título..."
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nivel (H1-H6)</label>
                        <select
                            className="form-input"
                            value={localBlock.level || 2}
                            onChange={(e) => handleChange('level', parseInt(e.target.value))}
                        >
                            <option value="1">H1 - Título Principal</option>
                            <option value="2">H2 - Subtítulo</option>
                            <option value="3">H3 - Sección</option>
                            <option value="4">H4 - Subsección</option>
                            <option value="5">H5 - Detalle</option>
                            <option value="6">H6 - Mínimo</option>
                        </select>
                    </div>
                </>
            );
        }

        // PARAGRAPH
        if (type === 'core/paragraph') {
            return (
                <div className="form-group">
                    <label className="form-label">Texto del Párrafo</label>
                    <textarea
                        className="form-input"
                        rows="4"
                        value={localBlock.content || ''}
                        onChange={(e) => handleChange('content', e.target.value)}
                        placeholder="Escribe el contenido..."
                    />
                </div>
            );
        }

        // BUTTON
        if (type === 'core/button') {
            return (
                <>
                    <div className="form-group">
                        <label className="form-label">Texto del Botón</label>
                        <input
                            type="text"
                            className="form-input"
                            value={localBlock.text || ''}
                            onChange={(e) => handleChange('text', e.target.value)}
                            placeholder="Click aquí"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Enlace (URL)</label>
                        <input
                            type="text"
                            className="form-input font-mono text-sm"
                            value={localBlock.link || ''}
                            onChange={(e) => handleChange('link', e.target.value)}
                            placeholder="https://ejemplo.com"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Abrir en</label>
                        <select
                            className="form-input"
                            value={localBlock.target || '_self'}
                            onChange={(e) => handleChange('target', e.target.value)}
                        >
                            <option value="_self">Misma pestaña</option>
                            <option value="_blank">Nueva pestaña</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label flex items-center gap-sm">
                            <input
                                type="checkbox"
                                checked={localBlock.nofollow || false}
                                onChange={(e) => handleChange('nofollow', e.target.checked)}
                            />
                            <span>Añadir rel="nofollow"</span>
                        </label>
                    </div>
                </>
            );
        }

        // SEARCH
        if (type === 'core/search') {
            return (
                <div className="form-group">
                    <label className="form-label">Placeholder</label>
                    <input
                        type="text"
                        className="form-input"
                        value={localBlock.placeholder || ''}
                        onChange={(e) => handleChange('placeholder', e.target.value)}
                        placeholder="Buscar..."
                    />
                </div>
            );
        }

        // SITE TITLE
        if (type === 'core/site-title') {
            return (
                <div className="form-group">
                    <label className="form-label">Etiqueta HTML</label>
                    <select
                        className="form-input"
                        value={localBlock.tag || 'h1'}
                        onChange={(e) => handleChange('tag', e.target.value)}
                    >
                        <option value="h1">H1</option>
                        <option value="h2">H2</option>
                        <option value="p">Párrafo</option>
                        <option value="div">Div</option>
                    </select>
                </div>
            );
        }

        return null;
    };

    const styleProperties = [
        { name: 'margin', label: 'Margen', type: 'text', placeholder: '0' },
        { name: 'marginTop', label: 'Margen Superior', type: 'text', placeholder: '0' },
        { name: 'marginBottom', label: 'Margen Inferior', type: 'text', placeholder: '0' },
        { name: 'padding', label: 'Relleno', type: 'text', placeholder: '0' },
        { name: 'paddingTop', label: 'Relleno Superior', type: 'text', placeholder: '0' },
        { name: 'paddingBottom', label: 'Relleno Inferior', type: 'text', placeholder: '0' },
        { name: 'width', label: 'Ancho', type: 'text', placeholder: 'auto' },
        { name: 'height', label: 'Alto', type: 'text', placeholder: 'auto' },
        { name: 'backgroundColor', label: 'Color de Fondo', type: 'color' },
        { name: 'color', label: 'Color de Texto', type: 'color' },
        { name: 'fontSize', label: 'Tamaño de Fuente', type: 'text', placeholder: 'inherit' },
        { name: 'fontWeight', label: 'Peso de Fuente', type: 'select', options: ['normal', 'bold', '300', '400', '500', '600', '700', '800'] },
        { name: 'textAlign', label: 'Alineación', type: 'select', options: ['left', 'center', 'right', 'justify'] },
        { name: 'borderRadius', label: 'Radio de Borde', type: 'text', placeholder: '0' },
        { name: 'border', label: 'Borde', type: 'text', placeholder: 'none' }
    ];

    return (
        <div>
            <div className="mb-lg">
                <h4 className="heading-5 mb-sm">Tipo de Bloque</h4>
                <p className="text-xs text-gray-500 font-mono">{block.type}</p>
            </div>

            {/* PROPIEDADES DE CONTENIDO */}
            {renderContentProperties() && (
                <>
                    <div className="divider my-lg"></div>
                    <h4 className="heading-5 mb-md">📝 Contenido</h4>
                    {renderContentProperties()}
                </>
            )}

            {/* CLASE CSS */}
            <div className="divider my-lg"></div>
            <div className="mb-lg">
                <h4 className="heading-5 mb-sm">Clase CSS</h4>
                <input
                    type="text"
                    className="form-input font-mono text-xs"
                    value={localBlock.className || ''}
                    onChange={(e) => handleChange('className', e.target.value)}
                    placeholder="mi-clase-personalizada"
                />
            </div>

            {/* PROPIEDADES CSS */}
            <div className="divider my-lg"></div>
            <h4 className="heading-5 mb-md">🎨 Estilos CSS</h4>
            <p className="text-xs text-secondary mb-md">
                Los cambios se guardarán como estilos personalizados
            </p>

            <div className="space-y-sm">
                {styleProperties.map((prop) => (
                    <div key={prop.name} className="form-group">
                        <label className="form-label text-xs">{prop.label}</label>
                        {prop.type === 'select' ? (
                            <select
                                className="form-input text-sm"
                                value={localBlock.customStyles?.[prop.name] || ''}
                                onChange={(e) => handleStyleChange(prop.name, e.target.value)}
                            >
                                <option value="">Por defecto</option>
                                {prop.options.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={prop.type}
                                className="form-input text-sm"
                                value={localBlock.customStyles?.[prop.name] || ''}
                                onChange={(e) => handleStyleChange(prop.name, e.target.value)}
                                placeholder={prop.placeholder}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-lg p-sm bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                💡 Los estilos personalizados se guardarán al final del archivo theme.css
            </div>
        </div>
    );
}
