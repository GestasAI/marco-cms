import React from 'react';

export function TypographyControl({ styles, onChange }) {
    const handleUpdate = (prop, value) => {
        onChange(prop, value);
    };

    return (
        <div className="typography-controls">
            <div className="form-row-compact">
                <div className="form-group-compact half">
                    <label className="form-label-compact">Tamaño</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={styles['fontSize'] || ''}
                        onChange={(e) => handleUpdate('fontSize', e.target.value)}
                        placeholder="16px"
                    />
                </div>
                <div className="form-group-compact half">
                    <label className="form-label-compact">Peso</label>
                    <select
                        className="form-input-compact"
                        value={styles['fontWeight'] || ''}
                        onChange={(e) => handleUpdate('fontWeight', e.target.value)}
                    >
                        <option value="">Default</option>
                        <option value="100">Thin</option>
                        <option value="300">Light</option>
                        <option value="400">Regular</option>
                        <option value="500">Medium</option>
                        <option value="600">SemiBold</option>
                        <option value="700">Bold</option>
                        <option value="900">Black</option>
                    </select>
                </div>
            </div>

            <div className="form-row-compact">
                <div className="form-group-compact half">
                    <label className="form-label-compact">Line Height</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={styles['lineHeight'] || ''}
                        onChange={(e) => handleUpdate('lineHeight', e.target.value)}
                        placeholder="1.5"
                    />
                </div>
                <div className="form-group-compact half">
                    <label className="form-label-compact">Letter Spacing</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={styles['letterSpacing'] || ''}
                        onChange={(e) => handleUpdate('letterSpacing', e.target.value)}
                        placeholder="0px"
                    />
                </div>
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Transformación</label>
                <div className="button-grid-compact">
                    <button
                        className={styles['textTransform'] === 'uppercase' ? 'active' : ''}
                        onClick={() => handleUpdate('textTransform', styles['textTransform'] === 'uppercase' ? '' : 'uppercase')}
                    >
                        TT
                    </button>
                    <button
                        className={styles['fontStyle'] === 'italic' ? 'active' : ''}
                        onClick={() => handleUpdate('fontStyle', styles['fontStyle'] === 'italic' ? '' : 'italic')}
                    >
                        <i>I</i>
                    </button>
                    <button
                        className={styles['textDecoration'] === 'underline' ? 'active' : ''}
                        onClick={() => handleUpdate('textDecoration', styles['textDecoration'] === 'underline' ? '' : 'underline')}
                    >
                        <u>U</u>
                    </button>
                </div>
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Sombra de Texto</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={styles['textShadow'] || ''}
                    onChange={(e) => handleUpdate('textShadow', e.target.value)}
                    placeholder="2px 2px 4px rgba(0,0,0,0.3)"
                />
            </div>
        </div>
    );
}
