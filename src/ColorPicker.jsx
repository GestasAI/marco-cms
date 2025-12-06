import React from 'react';

const ColorPicker = ({ label, value, onChange }) => {
    return (
        <div className="color-picker">
            <label className="form-label">{label}</label>
            <div className="color-picker-input">
                <input
                    type="color"
                    className="color-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <input
                    type="text"
                    className="color-text-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default ColorPicker;