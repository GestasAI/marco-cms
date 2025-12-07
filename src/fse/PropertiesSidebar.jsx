import React, { useState, useEffect } from 'react';
import { Trash2, ArrowUp, ArrowDown, Copy, Upload, Image as ImageIcon } from 'lucide-react';
import { mediaManager } from '../utils/mediaManager';

export function PropertiesSidebar({ selectedElement, onUpdate, onDelete, onMoveUp, onMoveDown, onDuplicate }) {
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [mediaLibrary, setMediaLibrary] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Cargar biblioteca de medios
    useEffect(() => {
        loadMediaLibrary();
    }, []);

    const loadMediaLibrary = async () => {
        const library = await mediaManager.getMediaLibrary();
        setMediaLibrary(library);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await mediaManager.uploadImage(file);
            if (result.success) {
                // Actualizar elemento con la URL del medio
                const mediaUrl = mediaManager.getMediaUrl(result.media);
                onUpdate(selectedElement.id, 'src', mediaUrl);
                onUpdate(selectedElement.id, 'mediaId', result.media.id);

                // Recargar biblioteca
                await loadMediaLibrary();

                alert('✅ Imagen subida exitosamente');
            } else {
                alert('❌ Error al subir imagen: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al subir imagen');
        } finally {
            setUploading(false);
        }
    };

    if (!selectedElement) {
        return (
            <div className="editor-sidebar">
                <div className="editor-sidebar-header">Configuración</div>
                <div className="editor-sidebar-content">
                    <p className="text-secondary text-sm">Selecciona un elemento para editarlo</p>
                </div>
            </div>
        );
    }

    return (
        <div className="editor-sidebar">
            <div className="editor-sidebar-header">
                Bloque: {selectedElement.element?.toUpperCase()}
            </div>

            <div className="element-actions">
                <button className="action-btn" onClick={() => onMoveUp(selectedElement.id)} title="Mover arriba">
                    <ArrowUp size={16} />
                </button>
                <button className="action-btn" onClick={() => onMoveDown(selectedElement.id)} title="Mover abajo">
                    <ArrowDown size={16} />
                </button>
                <button className="action-btn" onClick={() => onDuplicate(selectedElement.id)} title="Duplicar">
                    <Copy size={16} />
                </button>
                <button className="action-btn action-btn-delete" onClick={() => onDelete(selectedElement.id)} title="Eliminar">
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="editor-sidebar-content">
                <div className="mb-lg">
                    <h4 className="heading-5 mb-sm">ID</h4>
                    <p className="text-xs font-mono text-gray-600">{selectedElement.id}</p>
                </div>

                <div className="divider my-lg"></div>

                <h4 className="heading-5 mb-md">📝 Contenido</h4>

                {/* HEADING */}
                {selectedElement.element === 'heading' && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Texto</label>
                            <input
                                type="text"
                                className="form-input"
                                value={selectedElement.text || ''}
                                onChange={(e) => onUpdate(selectedElement.id, 'text', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Etiqueta</label>
                            <select
                                className="form-input"
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
                    <div className="form-group">
                        <label className="form-label">Texto</label>
                        <textarea
                            className="form-input"
                            rows="4"
                            value={selectedElement.text || ''}
                            onChange={(e) => onUpdate(selectedElement.id, 'text', e.target.value)}
                        />
                    </div>
                )}

                {/* IMAGE */}
                {selectedElement.element === 'image' && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Imagen</label>
                            {selectedElement.src && (
                                <div className="image-preview mb-sm">
                                    <img src={selectedElement.src} alt="Preview" style={{ maxWidth: '100%', borderRadius: '4px' }} />
                                </div>
                            )}

                            <div className="flex gap-xs mb-sm">
                                <label className="btn btn-sm flex-1" style={{ cursor: 'pointer', textAlign: 'center' }}>
                                    <Upload size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    Subir
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleImageUpload}
                                    />
                                </label>
                                <button
                                    className="btn btn-sm flex-1"
                                    onClick={() => setShowMediaLibrary(true)}
                                >
                                    <ImageIcon size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    Biblioteca
                                </button>
                            </div>

                            <input
                                type="text"
                                className="form-input text-sm"
                                placeholder="O pega una URL"
                                value={selectedElement.src || ''}
                                onChange={(e) => onUpdate(selectedElement.id, 'src', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Texto Alternativo</label>
                            <input
                                type="text"
                                className="form-input"
                                value={selectedElement.alt || ''}
                                onChange={(e) => onUpdate(selectedElement.id, 'alt', e.target.value)}
                                placeholder="Descripción de la imagen"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Alineación</label>
                            <div className="alignment-buttons">
                                <button
                                    className={`alignment-btn ${selectedElement.class?.includes('text-left') ? 'active' : ''}`}
                                    onClick={() => {
                                        const classes = (selectedElement.class || '').split(' ').filter(c => !c.includes('text-'));
                                        classes.push('text-left');
                                        onUpdate(selectedElement.id, 'class', classes.join(' '));
                                    }}
                                >
                                    ⬅️ Izquierda
                                </button>
                                <button
                                    className={`alignment-btn ${selectedElement.class?.includes('text-center') ? 'active' : ''}`}
                                    onClick={() => {
                                        const classes = (selectedElement.class || '').split(' ').filter(c => !c.includes('text-'));
                                        classes.push('text-center');
                                        onUpdate(selectedElement.id, 'class', classes.join(' '));
                                    }}
                                >
                                    ↔️ Centro
                                </button>
                                <button
                                    className={`alignment-btn ${selectedElement.class?.includes('text-right') ? 'active' : ''}`}
                                    onClick={() => {
                                        const classes = (selectedElement.class || '').split(' ').filter(c => !c.includes('text-'));
                                        classes.push('text-right');
                                        onUpdate(selectedElement.id, 'class', classes.join(' '));
                                    }}
                                >
                                    ➡️ Derecha
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Dimensiones</label>
                            <div className="flex gap-xs">
                                <input
                                    type="text"
                                    className="form-input text-sm flex-1"
                                    placeholder="Ancho"
                                    value={selectedElement.width || ''}
                                    onChange={(e) => onUpdate(selectedElement.id, 'width', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-input text-sm flex-1"
                                    placeholder="Alto"
                                    value={selectedElement.height || ''}
                                    onChange={(e) => onUpdate(selectedElement.id, 'height', e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-secondary mt-xs">Ej: 100%, 500px, auto</p>
                        </div>
                    </>
                )}

                {/* VIDEO */}
                {selectedElement.element === 'video' && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Tipo de Video</label>
                            <select
                                className="form-input"
                                value={selectedElement.type || 'upload'}
                                onChange={(e) => onUpdate(selectedElement.id, 'type', e.target.value)}
                            >
                                <option value="upload">Subir Video</option>
                                <option value="youtube">YouTube</option>
                            </select>
                        </div>

                        {selectedElement.type === 'youtube' ? (
                            <div className="form-group">
                                <label className="form-label">ID de YouTube</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="ej: dQw4w9WgXcQ"
                                    value={selectedElement.youtubeId || ''}
                                    onChange={(e) => onUpdate(selectedElement.id, 'youtubeId', e.target.value)}
                                />
                                <p className="text-xs text-secondary mt-xs">
                                    El ID está en la URL: youtube.com/watch?v=<strong>ID</strong>
                                </p>
                            </div>
                        ) : (
                            <div className="form-group">
                                <label className="form-label">URL del Video</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="https://..."
                                    value={selectedElement.src || ''}
                                    onChange={(e) => onUpdate(selectedElement.id, 'src', e.target.value)}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">
                                <input
                                    type="checkbox"
                                    checked={selectedElement.controls !== false}
                                    onChange={(e) => onUpdate(selectedElement.id, 'controls', e.target.checked)}
                                    style={{ marginRight: '8px' }}
                                />
                                Mostrar controles
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <input
                                    type="checkbox"
                                    checked={selectedElement.autoplay || false}
                                    onChange={(e) => onUpdate(selectedElement.id, 'autoplay', e.target.checked)}
                                    style={{ marginRight: '8px' }}
                                />
                                Reproducción automática
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <input
                                    type="checkbox"
                                    checked={selectedElement.loop || false}
                                    onChange={(e) => onUpdate(selectedElement.id, 'loop', e.target.checked)}
                                    style={{ marginRight: '8px' }}
                                />
                                Repetir en bucle
                            </label>
                        </div>
                    </>
                )}

                {/* BUTTON */}
                {selectedElement.element === 'button' && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Texto del Botón</label>
                            <input
                                type="text"
                                className="form-input"
                                value={selectedElement.text || ''}
                                onChange={(e) => onUpdate(selectedElement.id, 'text', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Enlace (URL)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={selectedElement.link || ''}
                                onChange={(e) => onUpdate(selectedElement.id, 'link', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Abrir en</label>
                            <select
                                className="form-input"
                                value={selectedElement.target || '_self'}
                                onChange={(e) => onUpdate(selectedElement.id, 'target', e.target.value)}
                            >
                                <option value="_self">Misma pestaña</option>
                                <option value="_blank">Nueva pestaña</option>
                            </select>
                        </div>
                    </>
                )}

                {/* SEARCH */}
                {selectedElement.element === 'search' && (
                    <div className="form-group">
                        <label className="form-label">Placeholder</label>
                        <input
                            type="text"
                            className="form-input"
                            value={selectedElement.placeholder || ''}
                            onChange={(e) => onUpdate(selectedElement.id, 'placeholder', e.target.value)}
                        />
                    </div>
                )}

                <div className="divider my-lg"></div>

                <h4 className="heading-5 mb-md">🎨 Clase CSS</h4>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-input font-mono text-sm"
                        value={selectedElement.class || ''}
                        onChange={(e) => onUpdate(selectedElement.id, 'class', e.target.value)}
                    />
                </div>
            </div>

            {/* Media Library Modal */}
            {showMediaLibrary && (
                <MediaLibraryModal
                    onSelect={(url) => {
                        onUpdate(selectedElement.id, 'src', url);
                        setShowMediaLibrary(false);
                    }}
                    onClose={() => setShowMediaLibrary(false)}
                />
            )}
        </div>
    );
}

/**
 * Modal de biblioteca de medios
 */
function MediaLibraryModal({ onSelect, onClose }) {
    // Imágenes de ejemplo - en producción vendrían de la biblioteca real
    const sampleImages = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
        'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400',
        'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400',
        'https://images.unsplash.com/photo-1617791160588-241658c0f566?w=400',
        'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=400',
        'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400'
    ];

    return (
        <div className="media-library-overlay" onClick={onClose}>
            <div className="media-library-modal" onClick={(e) => e.stopPropagation()}>
                <div className="media-library-header">
                    <h3 className="heading-4">Biblioteca de Medios</h3>
                    <button className="btn btn-sm" onClick={onClose}>Cerrar</button>
                </div>
                <div className="media-library-grid">
                    {sampleImages.map((url, index) => (
                        <div
                            key={index}
                            className="media-library-item"
                            onClick={() => onSelect(url)}
                        >
                            <img src={url} alt={`Media ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
