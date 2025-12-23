import React from 'react';

export function TextEditor({ element, onUpdate }) {
    return (
        <div className="form-group-compact">
            <label className="form-label-compact">Texto</label>
            <textarea
                className="form-input-compact"
                rows="3"
                value={element.text || ''}
                onChange={(e) => onUpdate(element.id, 'text', e.target.value)}
            />
        </div>
    );
}
