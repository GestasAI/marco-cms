import React from 'react';
import { MediaControl } from '../style-controls/MediaControl';

/**
 * Pestaña Media - Gestión de imágenes y videos (Refactorizada)
 */
export function MediaTab({ selectedElement, onUpdate, onUpdateMultiple }) {

    if (selectedElement.element !== 'image' && selectedElement.element !== 'video') {
        return (
            <div className="tab-content p-md text-center">
                <p className="text-xs text-gray-500">Este elemento no soporta medios directos.</p>
            </div>
        );
    }

    const handleMediaChange = (url, mediaData) => {
        const updates = { src: url };
        if (mediaData) {
            updates.mediaId = mediaData.id;
            updates.mediaData = mediaData;
        }

        if (onUpdateMultiple) {
            onUpdateMultiple(selectedElement.id, updates);
        } else {
            Object.keys(updates).forEach(key => onUpdate(selectedElement.id, key, updates[key]));
        }
    };

    const handleAltChange = (alt) => {
        onUpdate(selectedElement.id, 'alt', alt);
    };

    return (
        <div className="tab-content">
            {selectedElement.element === 'video' && (
                <div className="form-group-compact mb-md">
                    <label className="form-label-compact">Tipo de Video</label>
                    <select
                        className="form-input-compact"
                        value={selectedElement.type || 'upload'}
                        onChange={(e) => onUpdate(selectedElement.id, 'type', e.target.value)}
                    >
                        <option value="upload">Archivo / Biblioteca</option>
                        <option value="youtube">YouTube</option>
                    </select>
                </div>
            )}

            {selectedElement.element === 'video' && selectedElement.type === 'youtube' ? (
                <div className="form-group-compact">
                    <label className="form-label-compact">YouTube ID</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={selectedElement.youtubeId || ''}
                        onChange={(e) => onUpdate(selectedElement.id, 'youtubeId', e.target.value)}
                        placeholder="ej: dQw4w9WgXcQ"
                    />
                </div>
            ) : (
                <MediaControl
                    label={selectedElement.element === 'image' ? "Imagen" : "Archivo de Video"}
                    value={selectedElement.src}
                    type={selectedElement.element}
                    altValue={selectedElement.alt}
                    onChange={handleMediaChange}
                    onAltChange={selectedElement.element === 'image' ? handleAltChange : null}
                />
            )}
        </div>
    );
}
