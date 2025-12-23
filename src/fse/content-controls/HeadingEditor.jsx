import React from 'react';

export function HeadingEditor({ element, onUpdate }) {
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
                <label className="form-label-compact">Etiqueta</label>
                <select
                    className="form-input-compact"
                    value={element.tag || 'h2'}
                    onChange={(e) => onUpdate(element.id, 'tag', e.target.value)}
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
    );
}
