import React from 'react';

export function ColorControl({ label, value, onChange, placeholder = '#000000' }) {
    return (
        <div className="form-group-compact">
            <label className="form-label-compact">{label}</label>
            <div className="color-picker-compact">
                <div className="color-swatch-compact" style={{
                    background: value || 'transparent',
                    border: !value ? '1px dashed #ccc' : '1px solid rgba(0,0,0,0.1)'
                }}>
                    <input
                        type="color"
                        value={value?.startsWith('#') ? value : '#ffffff'}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
                <input
                    type="text"
                    className="form-input-compact"
                    style={{ flex: 1 }}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}
