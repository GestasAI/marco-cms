import React from 'react';

const ColorPicker = ({ label, value, onChange }) => {
    return (
        <div className="color-picker">
            <label>{label}</label>
            <div className="color-input-wrapper">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default ColorPicker;