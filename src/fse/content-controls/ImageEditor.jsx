import React from 'react';

export function ImageEditor({ element, onUpdate }) {
    return (
        <>
            <div className="form-group-compact">
                <label className="form-label-compact">URL de Imagen</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={element.src || ''}
                    onChange={(e) => onUpdate(element.id, 'src', e.target.value)}
                    placeholder="/path/to/image.jpg"
                />
            </div>
            <div className="form-group-compact">
                <label className="form-label-compact">Texto Alt</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={element.alt || ''}
                    onChange={(e) => onUpdate(element.id, 'alt', e.target.value)}
                    placeholder="Descripción de la imagen"
                />
            </div>
        </>
    );
}
