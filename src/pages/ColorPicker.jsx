import { useState } from 'react';
import './ColorPicker.css';

/**
 * ColorPicker - Selector de color visual
 * Permite elegir colores con preview en tiempo real
 */
export default function ColorPicker({ label, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const presetColors = [
        '#3B82F6', // Blue
        '#8B5CF6', // Purple
        '#10B981', // Green
        '#F59E0B', // Amber
        '#EF4444', // Red
        '#06B6D4', // Cyan
        '#EC4899', // Pink
        '#6366F1', // Indigo
        '#14B8A6', // Teal
        '#F97316', // Orange
        '#1F2937', // Gray Dark
        '#FFFFFF'  // White
    ];

    return (
        <div className="color-picker">
            <label className="color-label">{label}</label>
            <div className="color-input-wrapper">
                <button
                    className="color-preview"
                    style={{ background: value }}
                    onClick={() => setIsOpen(!isOpen)}
                    title={value}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="color-text-input"
                    placeholder="#000000"
                />
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="color-native-input"
                />
            </div>

            {isOpen && (
                <div className="color-presets">
                    {presetColors.map((color) => (
                        <button
                            key={color}
                            className="preset-color"
                            style={{ background: color }}
                            onClick={() => {
                                onChange(color);
                                setIsOpen(false);
                            }}
                            title={color}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
