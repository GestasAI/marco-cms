import './FontPicker.css';

/**
 * FontPicker - Selector de fuentes
 * Permite elegir entre fuentes populares de Google Fonts
 */
export default function FontPicker({ label, value, onChange }) {
    const fonts = [
        { name: 'Inter', value: "'Inter', sans-serif" },
        { name: 'Roboto', value: "'Roboto', sans-serif" },
        { name: 'Open Sans', value: "'Open Sans', sans-serif" },
        { name: 'Lato', value: "'Lato', sans-serif" },
        { name: 'Montserrat', value: "'Montserrat', sans-serif" },
        { name: 'Outfit', value: "'Outfit', sans-serif" },
        { name: 'Poppins', value: "'Poppins', sans-serif" },
        { name: 'Raleway', value: "'Raleway', sans-serif" },
        { name: 'Playfair Display', value: "'Playfair Display', serif" },
        { name: 'Merriweather', value: "'Merriweather', serif" },
        { name: 'Fira Code', value: "'Fira Code', monospace" },
        { name: 'JetBrains Mono', value: "'JetBrains Mono', monospace" }
    ];

    return (
        <div className="font-picker">
            <label className="font-label">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="font-select"
            >
                {fonts.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.name}
                    </option>
                ))}
            </select>
            <div className="font-preview" style={{ fontFamily: value }}>
                The quick brown fox jumps over the lazy dog
            </div>
        </div>
    );
}
