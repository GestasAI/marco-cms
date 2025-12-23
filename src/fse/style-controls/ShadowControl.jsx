import React, { useState, useEffect } from 'react';
import { ColorControl } from './ColorControl';

export function ShadowControl({ value, onChange }) {
    const [x, setX] = useState(0);
    const [y, setY] = useState(4);
    const [blur, setBlur] = useState(10);
    const [spread, setSpread] = useState(0);
    const [color, setColor] = useState('rgba(0,0,0,0.1)');

    // Parse existing box-shadow
    useEffect(() => {
        if (value && value !== 'none') {
            // Very basic parsing for "X Y Blur Spread Color"
            const parts = value.split(' ');
            if (parts.length >= 4) {
                setX(parseInt(parts[0]) || 0);
                setY(parseInt(parts[1]) || 0);
                setBlur(parseInt(parts[2]) || 0);
                setSpread(parseInt(parts[3]) || 0);
                setColor(parts.slice(4).join(' ') || 'rgba(0,0,0,0.1)');
            }
        }
    }, [value]);

    const updateShadow = (nx, ny, nb, ns, nc) => {
        onChange(`${nx}px ${ny}px ${nb}px ${ns}px ${nc}`);
    };

    return (
        <div className="shadow-controls">
            <div className="form-row-compact">
                <div className="form-group-compact half">
                    <label className="form-label-compact">Offset X</label>
                    <input
                        type="number"
                        className="form-input-compact"
                        value={x}
                        onChange={(e) => { setX(e.target.value); updateShadow(e.target.value, y, blur, spread, color); }}
                    />
                </div>
                <div className="form-group-compact half">
                    <label className="form-label-compact">Offset Y</label>
                    <input
                        type="number"
                        className="form-input-compact"
                        value={y}
                        onChange={(e) => { setY(e.target.value); updateShadow(x, e.target.value, blur, spread, color); }}
                    />
                </div>
            </div>

            <div className="form-row-compact">
                <div className="form-group-compact half">
                    <label className="form-label-compact">Blur</label>
                    <input
                        type="number"
                        className="form-input-compact"
                        value={blur}
                        onChange={(e) => { setBlur(e.target.value); updateShadow(x, y, e.target.value, spread, color); }}
                    />
                </div>
                <div className="form-group-compact half">
                    <label className="form-label-compact">Spread</label>
                    <input
                        type="number"
                        className="form-input-compact"
                        value={spread}
                        onChange={(e) => { setSpread(e.target.value); updateShadow(x, y, blur, e.target.value, color); }}
                    />
                </div>
            </div>

            <ColorControl
                label="Color de Sombra"
                value={color}
                onChange={(val) => { setColor(val); updateShadow(x, y, blur, spread, val); }}
            />

            <div className="mt-xs">
                <label className="form-label-compact">CSS Directo</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="0 4px 10px rgba(0,0,0,0.1)"
                />
            </div>
        </div>
    );
}
