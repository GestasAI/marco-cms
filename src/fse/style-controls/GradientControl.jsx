import React, { useState, useEffect } from 'react';
import { ColorControl } from './ColorControl';

export function GradientControl({ value, onChange }) {
    const [type, setType] = useState('linear');
    const [angle, setAngle] = useState(90);
    const [color1, setColor1] = useState('#ffffff');
    const [color2, setColor2] = useState('#000000');
    const [color3, setColor3] = useState('');
    const [useColor3, setUseColor3] = useState(false);

    // Parse existing value if it's a gradient
    useEffect(() => {
        if (value && value.includes('gradient')) {
            if (value.includes('radial')) setType('radial');
            else setType('linear');

            // Very basic parsing for now
            const angleMatch = value.match(/(\d+)deg/);
            if (angleMatch) setAngle(parseInt(angleMatch[1]));

            const colors = value.match(/#[a-fA-F0-9]{6}|rgba?\([^)]+\)/g);
            if (colors && colors.length >= 2) {
                setColor1(colors[0]);
                setColor2(colors[1]);
                if (colors.length >= 3) {
                    setColor3(colors[2]);
                    setUseColor3(true);
                }
            }
        }
    }, [value]);

    const updateGradient = (newType, newAngle, c1, c2, c3, useC3) => {
        let gradientStr = '';
        if (newType === 'linear') {
            gradientStr = `linear-gradient(${newAngle}deg, ${c1} 0%, ${c2} ${useC3 ? '50%' : '100%'}${useC3 ? `, ${c3} 100%` : ''})`;
        } else {
            gradientStr = `radial-gradient(circle, ${c1} 0%, ${c2} ${useC3 ? '50%' : '100%'}${useC3 ? `, ${c3} 100%` : ''})`;
        }
        onChange(gradientStr);
    };

    return (
        <div className="gradient-editor-compact">
            <div className="form-group-compact">
                <label className="form-label-compact">Tipo de Degradado</label>
                <div className="button-grid-compact">
                    <button
                        className={type === 'linear' ? 'active' : ''}
                        onClick={() => { setType('linear'); updateGradient('linear', angle, color1, color2, color3, useColor3); }}
                    >
                        Lineal
                    </button>
                    <button
                        className={type === 'radial' ? 'active' : ''}
                        onClick={() => { setType('radial'); updateGradient('radial', angle, color1, color2, color3, useColor3); }}
                    >
                        Radial
                    </button>
                </div>
            </div>

            {type === 'linear' && (
                <div className="form-group-compact">
                    <label className="form-label-compact">Ángulo ({angle}°)</label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={angle}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setAngle(val);
                            updateGradient(type, val, color1, color2, color3, useColor3);
                        }}
                    />
                </div>
            )}

            <ColorControl
                label="Color 1"
                value={color1}
                onChange={(val) => {
                    setColor1(val);
                    updateGradient(type, angle, val, color2, color3, useColor3);
                }}
            />

            <ColorControl
                label="Color 2"
                value={color2}
                onChange={(val) => {
                    setColor2(val);
                    updateGradient(type, angle, color1, val, color3, useColor3);
                }}
            />

            <div className="form-group-compact">
                <label className="form-label-compact" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={useColor3}
                        onChange={(e) => {
                            setUseColor3(e.target.checked);
                            updateGradient(type, angle, color1, color2, color3, e.target.checked);
                        }}
                    />
                    Usar tercer color
                </label>
            </div>

            {useColor3 && (
                <ColorControl
                    label="Color 3"
                    value={color3 || '#000000'}
                    onChange={(val) => {
                        setColor3(val);
                        updateGradient(type, angle, color1, color2, val, useColor3);
                    }}
                />
            )}

            <div
                className="gradient-preview-box"
                style={{
                    height: '40px',
                    borderRadius: '4px',
                    marginTop: '8px',
                    background: value || 'transparent',
                    border: '1px solid #ddd'
                }}
            ></div>
        </div>
    );
}
