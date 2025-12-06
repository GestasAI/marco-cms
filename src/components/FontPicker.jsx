import React from 'react';

const FontPicker = ({ label, value, onChange, options }) => {
    return (
        <div className="font-picker">
            <label>{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map(font => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FontPicker;