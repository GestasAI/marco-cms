import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { acideService } from '../../acide/acideService';

/**
 * Pestaña Media - Gestión de imágenes y videos
 * Usa acideService para acceder a la misma biblioteca que el Dashboard
 */
export function MediaTab({ selectedElement, onUpdate, onUpdateMultiple }) {
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [mediaLibrary, setMediaLibrary] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showMediaLibrary) {
            loadMediaLibrary();
        }
    }, [showMediaLibrary]);

    useEffect(() => {
        console.log('🔄 selectedElement.src cambió a:', selectedElement.src);
    }, [selectedElement.src]);

    const loadMediaLibrary = async () => {
        try {
            setLoading(true);
            const list = await acideService.list('media');
            const sortedList = (list || []).sort((a, b) =>
                new Date(b.created_at || 0) - new Date(a.created_at || 0)
            );
            setMediaLibrary(sortedList);
        } catch (error) {
            console.error("Error loading media:", error);
            setMediaLibrary([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e, type = 'image') => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadedFile = await acideService.upload(file);

            console.log('📤 Archivo subido:', uploadedFile);

            // Actualizar URL inmediatamente
            const updates = {
                src: uploadedFile.url,
                mediaId: uploadedFile.id,
                mediaData: {
                    id: uploadedFile.id,
                    filename: uploadedFile.filename,
                    title: uploadedFile.title,
                    type: uploadedFile.type,
                    size: uploadedFile.size,
                    url: uploadedFile.url,
                    created_at: uploadedFile.created_at
                }
            };

            if (type === 'image') {
                updates.alt = uploadedFile.title || 'Imagen';
            }

            if (onUpdateMultiple) {
                onUpdateMultiple(selectedElement.id, updates);
            } else {
                Object.keys(updates).forEach(key => {
                    onUpdate(selectedElement.id, key, updates[key]);
                });
            }

            // Recargar biblioteca
            await loadMediaLibrary();

            console.log('✅ Archivo guardado en documento');
            alert(`✅ ${type === 'image' ? 'Imagen' : 'Video'} subida exitosamente`);
        } catch (error) {
            console.error('Error:', error);
            alert(`❌ Error al subir archivo: ${error.message}`);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleSelectFromLibrary = (media) => {
        console.log('📸 Seleccionando media:', media);

        // Preparar TODAS las propiedades en un solo objeto
        const updates = {
            src: media.url,
            mediaId: media.id,
            mediaData: {
                id: media.id,
                filename: media.filename,
                title: media.title,
                type: media.type,
                size: media.size,
                url: media.url,
                created_at: media.created_at
            }
        };

        if (selectedElement.element === 'image') {
            updates.alt = media.title || 'Imagen';
            updates.width = selectedElement.width || '100%';
            updates.height = selectedElement.height || 'auto';
        }

        // UNA SOLA LLAMADA para actualizar TODO
        if (onUpdateMultiple) {
            onUpdateMultiple(selectedElement.id, updates);
            console.log('✅ Media guardado con onUpdateMultiple:', updates);
        } else {
            // Fallback: múltiples llamadas
            Object.keys(updates).forEach(key => {
                onUpdate(selectedElement.id, key, updates[key]);
            });
            console.log('✅ Media guardado con onUpdate múltiple:', updates);
        }

        setShowMediaLibrary(false);
    };

    // Solo mostrar para image o video
    if (selectedElement.element !== 'image' && selectedElement.element !== 'video') {
        return (
            <div className="tab-content">
                <p className="text-xs text-gray-600">
                    Esta pestaña solo está disponible para elementos de imagen y video.
                </p>
            </div>
        );
    }

    return (
        <div className="tab-content">
            {/* IMAGE */}
            {selectedElement.element === 'image' && (
                <>
                    {selectedElement.src && (
                        <div className="form-group-compact">
                            <label className="form-label-compact">Vista Previa</label>
                            <div style={{
                                width: '100%',
                                maxHeight: '150px',
                                overflow: 'hidden',
                                borderRadius: '4px',
                                background: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img
                                    key={selectedElement.src}
                                    src={selectedElement.src}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                                    onError={(e) => {
                                        console.error('Error cargando imagen:', selectedElement.src);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group-compact">
                        <label className="form-label-compact">Subir Imagen</label>
                        <label className="btn btn-sm" style={{ cursor: 'pointer', textAlign: 'center', display: 'block' }}>
                            <Upload size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            {uploading ? 'Subiendo...' : 'Elegir Archivo'}
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, 'image')}
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    <div className="form-group-compact">
                        <button
                            className="btn btn-sm"
                            style={{ width: '100%', textAlign: 'center' }}
                            onClick={() => setShowMediaLibrary(true)}
                        >
                            <ImageIcon size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            Biblioteca de Medios
                        </button>
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">URL de Imagen</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            placeholder="O pega una URL"
                            value={selectedElement.src || ''}
                            onChange={(e) => onUpdate(selectedElement.id, 'src', e.target.value)}
                        />
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Texto Alternativo</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            value={selectedElement.alt || ''}
                            onChange={(e) => onUpdate(selectedElement.id, 'alt', e.target.value)}
                            placeholder="Descripción de la imagen"
                        />
                    </div>

                    <div className="divider-compact"></div>

                    <div className="section-header-compact">Dimensiones</div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Ancho</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            placeholder="100%, 500px, auto"
                            value={selectedElement.width || ''}
                            onChange={(e) => onUpdate(selectedElement.id, 'width', e.target.value)}
                        />
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Alto</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            placeholder="100%, 500px, auto"
                            value={selectedElement.height || ''}
                            onChange={(e) => onUpdate(selectedElement.id, 'height', e.target.value)}
                        />
                    </div>
                </>
            )}

            {/* VIDEO */}
            {selectedElement.element === 'video' && (
                <>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Tipo de Video</label>
                        <select
                            className="form-input-compact"
                            value={selectedElement.type || 'upload'}
                            onChange={(e) => onUpdate(selectedElement.id, 'type', e.target.value)}
                        >
                            <option value="upload">Subir Video</option>
                            <option value="youtube">YouTube</option>
                        </select>
                    </div>

                    {selectedElement.type === 'youtube' ? (
                        <div className="form-group-compact">
                            <label className="form-label-compact">ID de YouTube</label>
                            <input
                                type="text"
                                className="form-input-compact"
                                placeholder="ej: dQw4w9WgXcQ"
                                value={selectedElement.youtubeId || ''}
                                onChange={(e) => onUpdate(selectedElement.id, 'youtubeId', e.target.value)}
                            />
                            <p className="text-xs text-secondary" style={{ marginTop: '4px' }}>
                                El ID está en la URL: youtube.com/watch?v=<strong>ID</strong>
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="form-group-compact">
                                <label className="form-label-compact">Subir Video</label>
                                <label className="btn btn-sm" style={{ cursor: 'pointer', textAlign: 'center', display: 'block' }}>
                                    <Upload size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    {uploading ? 'Subiendo...' : 'Elegir Archivo'}
                                    <input
                                        type="file"
                                        accept="video/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileUpload(e, 'video')}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            <div className="form-group-compact">
                                <button
                                    className="btn btn-sm"
                                    style={{ width: '100%', textAlign: 'center' }}
                                    onClick={() => setShowMediaLibrary(true)}
                                >
                                    <ImageIcon size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    Biblioteca de Medios
                                </button>
                            </div>

                            <div className="form-group-compact">
                                <label className="form-label-compact">URL del Video</label>
                                <input
                                    type="text"
                                    className="form-input-compact"
                                    placeholder="https://..."
                                    value={selectedElement.src || ''}
                                    onChange={(e) => onUpdate(selectedElement.id, 'src', e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className="divider-compact"></div>

                    <div className="section-header-compact">Opciones</div>

                    <div className="form-group-compact">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                            <input
                                type="checkbox"
                                checked={selectedElement.controls !== false}
                                onChange={(e) => onUpdate(selectedElement.id, 'controls', e.target.checked)}
                            />
                            Mostrar controles
                        </label>
                    </div>

                    <div className="form-group-compact">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                            <input
                                type="checkbox"
                                checked={selectedElement.autoplay || false}
                                onChange={(e) => onUpdate(selectedElement.id, 'autoplay', e.target.checked)}
                            />
                            Reproducción automática
                        </label>
                    </div>

                    <div className="form-group-compact">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                            <input
                                type="checkbox"
                                checked={selectedElement.loop || false}
                                onChange={(e) => onUpdate(selectedElement.id, 'loop', e.target.checked)}
                            />
                            Repetir en bucle
                        </label>
                    </div>

                    <div className="form-group-compact">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                            <input
                                type="checkbox"
                                checked={selectedElement.muted || false}
                                onChange={(e) => onUpdate(selectedElement.id, 'muted', e.target.checked)}
                            />
                            Silenciar audio
                        </label>
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Imagen de Portada (Poster)</label>
                        <input
                            type="text"
                            className="form-input-compact"
                            placeholder="URL de la imagen"
                            value={selectedElement.poster || ''}
                            onChange={(e) => onUpdate(selectedElement.id, 'poster', e.target.value)}
                        />
                        <p className="text-xs text-secondary" style={{ marginTop: '4px' }}>
                            {selectedElement.type === 'youtube'
                                ? 'Imagen que se muestra antes de cargar YouTube'
                                : 'Imagen que se muestra antes de reproducir'}
                        </p>
                    </div>
                </>
            )}

            {/* Modal de Biblioteca de Medios */}
            {showMediaLibrary && (
                <MediaLibraryModal
                    mediaLibrary={mediaLibrary}
                    loading={loading}
                    elementType={selectedElement.element}
                    onSelect={handleSelectFromLibrary}
                    onClose={() => setShowMediaLibrary(false)}
                />
            )}
        </div>
    );
}

/**
 * Modal de Biblioteca de Medios
 */
function MediaLibraryModal({ mediaLibrary, loading, elementType, onSelect, onClose }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '20px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                        Biblioteca de Medios
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        Cargando medios...
                    </div>
                ) : mediaLibrary.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        <ImageIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <p>No hay {elementType === 'image' ? 'imágenes' : 'videos'} en la biblioteca</p>
                        <p style={{ fontSize: '12px', marginTop: '8px' }}>
                            Sube archivos desde el Dashboard → Medios
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '12px'
                    }}>
                        {mediaLibrary
                            .filter(media => {
                                if (elementType === 'image') return media.type?.includes('image');
                                if (elementType === 'video') return media.type?.includes('video');
                                return true;
                            })
                            .map(media => (
                                <div
                                    key={media.id}
                                    onClick={() => onSelect(media)}
                                    style={{
                                        cursor: 'pointer',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#2196f3';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e0e0e0';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <div style={{
                                        aspectRatio: '1',
                                        background: '#f5f5f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {media.type?.includes('image') ? (
                                            <img
                                                src={media.url}
                                                alt={media.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ color: '#ef4444' }}>
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                                </div>
                                                <span style={{ fontSize: '9px', color: '#666' }}>VIDEO</span>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{
                                        padding: '6px',
                                        fontSize: '10px',
                                        textAlign: 'center',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        background: 'white'
                                    }}>
                                        {media.title}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
