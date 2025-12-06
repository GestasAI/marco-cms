import './BlockInspector.css';

/**
 * BlockInspector - Panel de propiedades del bloque seleccionado
 * Permite editar configuraciones avanzadas
 */
export default function BlockInspector({ block, onUpdate }) {
    if (!block) return null;

    return (
        <div className="block-inspector">
            <div className="inspector-header">
                <h3>Propiedades del Bloque</h3>
                <span className="block-type-badge">{block.type}</span>
            </div>

            <div className="inspector-content">
                {/* Settings comunes */}
                <div className="inspector-section">
                    <h4>General</h4>

                    <div className="inspector-field">
                        <label>ID del Bloque</label>
                        <input
                            type="text"
                            value={block.settings?.id || ''}
                            onChange={(e) =>
                                onUpdate({
                                    settings: { ...block.settings, id: e.target.value }
                                })
                            }
                            placeholder="mi-bloque"
                        />
                    </div>

                    <div className="inspector-field">
                        <label>Clase CSS</label>
                        <input
                            type="text"
                            value={block.settings?.className || ''}
                            onChange={(e) =>
                                onUpdate({
                                    settings: { ...block.settings, className: e.target.value }
                                })
                            }
                            placeholder="mi-clase"
                        />
                    </div>
                </div>

                {/* Settings específicos por tipo */}
                {block.type === 'heading' && (
                    <HeadingSettings block={block} onUpdate={onUpdate} />
                )}
                {block.type === 'image' && (
                    <ImageSettings block={block} onUpdate={onUpdate} />
                )}
                {block.type === 'button' && (
                    <ButtonSettings block={block} onUpdate={onUpdate} />
                )}

                {/* Espaciado */}
                <div className="inspector-section">
                    <h4>Espaciado</h4>

                    <div className="inspector-field">
                        <label>Margen Superior</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={block.settings?.marginTop || 0}
                            onChange={(e) =>
                                onUpdate({
                                    settings: {
                                        ...block.settings,
                                        marginTop: parseInt(e.target.value)
                                    }
                                })
                            }
                        />
                        <span>{block.settings?.marginTop || 0}px</span>
                    </div>

                    <div className="inspector-field">
                        <label>Margen Inferior</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={block.settings?.marginBottom || 0}
                            onChange={(e) =>
                                onUpdate({
                                    settings: {
                                        ...block.settings,
                                        marginBottom: parseInt(e.target.value)
                                    }
                                })
                            }
                        />
                        <span>{block.settings?.marginBottom || 0}px</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HeadingSettings({ block, onUpdate }) {
    return (
        <div className="inspector-section">
            <h4>Configuración de Título</h4>

            <div className="inspector-field">
                <label>Nivel</label>
                <select
                    value={block.settings?.level || 2}
                    onChange={(e) =>
                        onUpdate({
                            settings: { ...block.settings, level: parseInt(e.target.value) }
                        })
                    }
                >
                    {[1, 2, 3, 4, 5, 6].map((level) => (
                        <option key={level} value={level}>
                            H{level}
                        </option>
                    ))}
                </select>
            </div>

            <div className="inspector-field">
                <label>Alineación</label>
                <div className="button-group">
                    {['left', 'center', 'right'].map((align) => (
                        <button
                            key={align}
                            className={`btn-group-item ${block.settings?.align === align ? 'active' : ''
                                }`}
                            onClick={() =>
                                onUpdate({
                                    settings: { ...block.settings, align }
                                })
                            }
                        >
                            {align}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ImageSettings({ block, onUpdate }) {
    return (
        <div className="inspector-section">
            <h4>Configuración de Imagen</h4>

            <div className="inspector-field">
                <label>URL</label>
                <input
                    type="text"
                    value={block.settings?.src || ''}
                    onChange={(e) =>
                        onUpdate({
                            settings: { ...block.settings, src: e.target.value }
                        })
                    }
                    placeholder="https://..."
                />
            </div>

            <div className="inspector-field">
                <label>Texto Alternativo (Alt)</label>
                <input
                    type="text"
                    value={block.settings?.alt || ''}
                    onChange={(e) =>
                        onUpdate({
                            settings: { ...block.settings, alt: e.target.value }
                        })
                    }
                    placeholder="Descripción de la imagen"
                />
            </div>

            <div className="inspector-field">
                <label>Ancho</label>
                <select
                    value={block.settings?.width || 'full'}
                    onChange={(e) =>
                        onUpdate({
                            settings: { ...block.settings, width: e.target.value }
                        })
                    }
                >
                    <option value="full">Ancho completo</option>
                    <option value="large">Grande</option>
                    <option value="medium">Mediano</option>
                    <option value="small">Pequeño</option>
                </select>
            </div>
        </div>
    );
}

function ButtonSettings({ block, onUpdate }) {
    return (
        <div className="inspector-section">
            <h4>Configuración de Botón</h4>

            <div className="inspector-field">
                <label>Estilo</label>
                <select
                    value={block.settings?.style || 'primary'}
                    onChange={(e) =>
                        onUpdate({
                            settings: { ...block.settings, style: e.target.value }
                        })
                    }
                >
                    <option value="primary">Primario</option>
                    <option value="secondary">Secundario</option>
                    <option value="outline">Contorno</option>
                </select>
            </div>

            <div className="inspector-field">
                <label>Tamaño</label>
                <select
                    value={block.settings?.size || 'medium'}
                    onChange={(e) =>
                        onUpdate({
                            settings: { ...block.settings, size: e.target.value }
                        })
                    }
                >
                    <option value="small">Pequeño</option>
                    <option value="medium">Mediano</option>
                    <option value="large">Grande</option>
                </select>
            </div>

            <div className="inspector-field">
                <label>
                    <input
                        type="checkbox"
                        checked={block.settings?.openNewTab || false}
                        onChange={(e) =>
                            onUpdate({
                                settings: {
                                    ...block.settings,
                                    openNewTab: e.target.checked
                                }
                            })
                        }
                    />
                    Abrir en nueva pestaña
                </label>
            </div>
        </div>
    );
}
