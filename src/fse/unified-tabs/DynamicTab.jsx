import React from 'react';
import { Database, Zap } from 'lucide-react';

export function DynamicTab({ selectedElement, onUpdate }) {
    const dynamic = selectedElement.dynamic || { enabled: false, source: '', field: '' };

    const sources = [
        { id: 'post_title', label: 'Título de la Publicación', types: ['heading', 'text'] },
        { id: 'post_excerpt', label: 'Extracto de la Publicación', types: ['text'] },
        { id: 'post_content', label: 'Contenido de la Publicación', types: ['text', 'html'] },
        { id: 'post_date', label: 'Fecha de Publicación', types: ['text'] },
        { id: 'post_author', label: 'Autor de la Publicación', types: ['text'] },
        { id: 'featured_image', label: 'Imagen Destacada', types: ['image'] },
        { id: 'author_avatar', label: 'Avatar del Autor', types: ['image'] },
        { id: 'custom_field', label: 'Campo Personalizado', types: ['heading', 'text', 'image', 'button', 'link', 'html', 'code'] },
    ];

    const filteredSources = sources.filter(s => s.types.includes(selectedElement.element));

    const handleToggle = (enabled) => {
        onUpdate(selectedElement.id, 'dynamic', { ...dynamic, enabled });
    };

    const handleSourceChange = (source) => {
        onUpdate(selectedElement.id, 'dynamic', { ...dynamic, source });
    };

    const handleFieldChange = (field) => {
        onUpdate(selectedElement.id, 'dynamic', { ...dynamic, field });
    };

    return (
        <div className="tab-content dynamic-tab">
            <div className="tab-section">
                <div className="flex items-center gap-sm mb-md">
                    <Database size={18} className="text-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">Contenido Dinámico</h4>
                </div>

                <div className="dynamic-control-card">
                    <div className="flex items-center justify-between mb-lg">
                        <span className="text-xs font-medium text-gray-600">Habilitar mapeo de datos</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={dynamic.enabled}
                                onChange={(e) => handleToggle(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    {dynamic.enabled && (
                        <div className="dynamic-settings animate-fadeIn">
                            <div className="control-group mb-md">
                                <label className="control-label">Origen de Datos</label>
                                <select
                                    className="control-select"
                                    value={dynamic.source}
                                    onChange={(e) => handleSourceChange(e.target.value)}
                                >
                                    <option value="">Seleccionar origen...</option>
                                    {filteredSources.map(s => (
                                        <option key={s.id} value={s.id}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            {dynamic.source === 'custom_field' && (
                                <div className="control-group mb-md">
                                    <label className="control-label">Nombre del Campo (Meta Key)</label>
                                    <input
                                        type="text"
                                        className="control-input"
                                        placeholder="ej. precio_producto"
                                        value={dynamic.field}
                                        onChange={(e) => handleFieldChange(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="dynamic-info-box">
                                <Zap size={14} />
                                <span>Este elemento mostrará datos reales al visualizar la página.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
