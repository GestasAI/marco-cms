import React from 'react';
import { ColorControl } from './ColorControl';

export function BorderControl({ styles, onChange }) {
    const handleUpdate = (prop, value) => {
        onChange(prop, value);
    };

    return (
        <div className="border-controls">
            <div className="form-row-compact">
                <div className="form-group-compact half">
                    <label className="form-label-compact">Grosor</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={styles['borderWidth'] || ''}
                        onChange={(e) => handleUpdate('borderWidth', e.target.value)}
                        placeholder="1px"
                    />
                </div>
                <div className="form-group-compact half">
                    <label className="form-label-compact">Estilo</label>
                    <select
                        className="form-input-compact"
                        value={styles['borderStyle'] || ''}
                        onChange={(e) => handleUpdate('borderStyle', e.target.value)}
                    >
                        <option value="">Ninguno</option>
                        <option value="solid">Sólido</option>
                        <option value="dashed">Guiones</option>
                        <option value="dotted">Puntos</option>
                        <option value="double">Doble</option>
                    </select>
                </div>
            </div>

            <ColorControl
                label="Color de Borde"
                value={styles['borderColor']}
                onChange={(val) => handleUpdate('borderColor', val)}
            />

            <div className="form-group-compact">
                <label className="form-label-compact">Radio (Border Radius)</label>
                <div className="granular-grid">
                    <div className="form-group-compact">
                        <input
                            type="text"
                            className="form-input-compact"
                            value={styles['borderTopLeftRadius'] || ''}
                            onChange={(e) => handleUpdate('borderTopLeftRadius', e.target.value)}
                            placeholder="TL"
                        />
                    </div>
                    <div className="form-group-compact">
                        <input
                            type="text"
                            className="form-input-compact"
                            value={styles['borderTopRightRadius'] || ''}
                            onChange={(e) => handleUpdate('borderTopRightRadius', e.target.value)}
                            placeholder="TR"
                        />
                    </div>
                    <div className="form-group-compact">
                        <input
                            type="text"
                            className="form-input-compact"
                            value={styles['borderBottomLeftRadius'] || ''}
                            onChange={(e) => handleUpdate('borderBottomLeftRadius', e.target.value)}
                            placeholder="BL"
                        />
                    </div>
                    <div className="form-group-compact">
                        <input
                            type="text"
                            className="form-input-compact"
                            value={styles['borderBottomRightRadius'] || ''}
                            onChange={(e) => handleUpdate('borderBottomRightRadius', e.target.value)}
                            placeholder="BR"
                        />
                    </div>
                </div>
                <div className="mt-xs">
                    <input
                        type="text"
                        className="form-input-compact"
                        value={styles['borderRadius'] || ''}
                        onChange={(e) => handleUpdate('borderRadius', e.target.value)}
                        placeholder="Radio global (ej: 8px)"
                    />
                </div>
            </div>
        </div>
    );
}
