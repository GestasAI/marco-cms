import React from 'react';

export function ButtonEditor({ element, onUpdate }) {
    return (
        <>
            <div className="form-group-compact">
                <label className="form-label-compact">Texto</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={element.text || ''}
                    onChange={(e) => onUpdate(element.id, 'text', e.target.value)}
                />
            </div>
            <div className="form-group-compact">
                <label className="form-label-compact">Enlace</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={element.link || ''}
                    onChange={(e) => onUpdate(element.id, 'link', e.target.value)}
                />
            </div>
            <div className="form-group-compact">
                <label className="form-label-compact">Abrir en</label>
                <select
                    className="form-input-compact"
                    value={element.target || '_self'}
                    onChange={(e) => onUpdate(element.id, 'target', e.target.value)}
                >
                    <option value="_self">Misma ventana</option>
                    <option value="_blank">Nueva ventana</option>
                </select>
            </div>
        </>
    );
}
