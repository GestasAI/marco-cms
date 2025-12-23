import React from 'react';

export function VideoEditor({ element, onUpdate }) {
    return (
        <>
            <div className="form-group-compact">
                <label className="form-label-compact">Tipo de Video</label>
                <select
                    className="form-input-compact"
                    value={element.type || 'local'}
                    onChange={(e) => onUpdate(element.id, 'type', e.target.value)}
                >
                    <option value="local">Archivo Local / URL</option>
                    <option value="youtube">YouTube</option>
                </select>
            </div>

            {element.type === 'youtube' ? (
                <div className="form-group-compact">
                    <label className="form-label-compact">ID de YouTube</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={element.youtubeId || ''}
                        onChange={(e) => onUpdate(element.id, 'youtubeId', e.target.value)}
                        placeholder="dQw4w9WgXcQ"
                    />
                </div>
            ) : (
                <div className="form-group-compact">
                    <label className="form-label-compact">URL del Video</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={element.src || ''}
                        onChange={(e) => onUpdate(element.id, 'src', e.target.value)}
                        placeholder="/path/to/video.mp4"
                    />
                </div>
            )}

            <div className="form-group-compact">
                <label className="form-label-compact">Imagen Poster (Opcional)</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={element.poster || ''}
                    onChange={(e) => onUpdate(element.id, 'poster', e.target.value)}
                    placeholder="/path/to/poster.jpg"
                />
            </div>

            <div className="form-row-compact mt-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={element.autoplay || false}
                        onChange={(e) => onUpdate(element.id, 'autoplay', e.target.checked)}
                    />
                    <span className="text-xs">Autoplay</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={element.muted || false}
                        onChange={(e) => onUpdate(element.id, 'muted', e.target.checked)}
                    />
                    <span className="text-xs">Silenciado</span>
                </label>
            </div>
        </>
    );
}
