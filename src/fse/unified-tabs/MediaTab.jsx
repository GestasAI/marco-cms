import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { acideService } from '../../acide/acideService';
import { MediaLibraryModal } from '../components/MediaLibraryModal';

/**
 * Pestaña Media - Gestión de imágenes y videos
 */
export function MediaTab({ selectedElement, onUpdate, onUpdateMultiple }) {
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [mediaLibrary, setMediaLibrary] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showMediaLibrary) loadMediaLibrary();
    }, [showMediaLibrary]);

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
            const updates = {
                src: uploadedFile.url,
                mediaId: uploadedFile.id,
                mediaData: uploadedFile
            };

            if (type === 'image') updates.alt = uploadedFile.title || 'Imagen';

            if (onUpdateMultiple) {
                onUpdateMultiple(selectedElement.id, updates);
            } else {
                Object.keys(updates).forEach(key => onUpdate(selectedElement.id, key, updates[key]));
            }

            await loadMediaLibrary();
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
        const updates = {
            src: media.url,
            mediaId: media.id,
            mediaData: media
        };

        if (selectedElement.element === 'image') {
            updates.alt = media.title || 'Imagen';
        }

        if (onUpdateMultiple) {
            onUpdateMultiple(selectedElement.id, updates);
        } else {
            Object.keys(updates).forEach(key => onUpdate(selectedElement.id, key, updates[key]));
        }

        setShowMediaLibrary(false);
    };

    if (selectedElement.element !== 'image' && selectedElement.element !== 'video') {
        return (
            <div className="tab-content">
                <p className="text-xs text-gray-600">Solo disponible para imagen y video.</p>
            </div>
        );
    }

    return (
        <div className="tab-content">
            {selectedElement.element === 'image' && (
                <>
                    {selectedElement.src && (
                        <div className="form-group-compact">
                            <label className="form-label-compact">Vista Previa</label>
                            <div className="preview-container-compact">
                                <img src={selectedElement.src} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} />
                            </div>
                        </div>
                    )}

                    <div className="form-group-compact">
                        <label className="btn btn-sm w-full text-center">
                            <Upload size={14} className="inline mr-1" />
                            {uploading ? 'Subiendo...' : 'Subir Imagen'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploading} />
                        </label>
                    </div>

                    <button className="btn btn-sm w-full mb-md" onClick={() => setShowMediaLibrary(true)}>
                        <ImageIcon size={14} className="inline mr-1" /> Biblioteca
                    </button>

                    <div className="form-group-compact">
                        <label className="form-label-compact">URL</label>
                        <input type="text" className="form-input-compact" value={selectedElement.src || ''} onChange={(e) => onUpdate(selectedElement.id, 'src', e.target.value)} />
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Alt</label>
                        <input type="text" className="form-input-compact" value={selectedElement.alt || ''} onChange={(e) => onUpdate(selectedElement.id, 'alt', e.target.value)} />
                    </div>
                </>
            )}

            {selectedElement.element === 'video' && (
                <>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Tipo</label>
                        <select className="form-input-compact" value={selectedElement.type || 'upload'} onChange={(e) => onUpdate(selectedElement.id, 'type', e.target.value)}>
                            <option value="upload">Subir</option>
                            <option value="youtube">YouTube</option>
                        </select>
                    </div>

                    {selectedElement.type === 'youtube' ? (
                        <div className="form-group-compact">
                            <label className="form-label-compact">YouTube ID</label>
                            <input type="text" className="form-input-compact" value={selectedElement.youtubeId || ''} onChange={(e) => onUpdate(selectedElement.id, 'youtubeId', e.target.value)} />
                        </div>
                    ) : (
                        <button className="btn btn-sm w-full" onClick={() => setShowMediaLibrary(true)}>Biblioteca</button>
                    )}
                </>
            )}

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
